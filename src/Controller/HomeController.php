<?php

namespace App\Controller;

use App\Entity\Materiel;
use App\Service\PanierService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class HomeController extends AbstractController
{
    private $panier;

    public function __construct(PanierService $panier ) {
        $this->panier = $panier;
    }
        #[Route('/', name: 'app_home')]
        public function index(EntityManagerInterface $entityManager, 
        PaginatorInterface $paginatorInterface, Request $request,SessionInterface $session,
        ): Response
        {
        $data = $entityManager->getRepository(Materiel::class)->findAll();
        
        $products = $paginatorInterface->paginate(
            $data,
            $request->query->getInt('page',1),
            8,
        );
          return $this->render('index.html.twig', [
            'products' => $products,
            'nbItemPanier' => $this->panier->getNbArticles()
        ]);
        }

        #[Route('/product_detail/{id}', name: 'product_detail', requirements: ['id' => '\d+'])]
        public function showProduct(EntityManagerInterface $entityManager, int $id): Response
        {
        $product = $entityManager->getRepository(Materiel::class)->find($id);

          return $this->render('product_detail.html.twig', [
            'product' => $product,
            'nbItemPanier' => $this->panier->getNbArticles()

        ]);
        }

        #[Route('/search_products/result', name: 'search_products_result')]
        public function showResultSearchProducts(Request $request, EntityManagerInterface $entityManager, UrlGeneratorInterface $urlGenerator): Response
        {
            $keyword = $request->query->get('keyword');
            $search_results = $entityManager->getRepository(Materiel::class)->findProductByWord($keyword);
        
            $data = [];
            foreach ($search_results as $result) {
                $data[] = [
                    'id' => $result->getId(),
                    'nom' => $result->getNom()
                ];
            }
            $redirectUrl = $urlGenerator->generate('search_products_keyword_page', ['keyword' => $keyword]); 
            return new JsonResponse(['redirectUrl' => $redirectUrl]);
        }

        #[Route('/search_products/page/{keyword}', name: 'search_products_keyword_page')]
        public function showSearchPage(string $keyword, EntityManagerInterface $entityManager): Response
        {
            $search_results = $entityManager->getRepository(Materiel::class)->findProductByWord($keyword);

            return $this->render('search_result.html.twig', [
                'results' => $search_results,
                'keyword' => $keyword,
                'nbItemPanier' => $this->panier->getNbArticles()
            ]);
        }

        #[Route('/search_products/page/type/{type?}', name: 'search_products_type_page')]
        public function showProductByType(?string $type, EntityManagerInterface $entityManager): Response
        {

            $products = $entityManager->getRepository(Materiel::class)->findProductByType($type);

            return $this->render('search_result.html.twig', [
                'results' => $products,
                'type' => $type,
                'nbItemPanier' => $this->panier->getNbArticles()

            ]);
        }

}

