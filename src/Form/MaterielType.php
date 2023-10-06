<?php

namespace App\Form;

use App\Entity\Images;
use App\Entity\Materiel;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

class MaterielType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nom')
            ->add('type')
            ->add('marque')
            ->add('description')
            ->add('prixLocation')
            ->add('statut')
            ->add('dateAchat')
            ->add('image', EntityType::class, [
                'class' => Images::class,
                'choice_label' => function(Images $image) {
                    return $image->getRef();
                },
            ]);
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Materiel::class,
        ]);
    }
}
