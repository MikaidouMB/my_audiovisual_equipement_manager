<?php

namespace App\Entity;

use App\Repository\ImagesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImagesRepository::class)]
class Images
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Materiel::class, inversedBy: 'images')]
    #[ORM\JoinColumn(name: 'materiel_id', referencedColumnName: 'id')]
    private ?Materiel $materiel_id = null;
    
    
    #[ORM\Column(length: 255)]
    private ?string $ref = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMateriel(): ?Materiel
    {
        return $this->materiel_id;
    }

    public function setMateriel(?Materiel $materiel): static
    {
        $this->materiel_id = $materiel;

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
