<?php

namespace App\Repository;

use App\Entity\ReservationCommande;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ReservationCommande>
 *
 * @method ReservationCommande|null find($id, $lockMode = null, $lockVersion = null)
 * @method ReservationCommande|null findOneBy(array $criteria, array $orderBy = null)
 * @method ReservationCommande[]    findAll()
 * @method ReservationCommande[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReservationCommandeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ReservationCommande::class);
    }

//    /**
//     * @return ReservationCommande[] Returns an array of ReservationCommande objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ReservationCommande
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
