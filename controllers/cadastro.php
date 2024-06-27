<?php
session_start();

use ApplicationInsights\Telemetry_Client;

require_once '../vendor/autoload.php';

// Apenas carregar dotenv em ambientes que não são de produção
if (getenv('APP_ENV') === 'development') {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
}

// Agora você pode acessar as variáveis como variáveis de ambiente
$dbHost = getenv('DB_HOST');
$dbDatabase = getenv('DB_DATABASE');
$dbUser = getenv('DB_USERNAME');
$dbPassword = getenv('DB_PASSWORD');


// PHP Data Objects(PDO) Sample Code:
try {
    $conn = new PDO("sqlsrv:server = tcp:$dbHost; Database = $dbDatabase", "$dbUser", "{$dbPassword}");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print ("Error connecting to SQL Server.");
    die(print_r($e));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['nome'];
    $nomeMae = $_POST['nomeMae'];
    $dataNascimento = $_POST['dataNascimento'];
    $cpf = $_POST['cpf'];
    $email = $_POST['email'];
    $telefone = $_POST['telefone'];
    $cep = $_POST['cep'];
    $rua = $_POST['rua'];
    $numero = $_POST['numero'];
    $complemento = $_POST['complemento'];
    $bairro = $_POST['bairro'];
    $cidade = $_POST['cidade'];
    $estado = $_POST['estado'];
    $signupUsername = $_POST['signupUsername'];
    $signupPassword = password_hash($_POST['signupPassword'], PASSWORD_BCRYPT);
    $cod_rec = '';

    try {
        // Consulta SQL para inserir o novo usuário
        $stmt = $conn->prepare("INSERT INTO usuario (nome, nome_mae, data_nascimento, cpf, email, telefone, cep, rua, numero, complemento, bairro, cidade, estado, login, senha, cod_rec) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->bindParam(1, $name);
        $stmt->bindParam(2, $nomeMae);
        $stmt->bindParam(3, $data_nascimento);
        $stmt->bindParam(4, $cpf);
        $stmt->bindParam(5, $email);
        $stmt->bindParam(6, $telefone);
        $stmt->bindParam(7, $cep);
        $stmt->bindParam(8, $rua);
        $stmt->bindParam(9, $numero);
        $stmt->bindParam(10, $complemento);
        $stmt->bindParam(11, $bairro);
        $stmt->bindParam(12, $cidade);
        $stmt->bindParam(13, $estado);
        $stmt->bindParam(14, $signupUsername);
        $stmt->bindParam(15, $signupPassword);
        $stmt->bindParam(16, $cod_rec);

        if ($stmt->execute()) {
            $responseArray = ['success' => true, 'message' => 'Cadastro realizado com sucesso!'];
            echo json_encode($responseArray);
            // echo"<script>console.log('ok')</script>";
        } else {
            throw new Exception("Failed to execute the SQL statement.");
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
