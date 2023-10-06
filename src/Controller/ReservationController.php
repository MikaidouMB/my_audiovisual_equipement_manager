<?php

namespace App\Controller;

use App\Entity\Boutique;
use App\Entity\Reservation;
use App\Entity\User;
use App\Form\ReservationFormType;
use App\Repository\BoutiqueRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class ReservationController extends AbstractController
{
    #[Route('/reservation/process', name: 'reservation_process')]
public function process(Request $request, EntityManagerInterface $entityManager, BoutiqueRepository $boutiqueRepository) :Response
{
    $reservation = new Reservation;

    $boutiques = $boutiqueRepository->findAll();

    $form = $this->createForm(ReservationFormType::class, $reservation);
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {

        $entityManager->persist($reservation);
        $entityManager->flush();

        $this->addFlash('success', "Votre demande à été envoyé a bien été envoyé,
        nous la traiterons dès que possible");

        return $this->redirectToRoute('app_home');
    }
    return $this->render('cart/index.html.twig', [
        'reservationForm' => $form->createView(),
        'reservation' => $reservation,
        'boutiques' => $boutiques
    ]);
}    

}
