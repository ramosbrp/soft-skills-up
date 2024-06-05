<?php

// Conecte-se ao banco de dados
$hostname = "localhost";
$bancodedados = "projeto";
$usuario = "root";
$senha = "softskills@123";

$conn = new mysqli($hostname, $usuario, $senha, $bancodedados);
if ($conn->connect_errno) {
    echo "Falha ao conectar:(" . $conn->connect_errno . ")" . $conn->connect_errno;
} else
    echo "Conectado ao Banco de Dados";


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
    $signupPassword = password_hash($_POST['signupPassword'], PASSWORD_BCRYPT) ;
    $cod_rec = '';
    

    // Consulta SQL para inserir o novo usuário
    $query = "INSERT INTO usuario (nome, nome_mae, data_nascimento, cpf, email, telefone, cep, rua, numero, complemento, bairro, cidade, estado, login, senha, cod_rec) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssssssssssssssi", $name, $nomeMae, $data_nascimento, $cpf, $email, $telefone, $cep, $rua, $numero, $complemento, $bairro, $cidade, $estado, $signupUsername, $signupPassword, $cod_rec);

    if ($stmt->execute()) {
        echo "<script>
                alert('Cadastro realizado com sucesso!');
                window.location.href = '../pages/login.html';
              </script>";
    } else {
        echo "<script>
                alert('Erro ao cadastrar. Tente novamente.');
                window.location.href = '../pages/login.html';
              </script>";
    }
    $stmt->close();
    $conn->close();
}
