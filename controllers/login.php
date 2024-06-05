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


// Conecte-se ao banco de dados
$hostname = $dbHost;
$bancoDeDados = $dbDatabase;
$usuario = $dbUser;
$senha = $dbPassword;

// print_r($_ENV); // Lista todas as variáveis de ambiente para testar apenas


$conn = new mysqli($hostname, $usuario, $senha, $bancoDeDados);
if ($conn->connect_errno) {
    echo "Falha ao conectar:(" . $conn->connect_errno . ")" . $conn->connect_errno;
} else
    echo "<script>console.log('Conectado ao Banco de Dados')</script>";


// Consulta SQL para verificar o usuário
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $login = $_POST['login'];
    $senha = $_POST['senha'];

    $query = "SELECT * FROM usuario WHERE login = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $login);
    $stmt->execute();

    //Obter o resultado
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        //Usuário encontrado
        $row = $result->fetch_assoc();
        $hash_senha = $row['senha'];

        if (password_verify($senha, $hash_senha)) {
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $login;
            echo "<script>
                alert('Login bem sucedido');
                window.location.href = '../pages/artigo.html';
                </script>";
        } else {
            echo "<script>
                alert('Senha incorreta');
                </script>";
        }
    } else {
        echo "<script>
                alert('Usuário não encontrado');
                </script>";
    }
    $stmt->close();
    $conn->close();
}