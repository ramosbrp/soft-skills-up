<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha</title>


    <link rel="stylesheet" type="text/css" href="../css/recsenha.css">

</head>
<body>
<?php

// Conecte-se ao banco de dados
$hostname = "localhost";
$bancodedados = "projeto";
$usuario = "root";
$senha = "softskills@123";

$mysqli = new mysqli($hostname, $usuario, $senha, $bancodedados);
if ($mysqli->connect_errno){
    echo "Falha ao conectar:(" . $mysqli->connect_errno . ")" . $mysqli->connect_errno;
}
else
    echo "Conectado ao Banco de Dados";


?>


<h1>Recuperação de Senha</h1>
    <div class="input-entrada">
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
        <label class ="label" for="email">Email:</label>
        <input autocomplete="off" class="input" type="email" id="email" name="email"><br><br>
        <button class="button" type="submit" name="enviar" value="Enviar Código">Enviar</button>
    </form>

    <?php
    // Inclua a classe do PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php'; // Inclua o arquivo de autoload do Composer

session_start();

if (isset($_POST['enviar'])) {
    $email = $_POST['email'];

    // Verifique se o e-mail está associado a uma conta
    $query = $mysqli->prepare("SELECT * FROM usuario WHERE email = ?");
    $query->bind_param("s", $email);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        // O e-mail existe, gere um código de recuperação
        $cod_rec = rand(100000, 999999);

        // Atualize o banco de dados com o código de recuperação
        $update_query = $mysqli->prepare("UPDATE usuario SET cod_rec = ? WHERE email = ?");
        $update_query->bind_param("ss", $cod_rec, $email);
        $update_query->execute();

        // Instancie o objeto do PHPMailer
        $mail = new PHPMailer(true);

        try {
            // Configurações do servidor SMTP
            $mail->isSMTP();
            $mail->Host       = 'smtp-mail.outlook.com'; // Endereço do servidor SMTP
            $mail->SMTPAuth   = true;                    // Ativar autenticação SMTP
            $mail->Username   = 'softskillsgp8@hotmail.com';
            $mail->Password   = 'softskills1234';
            $mail->SMTPSecure = 'tls';                   // Habilitar criptografia TLS
            $mail->Port       = 587;                     // Porta SMTP - 587 é comum para TLS

            // Remetente e destinatário
            $mail->setFrom('softskillsgp8@hotmail.com', 'Soft Skills'); // Seu e-mail e nome
            $mail->addAddress($email); // Destinatário

            // Conteúdo do e-mail
            $mail->isHTML(true);
            $mail->Subject = 'Recuperação de Senha - Código de Verificação';
            $mail->Body    = 'Seu código de verificação é: ' . $cod_rec;

            // Envie o e-mail
            $mail->send();
            echo 'E-mail enviado com sucesso!';
            header('Location: redefine.php');
        } catch (Exception $e) {
            echo "O e-mail não pôde ser enviado. Erro: {$mail->ErrorInfo}";
        }
    } else {
        echo "E-mail não encontrado. Por favor, verifique o e-mail inserido.";
    }
}
?>
</body>
</html>