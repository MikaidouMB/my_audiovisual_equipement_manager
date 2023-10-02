<?php

namespace App\Controller;

use App\Entity\Materiel;
use Doctrine\ORM\EntityManagerInterface;
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
        
        #[Route('/product_detail/{id}', name: 'product_detail')]
        public function showProduct(EntityManagerInterface $entityManager, int $id): Response
        {
          
        $product = $entityManager->getRepository(Materiel::class)->find($id);

          return $this->render('product_detail.html.twig', [
            'product' => $product,
        ]);
        }
}

