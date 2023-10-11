<?php

namespace App\Controller;

namespace App\Controller;

use App\Entity\Evaluations;
use App\Entity\Materiel;
use App\Entity\User;
use App\Form\UserType;
use App\Service\ReservationMaterielService;
use Knp\Component\Pager\PaginatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\PanierService;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;



class UserController extends AbstractController
{
    private $doctrine;
    private $entityManager;
    private $paginatorInterface;
    private $panier;
    private $reservationMaterielService;

    public function __construct(PanierService $panier, ManagerRegistry $doctrine, EntityManagerInterface $entityManager,
     PaginatorInterface $paginatorInterface, ReservationMaterielService $reservationMaterielService)
    {
        $this->doctrine = $doctrine;
        $this->entityManager = $entityManager;
        $this->paginatorInterface = $paginatorInterface;
        $this->panier = $panier;
        $this->reservationMaterielService = $reservationMaterielService;
    }

    #[Route('/profile', name: 'user_home')]
    public function home(): Response
    {
        $user = $this->getUser();

        return $this->render('user/home.html.twig', [
            'user' => $user,
            'nbItemPanier' => $this->panier->getNbArticles()
        ]);
    }

    #[Route('/profile/{id}/edit', name: 'user_profile_edit', methods: ['GET', 'POST'])]
    public function editProfile($id, User $user, Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();

        $form = $this->createForm(UserType::class, $user, 
        ['show_isVerified' => false,
        'roles_check' => false,
        ]
    );
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if ($password = $form->get('password')->getData()) {
                $user->setPassword($passwordHasher->hashPassword($user, $password));
            }

            $entityManager->flush();

            $this->addFlash('success', 'Profile updated successfully!');
            return $this->redirectToRoute('user_home');
        }

        return $this->render('user/editProfile.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
            'nbItemPanier' => $this->panier->getNbArticles()
        ]);
    }

    #[Route('/orders/{id}}', name: 'user_order_history', methods: ["GET"])]
    public function orderHistory($id, User $user): Response
    {
        $materiels = $this->entityManager->getRepository(Materiel::class)->findAll();
        $materielNames = [];
        $materielPrix = [];
    
        foreach ($materiels as $materiel) {
            $materielNames[$materiel->getId()] = $materiel->getNom();
            $materielPrix[$materiel->getId()] = $materiel->getPrixLocation();
        }
        return $this->render('user/order_history.html.twig', [
            'user' => $user,
            'materielNames' => $materielNames,
            'nbItemPanier' => $this->panier->getNbArticles(),
            'materielPrix' => $materielPrix,
        ]);
    }

    #[Route("/user/{id}/order/{orderId}", name: "user_order_details")]
    public function orderDetails($id, int $orderId, ReservationMaterielService $reservationMaterielService)
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        $materiels = $this->entityManager->getRepository(Materiel::class)->findAll();
        $materielNames = [];
        $materielPrix = [];
    
        foreach ($materiels as $materiel) {
            $materielNames[$materiel->getId()] = $materiel->getNom();
            $materielPrix[$materiel->getId()] = $materiel->getPrixLocation();
        }
    
        $reservations = $user->getReservations();
        $orderDetails = [];
        $totalPrices = [];
    
        foreach ($reservations as $reservation) {
            $reservationId = $reservation->getId();
            $orderDetails[$reservationId] = $this->reservationMaterielService->getOrderDetails($reservationId);
            $totalPrices[$reservationId] = $reservation->getPrixTotal();
        }
    
        return $this->render('user/order_details.html.twig', [
            'user' => $user,
            'orderDetails' => $orderDetails[$orderId],
            'materielNames' => $materielNames,
            'nbItemPanier' => $this->panier->getNbArticles(),
            'materielPrix' => $materielPrix,
            'prixTotal' => $totalPrices[$orderId] 
        ]);
    }

    #[Route('/reviews', name: 'user_reviews', methods: ['GET'])]
    public function reviews(): Response
    {
        $user = $this->getUser();
        $evaluations = $this->entityManager->getRepository(Evaluations::class)->findBy(['utilisateur' => $user]);

        return $this->render('user/rates.html.twig', [
            'evaluations' => $evaluations,
            'nbItemPanier' => $this->panier->getNbArticles()
        ]);
    }

    #[Route('/list/evaluation', name: 'app_evaluations_list', methods: ['GET'])]
    public function listEvaluations()
    {
        $evaluations = $this->entityManager->getRepository(Evaluations::class)->findAll();

        return $this->render('admin/rates.html.twig', [
            'evaluations' => $evaluations,
            'nbItemPanier' => $this->panier->getNbArticles()

        ]);
    }
    #[Route('/{id}/delete', name: 'delete_profile', methods: ["POST"])]
    public function delete(User $user, Request $request, EntityManagerInterface $entityManager ): Response
    {

        if ($this->isCsrfTokenValid('delete' . $user->getId(), $request->request->get('_token'))) {
            $entityManager = $this->doctrine->getManager();
            $entityManager->remove($user);
            $entityManager->flush();
        }

        return $this->redirectToRoute('user_home');
    }
}
