<?php

namespace App\Entity;

use App\Repository\ReservationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
class Reservation
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    private ?int $id = null;


    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $dateRetrait = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $dateRetour = null;

    #[ORM\Column(length: 255)]
    private ?string $prenom = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $societe = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $numeroTVA = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(type: 'text')]
    private ?string $adresse = null;

    #[ORM\Column(length: 255)]
    private ?string $ville = null;

    #[ORM\Column(type: 'integer')]
    private ?int $codePostal = null;

    #[ORM\Column(type: 'integer')]
    private ?int $telephone = null;

    #[ORM\ManyToOne(targetEntity: Boutique::class, inversedBy: 'reservations')]
    private ?Boutique $boutique = null;

    #[ORM\Column(type: 'boolean')]
    private ?bool $accepteConditions = null;

    #[ORM\Column(type: 'integer')]
    private ?int $prix_total = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'reservations')]
    private ?User $user;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToMany(targetEntity: Materiel::class)]
    #[ORM\JoinTable(name: "reservation_materiel")]
    #[ORM\JoinColumn(name: "reservation_id", referencedColumnName: "id")]
    #[ORM\InverseJoinColumn(name: "materiel_id", referencedColumnName: "id")]
    public $materiels;

    #[ORM\Column(nullable: true)]
    private ?bool $isValidated = null;
    
    

    public function __construct()
    {
        
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int 
    {
        return $this->id;
    }
    
    public function getDateRetrait(): ?\DateTimeInterface 
    {
        return $this->dateRetrait;
    }
    
    public function setDateRetrait(\DateTimeInterface $dateRetrait): self 
    {
        $this->dateRetrait = $dateRetrait;
        return $this;
    }
    
    public function getDateRetour(): ?\DateTimeInterface 
    {
        return $this->dateRetour;
    }
    
    public function setDateRetour(\DateTimeInterface $dateRetour): self 
    {
        $this->dateRetour = $dateRetour;
        return $this;
    }
    
    public function getPrenom(): ?string 
    {
        return $this->prenom;
    }
    
    public function setPrenom(string $prenom): self 
    {
        $this->prenom = $prenom;
        return $this;
    }
    
    public function getNom(): ?string 
    {
        return $this->nom;
    }
    
    public function setNom(string $nom): self 
    {
        $this->nom = $nom;
        return $this;
    }
    
    public function getSociete(): ?string 
    {
        return $this->societe;
    }
    
    public function setSociete(?string $societe): self 
    {
        $this->societe = $societe;
        return $this;
    }
    
    public function getNumeroTVA(): ?int 
    {
        return $this->numeroTVA;
    }
    
    public function setNumeroTVA(?int $numeroTVA): self 
    {
        $this->numeroTVA = $numeroTVA;
        return $this;
    }
    
    public function getEmail(): ?string 
    {
        return $this->email;
    }
    
    public function setEmail(string $email): self 
    {
        $this->email = $email;
        return $this;
    }
    
    public function getAdresse(): ?string 
    {
        return $this->adresse;
    }
    
    public function setAdresse(string $adresse): self 
    {
        $this->adresse = $adresse;
        return $this;
    }
    
    public function getVille(): ?string 
    {
        return $this->ville;
    }
    
    public function setVille(string $ville): self 
    {
        $this->ville = $ville;
        return $this;
    }
    
    public function getCodePostal(): ?int 
    {
        return $this->codePostal;
    }
    
    public function setCodePostal(int $codePostal): self 
    {
        $this->codePostal = $codePostal;
        return $this;
    }
    
    public function getTelephone(): ?int 
    {
        return $this->telephone;
    }
    
    public function setTelephone(int $telephone): self 
    {
        $this->telephone = $telephone;
        return $this;
    }
    
    public function getBoutique(): ?Boutique 
    {
        return $this->boutique;
    }
    
    public function setBoutique(?Boutique $boutique): self 
    {
        $this->boutique = $boutique;
        return $this;
    }
    
    public function isAccepteConditions(): ?bool 
    {
        return $this->accepteConditions;
    }
    
    public function setAccepteConditions(bool $accepteConditions): self 
    {
        $this->accepteConditions = $accepteConditions;
        return $this;
    }
    
    public function getPrixTotal(): ?int 
    {
        return $this->prix_total;
    }
    
    public function setPrixTotal(int $prix_total): self 
    {
        $this->prix_total = $prix_total;
        return $this;
    }
    
    
    public function getUser(): ?User 
    {
        return $this->user;
    }
    
    public function setUser(?User $user): self 
    {
        $this->user = $user;
        return $this;
    }
    
    public function getCreatedAt(): ?\DateTimeImmutable 
    {
        return $this->createdAt;
    }
    
    public function setCreatedAt(\DateTimeImmutable $createdAt): self 
    {
        $this->createdAt = $createdAt;
        return $this;
    }
    public function addMateriel(Materiel $materiel): void
    {
        $this->materiels[] = $materiel;
    }
    /**
     * @return Collection|Materiel[]
     */
    public function getMateriels(): Collection
    {
        return $this->materiels;
    }

    public function addReservationMateriel(Materiel $materiel): void
    {
        if (!$this->materiels->contains($materiel)) {
            $this->materiels[] = $materiel;
        }
    }
    

    /**
     * @return Collection|Materiel[]
     */
    public function getReservationMateriel(): Collection
    {
        return $this->materiels;
    }

    public function IsValidated(): ?bool
    {
        return $this->isValidated;
    }

    public function setIsValidated(?bool $isValidated): static
    {
        $this->isValidated = $isValidated;

        return $this;
    }
    
}
