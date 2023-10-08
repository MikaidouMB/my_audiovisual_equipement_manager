<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231008180000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add quantity column and user_id foreign key to reservation_materiel table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE reservation_materiel ADD quantity INT DEFAULT 0');
        $this->addSql('ALTER TABLE reservation_materiel ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE reservation_materiel ADD CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE reservation_materiel DROP FOREIGN KEY FK_user_id');
        $this->addSql('ALTER TABLE reservation_materiel DROP COLUMN quantity');
        $this->addSql('ALTER TABLE reservation_materiel DROP COLUMN user_id');
    }
}
