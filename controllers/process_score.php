<?php

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
    } catch (Exception $e) {
        $client->trackException($e);
        error_log("Error connecting to SQL Server: " . $e->getMessage());
        die("Error connecting to SQL Server.");
        // echo"<script>console.log()</script>";
    } finally {
        $client->flush();
    }
}

function getScore(){
    
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = isset($_POST['score']) ? intval($_POST['score']) : 0;
    $quiz_id  = isset($_POST['level']) ? intval($_POST['level']) : 0;
    $score  = isset($_POST['optionId']) ? intval($_POST['optionId']) : 0;

    // echo "<script>console.log('Level: ' $level)</script>";
    $responseArray = getScore($level);
    echo json_encode($responseArray);
}