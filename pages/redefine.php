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
            <label class="label" for="cod_rec">Código de Recuperação:</label><br>
            <input autocomplete="off" class="input" type="text" id="cod_rec" name="cod_rec"><br><br>

            <label class="label" for="nova_senha">Nova Senha:</label><br>
            <input autocomplete="off" class="input" type="password" id="nova_senha" name="nova_senha"><br><br>

            <button class="button" type="submit" name="redefinir" value="Redefinir Senha">Redefinir a Senha</button>
        </form>
</body>

</html>

<?php
session_start();
require_once '../vendor/autoload.php';

// Verifique se o formulário foi enviado
if (isset($_POST['redefinir'])) {
    // Apenas carregar dotenv em ambientes que não são de produção
    if (getenv('APP_ENV') === 'development') {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
        $dotenv->load();
    }

    $dbHost = getenv('DB_HOST');
    $dbDatabase = getenv('DB_DATABASE');
    $dbUser = getenv('DB_USERNAME');
    $dbPassword = getenv('DB_PASSWORD');

    try {
        $conn = new PDO("sqlsrv:server=$dbHost;Database=$dbDatabase", $dbUser, $dbPassword);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        echo "Falha ao conectar: " . $e->getMessage();
    }

    // Obtenha o código de recuperação e a nova senha digitados pelo usuário
    $cod_rec = $_POST['cod_rec'];
    $nova_senha = password_hash($_POST['nova_senha'], PASSWORD_BCRYPT);

    // Verifique se o código de recuperação e a nova senha não estão vazios
    if (!empty($cod_rec) && !empty($nova_senha)) {
        // Consulta para obter o e-mail do usuário com base no código de recuperação
        $query = "SELECT email FROM usuario WHERE cod_rec = :cod_rec";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':cod_rec', $cod_rec, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // Usuário encontrado, atualize a senha
            $email = $result['email'];

            // Atualize a senha do usuário no banco de dados
            $update_query = "UPDATE usuario SET senha = :nova_senha WHERE email = :email";
            $update_stmt = $conn->prepare($update_query);
            $update_stmt->bindParam(':nova_senha', $nova_senha, PDO::PARAM_STR);
            $update_stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $update_stmt->execute();

            echo "Senha redefinida com sucesso!";
        } else {
            echo "Código de recuperação inválido.";
        }
    } else {
        echo "Por favor, preencha todos os campos.";
    }
}
?>