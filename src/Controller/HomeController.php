<?php

namespace App\Controller;

use App\Entity\Materiel;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\Entity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
        #[Route('/home', name: 'app_home')]
        public function index(EntityManagerInterface $entityManager): Response
        {
        $products = $entityManager->getRepository(Materiel::class)->findAll();
            
          return $this->render('index.html.twig', [
            'products' => $products,
        ]);
        }
       
}

