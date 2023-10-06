<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: "App\Repository\ReservationMaterielRepository")]
class ReservationMateriel
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: "integer")]
    private $id;

    #[ORM\ManyToOne(targetEntity: "App\Entity\Reservation", inversedBy: "reservationMateriels"), ORM\JoinColumn(nullable: false)]
    private $reservation;

    #[ORM\ManyToOne(targetEntity: "App\Entity\Materiel", inversedBy: "reservationMateriels", cascade: ["persist"]), ORM\JoinColumn(nullable: false)]
    private $materiel;
    

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReservation(): ?Reservation
    {
        return $this->reservation;
    }

    public function setReservation(?Reservation $reservation): self
    {
        $this->reservation = $reservation;
        return $this;
    }

    public function getMateriel(): ?Materiel
    {
        return $this->materiel;
    }

    public function setMateriel(?Materiel $materiel): self
    {
        $this->materiel = $materiel;
        return $this;
    }
}
