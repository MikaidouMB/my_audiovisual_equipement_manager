<?php

namespace App\Entity;

use App\Repository\PaiementsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PaiementsRepository::class)]
class Paiements
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Transactions $id_transaction = null;

    #[ORM\Column]
    private ?int $montant = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $datePaiement = null;

    #[ORM\Column(length: 255)]
    private ?string $methode = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdTransaction(): ?Transactions
    {
        return $this->id_transaction;
    }

    public function setIdTransaction(?Transactions $id_transaction): static
    {
        $this->id_transaction = $id_transaction;

        return $this;
    }

    public function getMontant(): ?int
    {
        return $this->montant;
    }

    public function setMontant(int $montant): static
    {
        $this->montant = $montant;

        return $this;
    }

    public function getDatePaiement(): ?\DateTimeInterface
    {
        return $this->datePaiement;
    }

    public function setDatePaiement(\DateTimeInterface $datePaiement): static
    {
        $this->datePaiement = $datePaiement;

        return $this;
    }

    public function getMethode(): ?string
    {
        return $this->methode;
    }

    public function setMethode(string $methode): static
    {
        $this->methode = $methode;

        return $this;
    }
}
