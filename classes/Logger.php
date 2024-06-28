<?php

namespace classes;

use Exception;

class Logger
{

    public function __construct()
    {
    }

    public function logEvent($userID, $action, $details)
    {
        try {

            $db = new DatabaseConnection();
            $conn = $db->getConnection();

            $query = "INSERT into UserLogs (user_id, action, log_date, details) VALUES (:userID, :action, GETDATE(), :details)";

            $stmt = $conn->prepare($query);
            $stmt->bindParam(":userID", $userID);
            $stmt->bindParam(":action", $action);
            $stmt->bindParam(":details", $details);
            $stmt->execute();

            
            // $this->client->trackEvent("Salvar log.");
        } catch (Exception $e) {
            // $this->client->trackException("Erro ao Salvar log: $e");
            return $e->getMessage();
        } finally {
            // $this->client->flush();  
        }
    }
}
?>