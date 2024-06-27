<?php
session_start();

require_once '../vendor/autoload.php';

use ApplicationInsights\Telemetry_Client;


// Verificar se está em ambiente de desenvolvimento
$appEnv = getenv('APP_ENV');
if ($appEnv == 'development') {
    // Carregar variáveis de ambiente do arquivo .env apenas em desenvolvimento
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
}

$instrumentalKey = $_ENV['INSTRUMENTATION_KEY'];

// Configuração do Application Insights
$client = new Telemetry_Client();
$client->getContext()->setInstrumentationKey($instrumentalKey);

// Função para criar conexão com o banco de dados
function createDatabaseConnection()
{
    $dbHost = $_ENV['DB_HOST'];
    $dbDatabase = $_ENV['DB_DATABASE'];
    $dbUser = $_ENV['DB_USERNAME'];
    $dbPassword = $_ENV['DB_PASSWORD'];

    global $client;  // Usar o cliente de telemetria global
    try {
        $conn = new PDO("sqlsrv:server = tcp:$dbHost; Database = $dbDatabase", $dbUser, $dbPassword);

        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        $client->trackException($e);
        error_log("Error connecting to SQL Server: " . $e->getMessage());
        die("Error connecting to SQL Server.");
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
    $login = filter_input(INPUT_POST, 'login', FILTER_SANITIZE_STRING);
    $senha = filter_input(INPUT_POST, 'senha', FILTER_SANITIZE_STRING);

    $responseArray = validateUser($login, $senha);
    echo json_encode($responseArray);
}
?>