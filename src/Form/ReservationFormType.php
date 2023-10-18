<?php
namespace App\Form;

use App\Entity\Boutique;
use App\Entity\Reservation;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class ReservationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
        ->add('boutique', EntityType::class, [
            'class' => Boutique::class,
            'choice_label' => function(Boutique $boutique) {
                return $boutique->getNom() . ' - ' . $boutique->getAdresse() . ' - ' . $boutique->getCodePostal() . ' ' . $boutique->getVille() . ' - ' . $boutique->getTelephone();
            },
            'label' => 'Choix de la boutique'
        ])
            ->add('dateRetrait', DateType::class, [
                'widget' => 'single_text',
                'label' => 'Date de retrait du matériel'
            ])
            ->add('dateRetour', DateType::class, [
                'widget' => 'single_text',
                'label' => 'Date de retour du matériel'
            ])
            ->add('prenom', TextType::class, ['label' => 'Prénom'])
            ->add('nom', TextType::class, ['label' => 'Nom'])
            ->add('societe', TextType::class, [
                'label' => 'Société (facultatif)',
                'required' => false
            ])
            ->add('prix_total', NumberType::class, [
                'mapped' => false, // Si 'prix_total' n'est pas une propriété directe de votre entité
            ])
            ->add('numeroTVA', NumberType::class, [
                'label' => 'Numéro TVA (facultatif)',
                'required' => false
            ])
            ->add('email', EmailType::class, ['label' => 'Email'])
            ->add('adresse', TextType::class, ['label' => 'Adresse de facturation'])
            ->add('ville', TextType::class, ['label' => 'Ville'])
            ->add('codePostal', NumberType::class, ['label' => 'Code postal'])
            ->add('telephone', NumberType::class, ['label' => 'Téléphone'])
            ->add('accepteConditions', CheckboxType::class, [
                'label' => 'Je valide les conditions générales d\'utilisation (nouvelle version en date du 03/04/2023)'
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Réserver',
                'attr' => [
                    'class' => 'btn btn-primary'
                ]
                ]);
            
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Reservation::class,
        ]);
    }
}

