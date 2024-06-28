<?php
namespace Classes;

use PDO;
use PDOException;

require_once '../vendor/autoload.php';

class DatabaseConnection
{

    private $dbHost;
    private $dbDatabase;
    private $dbUser;
    private $dbPassword;
    private $conn;

    function __construct()
    {
        $this->dbHost = getenv('DB_HOST');
        $this->dbDatabase = getenv('DB_DATABASE');
        $this->dbUser = getenv('DB_USERNAME');
        $this->dbPassword = getenv('DB_PASSWORD');
        $this->conn = new PDO("sqlsrv:server = tcp:$this->dbHost; Database = $this->dbDatabase", $this->dbUser, $this->dbPassword);

    }

    public function getConnection()
    {
        try {
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // echo"<script>console.log('Conectado ao banco de dados.')</script>";
            return $this->conn;
        } catch (PDOException $e) {
            // $client->trackException($e);
            error_log("Error connecting to SQL Server: " . $e->getMessage());
            die("Error connecting to SQL Server.");
        }
    }

}