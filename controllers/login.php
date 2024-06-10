<?php
session_start();

require_once '../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

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
            
            // Enviar resposta JSON em vez de redirecionar diretamente
            echo json_encode(['success' => true, 'message' => 'Login bem-sucedido', 'username' => $login]);
        } else {
            echo "<script>
                alert('Senha incorreta');
                </script>";
        }
    } else {
        echo "<script>
                alert('Usuário não encontrado')
                </script>";
    }
}