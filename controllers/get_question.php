<?php

use ApplicationInsights\Telemetry_Client;

require_once '../vendor/autoload.php';


// Apenas carregar dotenv em ambientes que não são de produção
if (getenv('APP_ENV') === 'development') {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
}

$instrumentalKey = getenv('INSTRUMENTATION_KEY');
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
        // echo "<script>console.log('conectou')</script>";
        return $conn;
    } catch (PDOException $e) {
        $client->trackException($e);
        error_log("Error connecting to SQL Server: " . $e->getMessage());
        die("Error connecting to SQL Server.");
        // echo "<script>console.log($e)</script>";
    }
}


function getQuestion($level)
{

    // echo "<script>console.log($level)</script>";
    global $client;  // Usar o cliente de telemetria global
    $conn = createDatabaseConnection();
    try {
        $query = "SELECT question_id, question_text, level FROM questions WHERE level = :level";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':level', $level, PDO::PARAM_INT);
        $stmt->execute();

        $question = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($question) {

            // echo "<script>console.log('Question: ' $question)</script>";

            $questionId = $question["question_id"];
            $options_query = "SELECT option_id, option_text, points FROM options WHERE question_id =:questionId";
            $stmt = $conn->prepare($options_query);
            $stmt->bindParam(":questionId", $questionId, PDO::PARAM_INT);
            $stmt->execute();

            $options = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'question' => $question,
                'options' => $options
            ];
        } else {
            return ['success' => false, 'message' => "Pergunta não encontrada"];
        }
    } catch (PDOException $e) {
        // echo "<script>console.log('Exception: ' $e)</script>";
        $client->trackException($e);
        error_log("Database query error: " . $e->getMessage());

        return ['success' => false, 'message' => 'Erro ao acessar o banco de dados.'];
    } finally {
        $client . flush();
    }
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $level = isset($_POST['level']) ? $_POST['level'] : 1;

    // echo "<script>console.log('level: ' $level)</script>";
    $responseArray = getQuestion($level);
    // echo "<script>console.log('level: ' $responseArray)</script>";

    echo json_encode($responseArray);
}
