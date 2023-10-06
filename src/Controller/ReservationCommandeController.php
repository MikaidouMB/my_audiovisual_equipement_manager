<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ReservationCommandeController extends AbstractController
{
    #[Route('/reservation/commande', name: 'app_reservation_commande')]
    public function index(): Response
    {
        return $this->render('reservation_commande/index.html.twig', [
            'controller_name' => 'ReservationCommandeController',
        ]);
    }
}
