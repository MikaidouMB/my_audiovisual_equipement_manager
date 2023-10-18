<?php

namespace App\Controller;
use App\Entity\ReservationCommande; 
use App\Service\PanierService;
use App\Entity\Materiel;
use App\Entity\Reservation;
use App\Form\ReservationFormType;
use App\Repository\BoutiqueRepository;
use App\Repository\MaterielRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use \Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route('/cart', name: 'cart_')]
class CartController extends AbstractController
{
    private $panier;

    public function __construct(PanierService $panier ) {
        $this->panier = $panier;
    }
    const TVA_RATE = 0.10;  // Taux de TVA de 10%. Vous pouvez changer cela selon votre situation.

    #[Route('/reservation', name: 'reservation')]
    public function reservationAndSubmit(
        Request $request, 
        EntityManagerInterface $entityManager,
        SessionInterface $session, 
        MaterielRepository $productsRepository,
        BoutiqueRepository $boutiqueRepository,
        PanierService $panier,
        Security $security
    ): Response {
        $boutiques = $boutiqueRepository->findAll();
        
        $reservation = new Reservation();
        $user = $security->getUser();
        $reservation->setPrenom($user->getPrenom());
        $reservation->setNom($user->getNom());
        $reservation->setEmail($user->getEmail());

        $form = $this->createForm(ReservationFormType::class, $reservation);
        $form->handleRequest($request);
        
        $panier = $session->get("panier", []);
        $total = 0;
        $totalWithTVA = 0;

        if ($form->isSubmitted() && $form->isValid()) {
            foreach ($panier as $itemId => $item) {
                $materielId = $itemId;
                $product = $item['product'];
                $quantity = $item['quantity'];
        
                $total = $item['total'];
                $materiel = $entityManager->getRepository(Materiel::class)->find($materielId);
        
                if ($materiel) {
                    $reservation->addMateriel($materiel);
                }
        
                $tvaAmount = $total * self::TVA_RATE;
                $totalWithTVA = $total + $tvaAmount;
        
                $reservation->setPrixTotal($totalWithTVA);
                $reservation->setUser($user);
        
                $entityManager->persist($reservation);
                $entityManager->flush();
        
                $reservationId = $reservation->getId();
        
                $sql = "UPDATE reservation_materiel SET quantity = :quantity WHERE reservation_id = :reservationId AND materiel_id = :materielId";
                $entityManager->getConnection()->executeQuery($sql, [
                    'quantity' => $quantity,
                    'reservationId' => $reservationId,
                    'materielId' => $materielId,
                ]);
        
                $sql = "UPDATE reservation_materiel SET user_id = :userId WHERE reservation_id = :reservationId AND materiel_id = :materielId";
                $entityManager->getConnection()->executeQuery($sql, [
                    'reservationId' => $reservationId,
                    'materielId' => $materielId,
                    'userId' => $user->getId()
                ]);
            }
        $currentUrl = $request->get('current_url');

            $this->addFlash('success', "Votre demande a bien été envoyée. Nous la traiterons dès que possible.");
        
            $session->remove('panier');
            return $this->redirectToRoute('app_home');
        }
        
    
        return $this->render('cart/index.html.twig', [
            'reservationForm' => $form->createView(),
            'reservation' => $reservation,
            'boutiques' => $boutiques,
            'dataPanier' => $panier,
            'total' => $total,
            'totalWithTVA' => $totalWithTVA,
            'nbItemPanier' => $this->panier->getNbArticles(),
            'totalGeneral' => $this->panier->getTotal(), 
        ]);
    }
    
    

    #[Route("/update-prices", name: "update_prices", methods: ["POST"])]
    public function updatePrices(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        dd($data);
        if (!isset($data['product_quantity'])) {
            return new JsonResponse(['error' => 'Quantities not provided'], 400);
        }

        $totalGeneral = 0;

        foreach ($data['product_quantity'] as $productId => $quantity) {
            $reservation = $entityManager->getRepository(Reservation::class)->find($productId);
            
            if (!$reservation) {
                return new JsonResponse(['error' => 'Product not found'], 400);
            }

            $totalPrice = $reservation->getPrixLocation() * $quantity;
            $totalGeneral += $totalPrice;

            // Assuming the Product entity has a setTotalPrice method
            $reservation->setPrixTotal($totalPrice);
            $entityManager->persist($reservation);
        }

        $entityManager->flush();

        return new JsonResponse(['totalGeneral' => $totalGeneral]);
}

    #[Route('/add/{id}', name: 'add')]
    public function addToCart($id, Materiel $product, SessionInterface $session, Request $request)
    {
        if (!$product) {
            $this->addFlash('error', 'Produit introuvable.');
            return $this->redirectToRoute('route_de_la_page_des_produits');
        }
    
        // Récupérez le prix unitaire du produit depuis la base de données
        $prixUnitaire = $product->getPrixLocation();
    
        $panier = $session->get("panier", []);
        
        if (!isset($panier[$id])) {
            $panier[$id] = [
                'product' => $product,
                'quantity' => 0,
                'total' => 0,
            ];
        }
        
        // Incrémentez la quantité et mettez à jour le total
        $panier[$id]['quantity']++;
        $panier[$id]['total'] = $prixUnitaire * $panier[$id]['quantity'];
        
        $session->set("panier", $panier);

        $currentUrl = $request->get('current_url');

        if ($currentUrl && strpos($currentUrl, 'product_detail') !== false) {
            $this->addFlash('success', "L'article a été ajouté au panier!");
        }

        return $this->redirect($currentUrl);
    }


    #[Route('/remove/{id}', name: 'remove')]
    public function remove(Materiel $product, SessionInterface $session)
    {
        $panier = $session->get("panier", []);
        $id = $product->getId();

        if (isset($panier[$id])) {
            if ($panier[$id]['quantity'] > 1) {
                $panier[$id]['quantity']--;
                $panier[$id]['total'] = $panier[$id]['quantity'] * $panier[$id]['product']->getPrixLocation();
            } else {
                unset($panier[$id]);
            }

            $session->set("panier", $panier);
            return $this->redirectToRoute("cart_reservation");

        }
    }

    
    #[Route('/delete/{id}', name: 'delete')]
    public function delete(Materiel $product, SessionInterface $session)
    {
        $panier = $session->get("panier", []);
        $id = $product->getId();

        if(!empty($panier[$id])){
            unset($panier[$id]);
        }

        $session->set("panier", $panier);
        return $this->redirectToRoute("cart_reservation");
    }

    #[Route('/delete', name: 'delete_all')]
    public function deleteAll(SessionInterface $session)
    {
        $session->remove("panier");
        return $this->redirectToRoute("cart_reservation");
    }

}
