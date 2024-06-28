<?php

session_start();

use classes\Logger;
use classes\DatabaseConnection;

use ApplicationInsights\Telemetry_Client;

require_once '../vendor/autoload.php';

// Apenas carregar dotenv em ambientes que não são de produção
if (getenv('APP_ENV') === 'development') {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
}

// Configuração do Application Insights
// $client = new Telemetry_Client();
// $instrumentalKey = getenv('INSTRUMENTATION_KEY');
// $client->getContext()->setInstrumentationKey($instrumentalKey);

// Função para criar conexão com o banco de dados
function createDatabaseConnection()
{

    global $client;  // Usar o cliente de telemetria global
    try {
        $db = new DatabaseConnection();
        $conn = $db->getConnection();
        return $conn;
    } catch (PDOException $e) {
        // $client->trackException($e);
        error_log("Error connecting to SQL Server: " . $e->getMessage());
        die("Error connecting to SQL Server.");
        // echo"<script>console.log()</script>";
    }
}

// Função para validar o login do usuário
function validateUser($login, $password)
{
    $conn = createDatabaseConnection();

    $logger = new Logger();
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


                $userID = $user['id']; // ID do usuário que logou
                $action = "Login";
                $details = "Login efetuado com sucesso.";

                $logger->logEvent($userID, $action, $details);
                return ['success' => true, 'message' => 'Login bem-sucedido!', 'username' => $login];
            } else {
                $userID = $user['id']; // ID do usuário que logou
                $action = "Login";
                $details = "Senha incorreta.";

                $logger->logEvent($userID, $action, $details);
                return ['success' => false, 'message' => 'Senha incorreta.'];
            }
        } else {

            $userID = null; // ID do usuário que logou
            $action = "Login";
            $details = "Usuário $login não encontrado.";

            $logger->logEvent($userID, $action, $details);
            return ['success' => false, 'message' => "Usuário $login não encontrado."];
        }
    } catch (PDOException $e) {
        // $client->trackException($e);
        
        $message = $e->getMessage();
        $userID = $user['id'] ? $user['id'] : null; // ID do usuário que logou
        $action = "Login";
        $details = "Erro inesperado: $message";

        $logger->logEvent($userID, $action, $details);

        error_log("Database query error: " . $message);
        return ['success' => false, 'message' => "Erro ao consultar banco de dados."];
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $login = htmlspecialchars(filter_input(INPUT_POST, 'login', FILTER_UNSAFE_RAW));
    $senha = htmlspecialchars(filter_input(INPUT_POST, 'senha', FILTER_UNSAFE_RAW));

    $responseArray = validateUser($login, $senha);
    echo json_encode($responseArray);
}