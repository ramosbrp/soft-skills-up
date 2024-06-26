<?php
session_start();

require_once '../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Agora você pode acessar as variáveis como variáveis de ambiente
$dbHost = getenv('DB_HOST');
$dbDatabase = getenv('DB_DATABASE');
$dbUser = getenv('DB_USERNAME');
$dbPassword = getenv('DB_PASSWORD');

// print_r($_ENV); // Lista todas as variáveis de ambiente para testar apenas

try {
    $conn = new PDO("sqlsrv:server = tcp:$dbHost; Database = $dbDatabase", $dbUser, $dbPassword);
} catch (Exception $e) {
    print ("Error connecting to SQL Server.");
    die(print_r($e->getMessage()));
}


// Consulta SQL para verificar o usuário
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $login = $_POST['login'];
    $senha = $_POST['senha'];

    // Consulta SQL para verificar o usuário
    $query = "SELECT * FROM usuario WHERE login = :login";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':login', $login, PDO::PARAM_STR);
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $num_rows = count($results);

    if ($num_rows > 0) {
        //Usuário encontrado
        $user = $results[0];
        $hash_senha = $user['senha'];

        if (password_verify($senha, $hash_senha)) {
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $login;

            $responseArray = ['success' => true, 'message' => 'Login bem-sucedido!', 'username' => $login];
            echo json_encode($responseArray);

        } else {
            $responseArray = ['success' => false, 'message' => 'Senha incorreta.'];
            echo json_encode($responseArray);
        }
    } else {
        $responseArray = ['success' => false, 'message' => "Usuário $login não encontrado. "];
        echo json_encode($responseArray);
    }
}