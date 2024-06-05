<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinição de Senha</title>

    <link rel="stylesheet" type="text/css" href="../css/redefine.css">

</head>
<body>
    <h1>Redefinição de Senha</h1>
    <div class="input-entrada">
    <form action="redefine.php" method="post">
        <label class ="label" for="cod_rec">Código de Recuperação:</label><br>
        <input autocomplete="off" class="input" type="text" id="cod_rec" name="cod_rec"><br><br>

        <label class ="label" for="nova_senha">Nova Senha:</label><br>
        <input autocomplete="off" class="input" type="password" id="nova_senha" name="nova_senha"><br><br>

        <button class="button" type="submit" name="redefinir" value="Redefinir Senha">Redefinir a Senha</button>
    </form>
</body>
</html>

<?php
session_start();

// Verifique se o formulário foi enviado
if (isset($_POST['redefinir'])) {
    // Conexão com o banco de dados
    $hostname = "localhost";
    $bancodedados = "projeto";
    $usuario = "root";
    $senha = "softskills@123";

    $mysqli = new mysqli($hostname, $usuario, $senha, $bancodedados);
    if ($mysqli->connect_errno) {
        echo "Falha ao conectar: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
        exit();
    }

    // Obtenha o código de recuperação e a nova senha digitados pelo usuário
    $cod_rec = $_POST['cod_rec'];
    $nova_senha = $_POST['nova_senha'];

    // Verifique se o código de recuperação e a nova senha não estão vazios
    if (!empty($cod_rec) && !empty($nova_senha)) {
        // Consulta para obter o e-mail do usuário com base no código de recuperação
        $query = $mysqli->prepare("SELECT email FROM usuario WHERE cod_rec = ?");
        $query->bind_param("s", $cod_rec);
        $query->execute();
        $result = $query->get_result();

        if ($result->num_rows > 0) {
            // Usuário encontrado, atualize a senha
            $row = $result->fetch_assoc();
            $email = $row['email'];

            // Atualize a senha do usuário no banco de dados
            $update_query = $mysqli->prepare("UPDATE usuario SET senha = ? WHERE email = ?");
            $update_query->bind_param("ss", $nova_senha, $email);
            $update_query->execute();

            echo "Senha redefinida com sucesso!";
        } else {
            echo "Código de recuperação inválido.";
        }
    } else {
        echo "Por favor, preencha todos os campos.";
    }
}
?>
