<?php

namespace App\Repository;

use App\Entity\ReservationMateriel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ReservationMaterielRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ReservationMateriel::class);
    }

    public function findMaterielAndQuantityByReservationId($reservationId)
    {
        $qb = $this->createQueryBuilder('rm')
            ->select('m.nom', 'rm.quantity') // remplacer 'm.nom' par l'attribut désiré de Materiel ou simplement 'm' pour obtenir tout l'objet Materiel
            ->join('rm.materiel', 'm')
            ->where('rm.reservation = :reservationId')
            ->setParameter('reservationId', $reservationId);

        return $qb->getQuery()->getResult();
    }
}
