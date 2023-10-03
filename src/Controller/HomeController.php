<?php

namespace App\Controller;

use App\Entity\Materiel;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

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

        #[Route('/product_detail/{id}', name: 'product_detail', requirements: ['id' => '\d+'])]
        public function showProduct(EntityManagerInterface $entityManager, int $id): Response
        {
          
        $product = $entityManager->getRepository(Materiel::class)->find($id);

          return $this->render('product_detail.html.twig', [
            'product' => $product,
        ]);
        }


        #[Route('/search_products/result', name: 'search_products_result')]
        public function showResultSearchProducts(Request $request, EntityManagerInterface $entityManager, UrlGeneratorInterface $urlGenerator): Response
        {
            $keyword = $request->query->get('keyword');
            $search_results = $entityManager->getRepository(Materiel::class)->findProductByWord($keyword);
        
            // Assuming $search_results is an array or collection, convert it to an array format suitable for JSON.
            // You may need to adapt this to your actual data structure.
            $data = [];
            foreach ($search_results as $result) {
                $data[] = [
                    'id' => $result->getId(),
                    'nom' => $result->getNom()
                    // Add other fields as needed...
                ];
            }
            $redirectUrl = $urlGenerator->generate('search_products_page', ['keyword' => $keyword]); 

            return new JsonResponse(['redirectUrl' => $redirectUrl]);

          
        }
        #[Route('/search_products/page/{keyword}', name: 'search_products_page')]
        public function showSearchPage(string $keyword, EntityManagerInterface $entityManager): Response
        {
            $search_results = $entityManager->getRepository(Materiel::class)->findProductByWord($keyword);
        
            return $this->render('search_result.html.twig', [
                'results' => $search_results,
                'keyword' => $keyword

            ]);
        }
        
}

