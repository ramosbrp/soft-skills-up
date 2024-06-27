<?php
session_start();

use ApplicationInsights\Telemetry_Client;

require_once '../vendor/autoload.php';

// Apenas carregar dotenv em ambientes que não são de produção
if (getenv('APP_ENV') === 'development') {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
}

$instrumentalKey = getenv('INSTRUMENTATION_KEY');

// Configuração do Application Insights
$client = new Telemetry_Client();
$client->getContext()->setInstrumentationKey($instrumentalKey);

// Função para criar conexão com o banco de dados
function createDatabaseConnection()
{
    $dbHost = getenv('DB_HOST');
    $dbDatabase = getenv('DB_DATABASE');
    $dbUser = getenv('DB_USERNAME');
    $dbPassword = getenv('DB_PASSWORD');

    global $client;  // Usar o cliente de telemetria global
    try {
        $conn = new PDO("sqlsrv:server = tcp:$dbHost; Database = $dbDatabase", $dbUser, $dbPassword);

        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        $client->trackException($e);
        error_log("Error connecting to SQL Server: " . $e->getMessage());
        die("Error connecting to SQL Server.");
        // echo"<script>console.log()</script>";
    }
}

// Função para validar o login do usuário
function validateUser($login, $password)
{
    global $client;  // Usar o cliente de telemetria global
    $conn = createDatabaseConnection();

    try {
        $query = "SELECT * FROM usuario WHERE login = :login";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':login', $login, PDO::PARAM_STR);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($results) > 0) {
            $user = $results[0];
            if (password_verify($password, $user['senha'])) {
                $_SESSION['loggedin'] = true;
                $_SESSION['username'] = $login;
                return ['success' => true, 'message' => 'Login bem-sucedido!', 'username' => $login];
            } else {
                return ['success' => false, 'message' => 'Senha incorreta.'];
            }
        } else {
            return ['success' => false, 'message' => "Usuário $login não encontrado."];
        }
    } catch (PDOException $e) {
        $client->trackException($e);
        error_log("Database query error: " . $e->getMessage());
        return ['success' => false, 'message' => 'Erro ao acessar o banco de dados.'];
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $login = htmlspecialchars(filter_input(INPUT_POST, 'login', FILTER_UNSAFE_RAW));
    $senha = htmlspecialchars(filter_input(INPUT_POST, 'senha', FILTER_UNSAFE_RAW));

    $responseArray = validateUser($login, $senha);
    echo json_encode($responseArray);
}