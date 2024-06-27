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
    require_once '../vendor/autoload.php';

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
    ?>

    <h1>Recuperação de Senha</h1>
    <div class="input-entrada">
        <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
            <label class="label" for="email">Email:</label>
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
            $query = "SELECT * FROM usuario WHERE email = :email";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                // O e-mail existe, gere um código de recuperação
                $cod_rec = rand(100000, 999999);

                // Atualize o banco de dados com o código de recuperação
                $update_query = "UPDATE usuario SET cod_rec = :cod_rec WHERE email = :email";
                $update_stmt = $conn->prepare($update_query);
                $update_stmt->bindParam(':cod_rec', $cod_rec, PDO::PARAM_STR);
                $update_stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $update_stmt->execute();

                // Instancie o objeto do PHPMailer
                $mail = new PHPMailer(true);

                try {
                    // Configurações do servidor SMTP
                    $mail->isSMTP();
                    $mail->Host = 'smtp-mail.outlook.com'; // Endereço do servidor SMTP
                    $mail->SMTPAuth = true; // Ativar autenticação SMTP
                    $mail->Username = getenv('MailUser');
                    $mail->Password = getenv('MailPassword');
                    $mail->SMTPSecure = 'tls'; // Habilitar criptografia TLS
                    $mail->Port = 587; // Porta SMTP - 587 é comum para TLS
        
                    // Remetente e destinatário
                    $mail->setFrom(getenv('MailUser'), 'Soft Skills'); // Seu e-mail e nome
                    $mail->addAddress($email); // Destinatário
        
                    // Conteúdo do e-mail
                    $mail->isHTML(true);
                    $mail->Subject = 'Recuperação de Senha - Código de Verificação';
                    $mail->Body = 'Seu código de verificação é: ' . $cod_rec;

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