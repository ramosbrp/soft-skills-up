<?php

use classes\DatabaseConnection;

require_once '../vendor/autoload.php';

function createDatabaseConnection()
{
    // global $client;  // Usar o cliente de telemetria global
    try {
        $db = new DatabaseConnection();
        $conn = $db->getConnection();
        // echo"<script>console.log('ok')</script>";
        
        return $conn;
        
    } catch (PDOException $e) {
        // $client->trackException($e);
        error_log("Error connecting to SQL Server: " . $e->getMessage());
        die("Error connecting to SQL Server.");
    }
}

function getUsers(){
    $conn = createDatabaseConnection();
    $query = "SELECT * FROM usuario";
    $stms = $conn->query($query);
    $stms->execute();

    $results = $stms->fetchAll(PDO::FETCH_ASSOC);
    return $results;
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // echo"<script>console.log('ok')</script>";
    $responseArray = getUsers();

    echo json_encode($responseArray);
}