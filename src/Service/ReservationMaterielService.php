<?php

// src/Service/ReservationMaterielService.php

namespace App\Service;

use Doctrine\DBAL\Connection;

class ReservationMaterielService
{
    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function getOrders($reservationId, $materielId)
    {
      
        $sql = "SELECT * FROM reservation_materiel WHERE reservation_id = :reservationId AND materiel_id = :materielId";
    
        // Exécutez la requête SQL en utilisant executeQuery sur la connexion
        $query = $this->connection->executeQuery($sql, [
            'reservationId' => $reservationId,
            'materielId' => $materielId,
        ]);
    
        // Récupérez la quantité depuis la requête
        $results = $query->fetchAllAssociative();
    
        return $results;
    }

    public function getMaterielIdForReservation($reservationId)
    {
        // Écrivez une requête SQL pour récupérer le materiel_id correspondant à la réservation
        $sql = "SELECT materiel_id FROM reservation_materiel WHERE reservation_id = :reservationId";
        
        // Exécutez la requête SQL en utilisant executeQuery sur la connexion
        $query = $this->connection->executeQuery($sql, [
            'reservationId' => $reservationId,
        ]);
        
        // Récupérez le materiel_id depuis la requête
        $result = $query->fetchAllAssociative();
        
        return $result;
    }
    public function getOrderDetails($reservationId)
{
    // Écrivez une requête SQL pour récupérer tous les détails de la réservation en fonction de son ID
    $sql = "SELECT * FROM reservation_materiel WHERE reservation_id = :reservationId";
    
    // Exécutez la requête SQL en utilisant executeQuery sur la connexion
    $query = $this->connection->executeQuery($sql, [
        'reservationId' => $reservationId,
    ]);
    
    // Récupérez tous les détails depuis la requête
    $details = $query->fetchAllAssociative();
    
    return $details;
}

}
