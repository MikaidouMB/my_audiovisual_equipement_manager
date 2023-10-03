<?php

namespace App\Repository;

use App\Entity\Materiel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Materiel>
 *
 * @method Materiel|null find($id, $lockMode = null, $lockVersion = null)
 * @method Materiel|null findOneBy(array $criteria, array $orderBy = null)
 * @method Materiel[]    findAll()
 * @method Materiel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MaterielRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Materiel::class);
    }

//    /**
//     * @return Materiel[] Returns an array of Materiel objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

public function findProductByWord($keyword)
{
    // Créez un générateur de requêtes (query builder) pour l'entité Materiel
    $qb = $this->createQueryBuilder('m');

    // Ajoutez une clause WHERE pour filtrer par un mot-clé (en supposant que vous souhaitez filtrer par un champ spécifique, ajustez 'nomChamp' en conséquence)
    $qb->where($qb->expr()->like('m.nom', ':keyword'))
       ->setParameter('keyword', '%' . $keyword . '%'); // Ajustez 'nomChamp' en fonction du nom du champ dans lequel vous souhaitez effectuer la recherche

    // Obtenez la requête et exécutez-la
    $query = $qb->getQuery();
    return $query->getResult();
}


//    public function findOneBySomeField($value): ?Materiel
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
