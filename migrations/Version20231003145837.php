<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231003145837 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE evaluations DROP FOREIGN KEY FK_3B72691DC6EE5C49');
        $this->addSql('ALTER TABLE evaluations DROP FOREIGN KEY FK_3B72691DE9AC758');
        $this->addSql('DROP INDEX UNIQ_3B72691DC6EE5C49 ON evaluations');
        $this->addSql('DROP INDEX UNIQ_3B72691DE9AC758 ON evaluations');
        $this->addSql('ALTER TABLE evaluations ADD id_materiel INT DEFAULT NULL, ADD id_utilisateur INT DEFAULT NULL, DROP id_materiel, DROP id_utilisateur');
        $this->addSql('ALTER TABLE evaluations ADD CONSTRAINT FK_3B72691DC6EE5C49 FOREIGN KEY (id_utilisateur) REFERENCES user (id)');
        $this->addSql('ALTER TABLE evaluations ADD CONSTRAINT FK_3B72691DE9AC758 FOREIGN KEY (id_materiel) REFERENCES materiel (id)');
        $this->addSql('CREATE INDEX IDX_3B72691DE9AC758 ON evaluations (id_materiel)');
        $this->addSql('CREATE INDEX IDX_3B72691DC6EE5C49 ON evaluations (id_utilisateur)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE evaluations DROP FOREIGN KEY FK_3B72691DE9AC758');
        $this->addSql('ALTER TABLE evaluations DROP FOREIGN KEY FK_3B72691DC6EE5C49');
        $this->addSql('DROP INDEX IDX_3B72691DE9AC758 ON evaluations');
        $this->addSql('DROP INDEX IDX_3B72691DC6EE5C49 ON evaluations');
        $this->addSql('ALTER TABLE evaluations ADD id_materiel INT DEFAULT NULL, ADD id_utilisateur INT DEFAULT NULL, DROP id_materiel_id, DROP id_utilisateur_id');
        $this->addSql('ALTER TABLE evaluations ADD CONSTRAINT FK_3B72691DE9AC758 FOREIGN KEY (id_materiel) REFERENCES materiel (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE evaluations ADD CONSTRAINT FK_3B72691DC6EE5C49 FOREIGN KEY (id_utilisateur) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_3B72691DC6EE5C49 ON evaluations (id_utilisateur)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_3B72691DE9AC758 ON evaluations (id_materiel)');
    }
}
