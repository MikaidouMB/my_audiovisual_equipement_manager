<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231011083158 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reservation ADD is_validated TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE reservation_materiel DROP FOREIGN KEY FK_user_id');
        $this->addSql('DROP INDEX FK_user_id ON reservation_materiel');
        $this->addSql('ALTER TABLE reservation_materiel DROP user_id, DROP quantity');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reservation DROP is_validated');
        $this->addSql('ALTER TABLE reservation_materiel ADD user_id INT DEFAULT NULL, ADD quantity INT DEFAULT 0');
        $this->addSql('ALTER TABLE reservation_materiel ADD CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX FK_user_id ON reservation_materiel (user_id)');
    }
}
