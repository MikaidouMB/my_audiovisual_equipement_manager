<?php

namespace App\Entity;

use App\Repository\ImagesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImagesRepository::class)]
class Images
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\OneToOne(targetEntity: Materiel::class, inversedBy: 'image')]
    #[ORM\JoinColumn(name: "materiel_id", referencedColumnName: "id")]
    private ?Materiel $materiel = null;

    
    #[ORM\Column(length: 255)]
    private ?string $ref = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMateriel(): ?Materiel
    {
        return $this->materiel; 
    }

    public function setMateriel(?Materiel $materiel): static
    {
        $this->materiel = $materiel; 

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
