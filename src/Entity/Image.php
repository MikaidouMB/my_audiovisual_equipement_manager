<?php

namespace App\Entity;

use App\Repository\ImagesRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use App\Entity\Materiel;

#[ORM\Entity(repositoryClass: ImagesRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[Vich\Uploadable]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\OneToOne(mappedBy: "image", cascade: ["persist", "remove"])]
    private ?Materiel $materiel = null;
    
    #[Vich\UploadableField(mapping: 'materiel', fileNameProperty: 'imageName', size: 'imageSize')]
    private ?File $imagefile =null;

    #[ORM\Column(nullable: true)]
    private ?string $imageName = null;

    #[ORM\Column(nullable: true)]
    private ?int $imageSize = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct() {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function preUpdate()
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }


      /**
     * Get the value of updatedAt
     */ 
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Set the value of updatedAt
     *
     * @return  self
     */ 
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get the value of imagefile
     */ 
    public function getImagefile(): ?File
    {
        return $this->imagefile;
    }

    /**
     * Set the value of imagefile
     *
     * @return  self
     */ 
    public function setImagefile($imagefile)
    {
        $this->imagefile = $imagefile;

        return $this;
    }

    /**
     * Get the value of imageName
     */ 
    public function getImageName()
    {
        return $this->imageName;
    }

    /**
     * Set the value of imageName
     *
     * @return  self
     */ 
    public function setImageName($imageName)
    {
        $this->imageName = $imageName;

        return $this;
    }

    /**
     * Get the value of imageSize
     */ 
    public function getImageSize()
    {
        return $this->imageSize;
    }

    /**
     * Set the value of imageSize
     *
     * @return  self
     */ 
    public function setImageSize($imageSize)
    {
        $this->imageSize = $imageSize;

        return $this;
    }

    /**
     * Get the value of createdAt
     */ 
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set the value of createdAt
     *
     * @return  self
     */ 
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }
    public function getMateriel(): ?Materiel
    {
        return $this->materiel;
    }
    
    public function setMateriel(?Materiel $materiel): self
    {
        $this->materiel = $materiel;
    
        // Si vous voulez vous assurer que la bidirectionnalité est toujours respectée :
        if ($materiel && $materiel->getImage() !== $this) {
            $materiel->setImage($this);
        }
    
        return $this;
    }
    

}
