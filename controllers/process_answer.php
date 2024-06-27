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

// Requisição

function getQuestion($level)
{
    global $client;  // Usar o cliente de telemetria global
    $conn = createDatabaseConnection();
    try {
        $level = isset($level) ? $level : 1;
        $query = "SELECT question_id, question_text, level FROM questions WHERE level = :level";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':level', $level, PDO::PARAM_INT);
        $stmt->execute();

        $question = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($question) {

            $questionId = $question["question_id"];
            $options_query = "SELECT question_id, option_text, points FROM options WHERE question_id =:questionId";
            $stmt = $conn->prepare($options_query);
            $stmt->bindParam(":questionId", $questionId, PDO::PARAM_INT);
            $stmt->execute();

            $options = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'question' => $question,
                'options' => $options
            ];
        }
    } catch (Exception $e) {
        // echo "<script>console.log('Exception: ' $e)</script>";
        $client->trackException($e);
        error_log("Database query error: " . $e->getMessage());

        return ['success' => false, 'message' => 'Erro ao acessar o banco de dados.'];
    } finally {
        $client->flush();
    }
}



if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $score = isset($_POST['score']) ? intval($_POST['score']) : 0;
    $level = isset($_POST['level']) ? intval($_POST['level']) : 0;
    $optionId = isset($_POST['optionId']) ? intval($_POST['optionId']) : 0;
    $level++;

    // echo "<script>console.log('Level: ' $level)</script>";
    $responseArray = getQuestion($level);
    echo json_encode($responseArray);
}
