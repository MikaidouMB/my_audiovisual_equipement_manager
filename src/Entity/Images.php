<?php

namespace App\Entity;

use App\Repository\ImagesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImagesRepository::class)]
class Images
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(targetEntity: Materiel::class, inversedBy: "image")]
    private ?Materiel $id_materiel = null;
    
    #[ORM\Column(length: 255)]
    private ?string $ref = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdMateriel(): ?Materiel
    {
        return $this->id_materiel;
    }

    public function setIdMateriel(?Materiel $id_materiel): static
    {
        $this->id_materiel = $id_materiel;

        return $this;
    }

    public function getRef(): ?string
    {
        return $this->ref;
    }

    public function setRef(string $ref): static
    {
        $this->ref = $ref;

        return $this;
    }
}
