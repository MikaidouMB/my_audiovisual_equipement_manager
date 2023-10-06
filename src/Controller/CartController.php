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
use App\Entity\ReservationMateriel;

#[Route('/cart', name: 'cart_')]
class CartController extends AbstractController
{
    private $panier;

    public function __construct(PanierService $panier ) {
        $this->panier = $panier;
    }

    #[Route('/reservation', name: 'reservation')]    
    public function reservationAndSubmit(
        Request $request, 
        EntityManagerInterface $entityManager,
        SessionInterface $session, 
        MaterielRepository $productsRepository,
        BoutiqueRepository $boutiqueRepository,
        PanierService $panier
    ): Response {
        $boutiques = $boutiqueRepository->findAll();
        
        $reservation = new Reservation();
        
        $form = $this->createForm(ReservationFormType::class, $reservation);
        $form->handleRequest($request);
        
        $panier = $session->get("panier", []);
        $total = 0;
    
        if ($form->isSubmitted() && $form->isValid()) {
            $reservation->setPrixTotal($total);
            
            $entityManager->persist($reservation);
    
            // Parcourez le panier et ajoutez chaque produit à la réservationCommande
            foreach ($panier as $itemId => $item) {
                $product = $item['product'];
                $quantity = $item['quantity'];
                $total = $item['total'];
    
                // Insérez uniquement l'ID de la réservation et l'ID du matériel
                $reservationMateriel = new ReservationMateriel();
                $reservationMateriel->setReservation($reservation); // Assurez-vous que cette relation est correctement définie dans votre entité ReservationMateriel
                $reservationMateriel->setMateriel($product); // Assurez-vous que cette relation est correctement définie dans votre entité ReservationMateriel
    
                $entityManager->persist($reservationMateriel);
            }
    
            $entityManager->flush();
            $this->addFlash('success', "Votre demande a bien été envoyée. Nous la traiterons dès que possible.");
    
            // Effacez le panier après la soumission
            $session->remove('panier');
          
            return $this->redirectToRoute('app_home');
        }
    
        return $this->render('cart/index.html.twig', [
            'reservationForm' => $form->createView(),
            'reservation' => $reservation,
            'boutiques' => $boutiques,
            'dataPanier' => $panier,
            'total' => $total,
            'nbItemPanier' => $this->panier->getNbArticles(),
            'totalGeneral' => $this->panier->getTotal(), 
        ]);
    }
    
    
    #[Route('/add/{id}', name: 'add')]
    public function addToCart($id, Materiel $product, SessionInterface $session)
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

        $this->addFlash('success', 'Produit ajouté au panier avec succès!');
        
        return $this->redirectToRoute('cart_reservation');
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
