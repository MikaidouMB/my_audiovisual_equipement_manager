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
    
        $query = $this->connection->executeQuery($sql, [
            'reservationId' => $reservationId,
            'materielId' => $materielId,
        ]);
    
        $results = $query->fetchAllAssociative();
    
        return $results;
    }

    public function getMaterielIdForReservation($reservationId)
    {
        $sql = "SELECT materiel_id FROM reservation_materiel WHERE reservation_id = :reservationId";
        
        $query = $this->connection->executeQuery($sql, [
            'reservationId' => $reservationId,
        ]);
        
        $result = $query->fetchAllAssociative();
        
        return $result;
    }
    public function getOrderDetails($reservationId)
{
    $sql = "SELECT * FROM reservation_materiel WHERE reservation_id = :reservationId";
    
    $query = $this->connection->executeQuery($sql, [
        'reservationId' => $reservationId,
    ]);
    
    $details = $query->fetchAllAssociative();
    
    return $details;
}

}
