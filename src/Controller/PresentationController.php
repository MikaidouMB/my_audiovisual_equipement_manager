<?php

namespace App\Controller;

use App\Entity\Materiel;
use App\Service\PanierService;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;

class PresentationController extends AbstractController
{
    private $panier;

    public function __construct(PanierService $panier ) {
        $this->panier = $panier;
    }

    #[Route('/presentation', name: 'presentation_index')]
    public function index(EntityManagerInterface $entityManager, 
                          PaginatorInterface $paginatorInterface, 
                          Request $request,
                          SessionInterface $session): Response
    {
        $data = $entityManager->getRepository(Materiel::class)->findAll();
        
        // Paginating the equipment data
        $equipments = $paginatorInterface->paginate(
            $data,
            $request->query->getInt('page', 1),
            8
        );

        return $this->render('presentation.html.twig', [
            'equipments' => $equipments,
            'nbItemPanier' => $this->panier->getNbArticles()
        ]);
    }
}
