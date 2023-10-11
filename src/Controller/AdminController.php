<?php

namespace App\Controller;

use App\Entity\Materiel;
use App\Entity\User;
use App\Form\BoutiqueType;
use App\Entity\Boutique;
use App\Entity\Reservation;
use App\Form\MaterielType;
use App\Form\UserType;
use App\Repository\BoutiqueRepository;
use App\Repository\UserRepository;
use App\Service\SendEmail;
use App\Service\ReservationMaterielService;
use Knp\Component\Pager\PaginatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\PanierService;
use App\Service\PdfService;
use Doctrine\ORM\EntityManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('admin', name: 'admin_')]
class AdminController extends AbstractController
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

    #[Route('/', name: 'index')]
    public function index(Request $request): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = $this->entityManager->getRepository(Materiel::class)->findAll();
        $materiels = $this->paginatorInterface->paginate(
            $data,
            $request->query->getInt('page',1),
            11,
        );

        return $this->render('admin/index.html.twig', [
            'materiels' => $materiels,'nbItemPanier' => $this->panier->getNbArticles()
        ]);
    }
    #[Route('/admin/{id}', name: 'show', methods: ["GET"])]
    public function show(Materiel $materiel): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        return $this->render('materiel/show.html.twig', [
            'materiel' => $materiel,
            'nbItemPanier' => $this->panier->getNbArticles()
        ]);
    }

    #[Route('/new', name: 'create_product', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $materiel = new Materiel();
        $form = $this->createForm(MaterielType::class, $materiel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($materiel);
            $entityManager->flush();

            return $this->redirectToRoute('app_materiel_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('materiel/new.html.twig', [
            'materiel' => $materiel,
            'form' => $form,
            'nbItemPanier' => $this->panier->getNbArticles()
        ]);
    }

    #[Route('/admin/{id}/edit', name: 'edit_product', methods: ["GET", "POST"])]
    public function edit(Request $request, Materiel $materiel): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $form = $this->createForm(MaterielType::class, $materiel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->doctrine->getManager()->flush();

            return $this->redirectToRoute('admin_index');
        }

        return $this->render('materiel/edit.html.twig', [
            'materiel' => $materiel,
            'form' => $form->createView(),
            'nbItemPanier' => $this->panier->getNbArticles()
        ]);
    }

    #[Route('/admin/{id}/delete', name: 'delete_product', methods: ["POST"])]
    public function delete(Request $request, Materiel $materiel): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        if ($this->isCsrfTokenValid('delete' . $materiel->getId(), $request->request->get('_token'))) {
            $entityManager = $this->doctrine->getManager();
            $entityManager->remove($materiel);
            $entityManager->flush();
        }

        return $this->redirectToRoute('admin_index');
    }

    #[Route('/users', name: 'app_user_index', methods: ['GET'])]
    public function indexUser(UserRepository $userRepository): Response
    {
        return $this->render('user/index.html.twig', [
            'users' => $userRepository->findAll(),
            'nbItemPanier' => $this->panier->getNbArticles()

        ]);
    }

    #[Route('/shops', name: 'shops',methods: ['GET'])]
    public function boutiques(BoutiqueRepository $boutiqueRepository): Response
    {

        return $this->render('admin/shops.html.twig', [
            'boutiques' => $boutiqueRepository->findAll(),
            'nbItemPanier' => $this->panier->getNbArticles()

        ]);
    }

    #[Route('/create-boutique', name: 'create_boutique')]
    public function createBoutique(Request $request, EntityManagerInterface $entityManager): Response
    {
        $boutique = new Boutique();
        $form = $this->createForm(BoutiqueType::class, $boutique);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($boutique);
            $entityManager->flush();

            $this->addFlash('success', 'Boutique created successfully!');

            return $this->redirectToRoute('admin_shops');
        }

        return $this->render('admin/create_boutique.html.twig', [
            'form' => $form->createView(),
            'nbItemPanier' => $this->panier->getNbArticles()

        ]);
    }

    #[Route('/admin/boutique/{id}/edit', name: 'edit_boutique')]
    public function editShop(Request $request, Boutique $boutique, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(BoutiqueType::class, $boutique);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('admin_shops'); // ou tout autre nom de route
        }

        return $this->render('admin/editBoutique.html.twig', [
            'boutique' => $boutique,
            'form' => $form->createView(),
            'nbItemPanier' => $this->panier->getNbArticles()
        ]);
    }

    #[Route('/boutique/{id}/delete', name: 'delete_boutique', methods: ['POST'])]
    public function deleteShop(Request $request, Boutique $boutique): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        if ($this->isCsrfTokenValid('delete'.$boutique->getId(), $request->request->get('_token'))) {
            $entityManager = $this->doctrine->getManager();
            $entityManager->remove($boutique);
            $entityManager->flush();
        }
    
        return $this->redirectToRoute('admin_shops');
    }
    

    #[Route('/{id}', name: 'app_user_show', methods: ['GET'])]
    public function showUser($id,User $user): Response
    {
        return $this->render('user/show.html.twig', [
            'user' => $user,
            'nbItemPanier' => $this->panier->getNbArticles()

        ]);
    }

   
    #[Route("/user/{id}/order/{orderId}", name: "app_user_order_details")]
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
    
        return $this->render('admin/order_details.html.twig', [
            'user' => $user,
            'orderDetails' => $orderDetails[$orderId],
            'materielNames' => $materielNames,
            'nbItemPanier' => $this->panier->getNbArticles(),
            'materielPrix' => $materielPrix,
            'prixTotal' => $totalPrices[$orderId] 
        ]);
    }
    

    #[Route('/{id}/edit', name: 'app_user_edit', methods: ['GET', 'POST'])]
    public function editUser(Request $request, User $user,UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = $form->get('password')->getData();
            if ($plainPassword) {

            $user->setPassword(
                $userPasswordHasher->hashPassword(
                        $user,
                        $form->get('password')->getData()
                    )
                );
            }
            $entityManager->persist($user);
            $entityManager->flush();
            
            return $this->redirectToRoute('admin_app_user_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('user/edit.html.twig', [
            'user' => $user,
            'form' => $form,
            'nbItemPanier' => $this->panier->getNbArticles()

        ]);
    }
    #[Route('/create/user', name: 'app_user_new', methods: ['GET', 'POST'])]
    public function newUser(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher ): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                        $user,
                        $form->get('password')->getData()
                    )
                );
                $entityManager->persist($user);
                $entityManager->flush();

            return $this->redirectToRoute('admin_app_user_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('user/new.html.twig', [
            'user' => $user,
            'form' => $form,
            'nbItemPanier' => $this->panier->getNbArticles()

        ]);
    }

    #[Route('/{id}', name: 'app_user_delete', methods: ['POST'])]
    public function deleteUser(Request $request, User $user, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$user->getId(), $request->request->get('_token'))) {
            $entityManager->remove($user);
            $entityManager->flush();
        }

        return $this->redirectToRoute('admin_app_user_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/list/devis', name: 'app_devis_list', methods: ['GET'])]
    public function listReservations()
    {
        $reservations = $this->entityManager->getRepository(Reservation::class)->findAll();

        return $this->render('admin/devis_list.html.twig', [
            'reservations' => $reservations,
            'nbItemPanier' => $this->panier->getNbArticles()

        ]);
    }
    #[Route('/details/devis/{id}/{orderId}', name: 'app_devis_details', methods: ['GET'])]
    public function showDevis($id, int $orderId, ReservationMaterielService $reservationMaterielService)
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);
        $materiels = $this->entityManager->getRepository(Materiel::class)->findAll();
        $reservation = $this->entityManager->getRepository(Reservation::class)->find($orderId);

        $materielNames = [];
        $materielPrix = [];
    
        foreach ($materiels as $materiel) {
            $materielNames[$materiel->getId()] = $materiel->getNom();
            $materielPrix[$materiel->getId()] = $materiel->getPrixLocation();
        }

        return $this->render('admin/devis_detail.html.twig', [
            'user' => $user,
            'reservation'=> $reservation,
            'materielNames' => $materielNames,
            'nbItemPanier' => $this->panier->getNbArticles(),
            'materielPrix' => $materielPrix,
        ]);
    }

    #[Route('/details/devis/{id}/{orderId}/is-validated', name: 'devis_is_validated', methods: ['GET'])]
    public function isValidated($id, int $orderId, SendEmail $sendEmail, EntityManagerInterface $entityManager)
    {
        $reservation = $entityManager->getRepository(Reservation::class)->find($orderId);
        
        if (!$reservation) {
            $this->addFlash('danger', 'Devis non trouvé.');
            return $this->redirectToRoute('admin_app_devis_list'); 
        }
    
        $reservation->setIsValidated(1);
        $entityManager->persist($reservation);
        $entityManager->flush();
    
        if ($reservation->IsValidated()) {
            $this->addFlash('success', 'Le devis a été validé.');
            
            $sendEmail->send(
                'Vistason@domain.com',
                $reservation->getUser()->getEmail(),  
                'Votre devis a été validé',
                'confirmation_devis',  
                ['reservation' => $reservation],
            );
        } else {
            $this->addFlash('info', 'Le devis n’a pas encore été validé.');
        }
    
        return $this->redirectToRoute('admin_app_devis_list'); 
    }

    #[Route('/details/devis/{id}/{orderId}/invalidate', name: 'devis_invalidate', methods: ['GET'])]
    public function invalidateDevis($id, int $orderId, EntityManagerInterface $entityManager)
    {
        $reservation = $entityManager->getRepository(Reservation::class)->find($orderId);
    
        if (!$reservation) {
            $this->addFlash('danger', 'Devis non trouvé.');
            return $this->redirectToRoute('admin_app_devis_list'); 
        }

        $reservation->setIsValidated(0);
        $entityManager->persist($reservation);
        $entityManager->flush();

        if (!$reservation->IsValidated()) {
            $this->addFlash('success', 'Le devis a été dévalidé.');
            
        } else {
            $this->addFlash('info', 'Le devis est toujours validé.');
        }

        return $this->redirectToRoute('admin_app_devis_list'); 
    }

    #[Route('/pdf/{id}/{orderId}', name: 'devis.pdf', methods: ['GET'])]
    public function generatePdfDevis($id, $orderId, Reservation $reservation = null, PdfService $pdf, EntityManagerInterface $entityManager)
    {
        $reservation = $entityManager->getRepository(Reservation::class)->find($orderId);
        $user = $this->entityManager->getRepository(User::class)->find($id);
        $materiels = $this->entityManager->getRepository(Materiel::class)->findAll();
        $reservation = $this->entityManager->getRepository(Reservation::class)->find($orderId);

        $materielNames = [];
        $materielPrix = [];
    
        foreach ($materiels as $materiel) {
            $materielNames[$materiel->getId()] = $materiel->getNom();
            $materielPrix[$materiel->getId()] = $materiel->getPrixLocation();
        }
    
        $html = $this->renderView('admin/order_pdf.html.twig', [
            'reservation' => $reservation,
            'nbItemPanier' => $this->panier->getNbArticles(),
            'user' => $user,
            'materielNames' => $materielNames,
            'nbItemPanier' => $this->panier->getNbArticles(),
            'materielPrix' => $materielPrix,
    ]);
        $pdf->showPdfFile($html);
    }

}
