<?php

require_once '../vendor/autoload.php';

$dotent = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotent->load();

// Agora você pode acessar as variáveis como variáveis de ambiente
$dbHost = $_ENV['DB_HOST'];
$dbDatabase = $_ENV['DB_DATABASE'];
$dbUser = $_ENV['DB_USERNAME'];
$dbPassword = $_ENV['DB_PASSWORD'];

// print_r($_ENV); // Lista todas as variáveis de ambiente para testar apenas

try {
    $conn = new PDO("sqlsrv:server = tcp:$dbHost; Database = $dbDatabase", $dbUser, $dbPassword);
} catch (Exception $e) {
    print ("Error connecting to SQL Server.");
    die(print_r($e->getMessage()));
}


$level = isset($_POST['level']) ? $_POST['level'] : 1;

$query = "SELECT id, question_text, level FROM questions WHERE level = :level";
$stmt = $conn->prepare($query);
$stmt->bindParam(':level', $level, PDO::PARAM_INT);
$stmt->execute();

$question = $stmt->fetch(PDO::FETCH_ASSOC);

if ($question) {

    $questionId = $question["id"];
    $options_query = "SELECT id, option_text, points FROM options WHERE question_id =:questionId";
    $stmt = $conn->prepare($options_query);
    $stmt->bindParam(":questionId", $questionId, PDO::PARAM_INT);
    $stmt->execute();

    $options = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $responseArray = [
        'success' => true,
        'question' => $question,
        'options' => $options
    ];
} else {
    $responseArray = ['success' => false, 'message' => "Pergunta não encontrada"];
}

// Retorna a resposta em formato JSON
echo json_encode($responseArray);