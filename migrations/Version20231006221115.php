<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231006221115 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE boutique (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, adresse VARCHAR(255) NOT NULL, code_postal VARCHAR(255) NOT NULL, ville VARCHAR(255) NOT NULL, telephone INT NOT NULL, email VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE evaluations (id INT AUTO_INCREMENT NOT NULL, materiel_id INT DEFAULT NULL, utilisateur_id INT DEFAULT NULL, note INT NOT NULL, commentaire LONGTEXT DEFAULT NULL, INDEX IDX_3B72691D16880AAF (materiel_id), INDEX IDX_3B72691DFB88E14F (utilisateur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE images (id INT AUTO_INCREMENT NOT NULL, materiel_id INT DEFAULT NULL, ref VARCHAR(255) NOT NULL, INDEX IDX_E01FBE6A16880AAF (materiel_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE materiel (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, marque VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, prix_location INT NOT NULL, statut VARCHAR(255) NOT NULL, date_achat DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notifications (id INT AUTO_INCREMENT NOT NULL, id_utilisateur_id INT DEFAULT NULL, contenu LONGTEXT NOT NULL, statut VARCHAR(255) NOT NULL, date_envoi DATETIME NOT NULL, UNIQUE INDEX UNIQ_6000B0D3C6EE5C49 (id_utilisateur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE paiements (id INT AUTO_INCREMENT NOT NULL, id_transaction_id INT DEFAULT NULL, montant INT NOT NULL, date_paiement DATETIME NOT NULL, methode VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_E1B02E1212A67609 (id_transaction_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reservation (id INT AUTO_INCREMENT NOT NULL, boutique_id INT DEFAULT NULL, date_retrait DATETIME NOT NULL, date_retour DATETIME NOT NULL, prenom VARCHAR(255) NOT NULL, nom VARCHAR(255) NOT NULL, societe VARCHAR(255) DEFAULT NULL, numero_tva INT DEFAULT NULL, email VARCHAR(255) NOT NULL, adresse LONGTEXT NOT NULL, ville VARCHAR(255) NOT NULL, code_postal INT NOT NULL, telephone INT NOT NULL, accepte_conditions TINYINT(1) NOT NULL, prix_total INT NOT NULL, INDEX IDX_42C84955AB677BE6 (boutique_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reservation_materiel (reservation_id INT NOT NULL, materiel_id INT NOT NULL, INDEX IDX_85675285B83297E7 (reservation_id), INDEX IDX_8567528516880AAF (materiel_id), PRIMARY KEY(reservation_id, materiel_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE transactions (id INT AUTO_INCREMENT NOT NULL, materiel_id INT DEFAULT NULL, utilisateur_id INT DEFAULT NULL, date_debut DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', date_fin DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', prix_total INT NOT NULL, status VARCHAR(255) NOT NULL, INDEX IDX_EAA81A4C16880AAF (materiel_id), UNIQUE INDEX UNIQ_EAA81A4CFB88E14F (utilisateur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, telephone INT NOT NULL, adresse LONGTEXT NOT NULL, is_verified TINYINT(1) NOT NULL, registration_token VARCHAR(255) DEFAULT NULL, is_active TINYINT(1) NOT NULL, reset_token VARCHAR(100) DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE evaluations ADD CONSTRAINT FK_3B72691D16880AAF FOREIGN KEY (materiel_id) REFERENCES materiel (id)');
        $this->addSql('ALTER TABLE evaluations ADD CONSTRAINT FK_3B72691DFB88E14F FOREIGN KEY (utilisateur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6A16880AAF FOREIGN KEY (materiel_id) REFERENCES materiel (id)');
        $this->addSql('ALTER TABLE notifications ADD CONSTRAINT FK_6000B0D3C6EE5C49 FOREIGN KEY (id_utilisateur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE paiements ADD CONSTRAINT FK_E1B02E1212A67609 FOREIGN KEY (id_transaction_id) REFERENCES transactions (id)');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955AB677BE6 FOREIGN KEY (boutique_id) REFERENCES boutique (id)');
        $this->addSql('ALTER TABLE reservation_materiel ADD CONSTRAINT FK_85675285B83297E7 FOREIGN KEY (reservation_id) REFERENCES reservation (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reservation_materiel ADD CONSTRAINT FK_8567528516880AAF FOREIGN KEY (materiel_id) REFERENCES materiel (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE transactions ADD CONSTRAINT FK_EAA81A4C16880AAF FOREIGN KEY (materiel_id) REFERENCES materiel (id)');
        $this->addSql('ALTER TABLE transactions ADD CONSTRAINT FK_EAA81A4CFB88E14F FOREIGN KEY (utilisateur_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE evaluations DROP FOREIGN KEY FK_3B72691D16880AAF');
        $this->addSql('ALTER TABLE evaluations DROP FOREIGN KEY FK_3B72691DFB88E14F');
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6A16880AAF');
        $this->addSql('ALTER TABLE notifications DROP FOREIGN KEY FK_6000B0D3C6EE5C49');
        $this->addSql('ALTER TABLE paiements DROP FOREIGN KEY FK_E1B02E1212A67609');
        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C84955AB677BE6');
        $this->addSql('ALTER TABLE reservation_materiel DROP FOREIGN KEY FK_85675285B83297E7');
        $this->addSql('ALTER TABLE reservation_materiel DROP FOREIGN KEY FK_8567528516880AAF');
        $this->addSql('ALTER TABLE transactions DROP FOREIGN KEY FK_EAA81A4C16880AAF');
        $this->addSql('ALTER TABLE transactions DROP FOREIGN KEY FK_EAA81A4CFB88E14F');
        $this->addSql('DROP TABLE boutique');
        $this->addSql('DROP TABLE evaluations');
        $this->addSql('DROP TABLE images');
        $this->addSql('DROP TABLE materiel');
        $this->addSql('DROP TABLE notifications');
        $this->addSql('DROP TABLE paiements');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('DROP TABLE reservation_materiel');
        $this->addSql('DROP TABLE transactions');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
