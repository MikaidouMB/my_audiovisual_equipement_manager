<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231002183246 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6AE9AC758');
        $this->addSql('DROP INDEX UNIQ_E01FBE6AE9AC758 ON images');
        $this->addSql('ALTER TABLE images CHANGE id_materiel id_materiel_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6AE9AC758 FOREIGN KEY (id_materiel_id) REFERENCES materiel (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_E01FBE6AE9AC758 ON images (id_materiel_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6AE9AC758');
        $this->addSql('DROP INDEX UNIQ_E01FBE6AE9AC758 ON images');
        $this->addSql('ALTER TABLE images CHANGE id_materiel_id id_materiel INT DEFAULT NULL');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6AE9AC758 FOREIGN KEY (id_materiel) REFERENCES materiel (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_E01FBE6AE9AC758 ON images (id_materiel)');
    }
}
