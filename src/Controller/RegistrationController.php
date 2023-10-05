<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use App\Service\JWTService;
use App\Service\SendEmail;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;

class RegistrationController extends AbstractController
{
    /**
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    #[Route('/register', name: 'app_register')]
    public function register(Request $request,
                         UserPasswordHasherInterface $userPasswordHasher,
                         EntityManagerInterface $entityManager,
                         SendEmail $sendEmail,
                         JWTService $jwt
): Response {

    $user = new User();
    $form = $this->createForm(RegistrationFormType::class, $user);
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        $user->setPassword($userPasswordHasher->hashPassword($user, $form->get('plainPassword')->getData()));

        $entityManager->persist($user);
        $entityManager->flush();

        $userId = $user->getId();
        if (!$userId) {
            throw new \Exception("L'ID de l'utilisateur n'a pas été défini après la sauvegarde.");
        }

        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        $payload = [
            'user_id' => $user->getId()
        ];

        $token = $jwt->generate($header, $payload, $this->getParameter('app.jwtsecret'));

        $sendEmail->send([
            'recipient_email' => $user->getEmail(),
            'subject' => 'Verification de votre adresse email pour activer votre compte',
            'html_template' => "emails/confirmation_email.html.twig",
            'context' => [
                'prenom' => $user->getPrenom(),
                'userID' => $user->getId(),
                'token' => $token,
            ]
        ]);

        $this->addFlash('success', "Votre compte utilisateur a bien été créé, veuillez consulter vos emails pour l'activer");

        return $this->redirectToRoute('app_home');
    }

    return $this->render('registration/register.html.twig', [

        'registrationForm' => $form->createView(),
    ]);
}


    #[Route('/verify/{token}', name: 'app_verify_account', methods: ['GET'])]
    public function verifyUser($token, JWTService $jwt, UserRepository $userRepository, EntityManagerInterface $em): Response
    {

      if($jwt->isValid($token) && !$jwt->isExpired($token) && $jwt->check($token, $this->getParameter('app.jwtsecret'))){

        $payload = $jwt->getPayload($token);

        $user = $userRepository->find($payload['user_id']);

        if($user && !$user->IsVerified()){
            $user->setIsVerified(true);
            $em->flush($user);
            $this->addFlash('success', 'Utilisateur activé');
            return $this->redirectToRoute('app_login'); // à rediriger vers le profil
        }
    }

    $this->addFlash('danger', 'Le token est invalide ou a expiré');
    return $this->redirectToRoute('app_login');
    }


    #[Route('/renvoiverif', name: 'resend_verif')]
    public function resendVerif(JWTService $jwt, SendEmail $sendEmail, UserRepository $userRepository): Response
    {
        $user = $this->getUser();
        if(!$user){
            $this->addFlash('danger', 'Vous devez être connecté pour accéder à cette page');
            return $this->redirectToRoute('app_login');
        }

        if ($user->isVerified()) {
            $this->addFlash('danger', 'Cet utilisateur est déja activé');
            return $this->redirectToRoute('app_login');
        }

        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        $payload = [
            'user_id' => $user->getId()
        ];

        $token = $jwt->generate($header, $payload, $this->getParameter('app.jwtsecret'));

        $sendEmail->send([
            'recipient_email' => $user->getEmail(),
            'subject' => 'Verification de votre adresse email pour activer votre compte',
            'html_template' => "emails/confirmation_email.html.twig",
            'context' => [
                'prenom' => $user->getPrenom(),
                'userID' => $user->getId(),
                'token' => $token,
            ]
        ]);
        $this->addFlash('success', 'Email de vérification envoyé');
        return $this->redirectToRoute('app_login');
    }
}
