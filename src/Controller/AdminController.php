<?php

namespace App\Controller;

use App\Entity\Materiel;
use App\Form\MaterielType;
use Knp\Component\Pager\PaginatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;


#[Route('admin', name: 'admin_')]
class AdminController extends AbstractController
{
    private $doctrine;
    private $entityManager;
    private $paginatorInterface;

    public function __construct(ManagerRegistry $doctrine, EntityManagerInterface $entityManager, PaginatorInterface $paginatorInterface)
    {
        $this->doctrine = $doctrine;
        $this->entityManager = $entityManager;
        $this->paginatorInterface = $paginatorInterface;
    }

    #[Route('/', name: 'index')]
    public function index(Request $request): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = $this->entityManager->getRepository(Materiel::class)->findAll();
        $materiels = $this->paginatorInterface->paginate(
            $data,
            $request->query->getInt('page',1),
            8,
        );

        return $this->render('materiel/index.html.twig', [
            'materiels' => $materiels
        ]);
    }
    #[Route('/admin/{id}', name: 'show', methods: ["GET"])]
    public function show(Materiel $materiel): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        return $this->render('materiel/show.html.twig', [
            'materiel' => $materiel
        ]);
    }

    #[Route('/admin/{id}/edit', name: 'edit', methods: ["GET", "POST"])]
    public function edit(Request $request, Materiel $materiel): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $form = $this->createForm(MaterielType::class, $materiel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->doctrine->getManager()->flush();

            return $this->redirectToRoute('admin_dashboard');
        }

        return $this->render('materiel/edit.html.twig', [
            'materiel' => $materiel,
            'form' => $form->createView()
        ]);
    }

    #[Route('/admin/{id}/delete', name: 'delete', methods: ["DELETE"])]
    public function delete(Request $request, Materiel $materiel): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        if ($this->isCsrfTokenValid('delete' . $materiel->getId(), $request->request->get('_token'))) {
            $entityManager = $this->doctrine->getManager();
            $entityManager->remove($materiel);
            $entityManager->flush();
        }

        return $this->redirectToRoute('admin_dashboard');
    }
}
