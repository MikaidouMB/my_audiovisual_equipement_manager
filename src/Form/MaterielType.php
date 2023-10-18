<?php

namespace App\Form;

use App\Entity\Image;
use App\Entity\Materiel;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

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
            ->add('image', FileType::class, [
                'label' => 'Image',
                'mapped' => false, 
                'multiple' => true, 
                'attr' => ['class' => 'form-control']
            ]);
            }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Materiel::class,
        ]);
    }
}
