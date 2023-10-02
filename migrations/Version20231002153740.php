<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231002153740 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE notifications (id INT AUTO_INCREMENT NOT NULL, id_utilisateur_id INT DEFAULT NULL, contenu LONGTEXT NOT NULL, statut VARCHAR(255) NOT NULL, date_envoi DATETIME NOT NULL, UNIQUE INDEX UNIQ_6000B0D3C6EE5C49 (id_utilisateur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE paiements (id INT AUTO_INCREMENT NOT NULL, id_transaction_id INT DEFAULT NULL, montant INT NOT NULL, date_paiement DATETIME NOT NULL, methode VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_E1B02E1212A67609 (id_transaction_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE notifications ADD CONSTRAINT FK_6000B0D3C6EE5C49 FOREIGN KEY (id_utilisateur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE paiements ADD CONSTRAINT FK_E1B02E1212A67609 FOREIGN KEY (id_transaction_id) REFERENCES transactions (id)');
        $this->addSql('ALTER TABLE evaluations ADD id_materiel_id INT DEFAULT NULL, ADD id_utilisateur_id INT DEFAULT NULL, ADD note INT NOT NULL, ADD commentaire LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE evaluations ADD CONSTRAINT FK_3B72691DE9AC758 FOREIGN KEY (id_materiel_id) REFERENCES materiel (id)');
        $this->addSql('ALTER TABLE evaluations ADD CONSTRAINT FK_3B72691DC6EE5C49 FOREIGN KEY (id_utilisateur_id) REFERENCES user (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_3B72691DE9AC758 ON evaluations (id_materiel_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_3B72691DC6EE5C49 ON evaluations (id_utilisateur_id)');
        $this->addSql('ALTER TABLE transactions ADD id_materiel_id INT DEFAULT NULL, ADD id_utilisateur_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE transactions ADD CONSTRAINT FK_EAA81A4CE9AC758 FOREIGN KEY (id_materiel_id) REFERENCES materiel (id)');
        $this->addSql('ALTER TABLE transactions ADD CONSTRAINT FK_EAA81A4CC6EE5C49 FOREIGN KEY (id_utilisateur_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_EAA81A4CE9AC758 ON transactions (id_materiel_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_EAA81A4CC6EE5C49 ON transactions (id_utilisateur_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notifications DROP FOREIGN KEY FK_6000B0D3C6EE5C49');
        $this->addSql('ALTER TABLE paiements DROP FOREIGN KEY FK_E1B02E1212A67609');
        $this->addSql('DROP TABLE notifications');
        $this->addSql('DROP TABLE paiements');
        $this->addSql('ALTER TABLE transactions DROP FOREIGN KEY FK_EAA81A4CE9AC758');
        $this->addSql('ALTER TABLE transactions DROP FOREIGN KEY FK_EAA81A4CC6EE5C49');
        $this->addSql('DROP INDEX IDX_EAA81A4CE9AC758 ON transactions');
        $this->addSql('DROP INDEX UNIQ_EAA81A4CC6EE5C49 ON transactions');
        $this->addSql('ALTER TABLE transactions DROP id_materiel_id, DROP id_utilisateur_id');
        $this->addSql('ALTER TABLE evaluations DROP FOREIGN KEY FK_3B72691DE9AC758');
        $this->addSql('ALTER TABLE evaluations DROP FOREIGN KEY FK_3B72691DC6EE5C49');
        $this->addSql('DROP INDEX UNIQ_3B72691DE9AC758 ON evaluations');
        $this->addSql('DROP INDEX UNIQ_3B72691DC6EE5C49 ON evaluations');
        $this->addSql('ALTER TABLE evaluations DROP id_materiel_id, DROP id_utilisateur_id, DROP note, DROP commentaire');
    }
}
