<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231011160949 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Restore quantity and user_id columns to reservation_materiel table';
    }

    public function up(Schema $schema): void
    {
        // Adding columns
        $this->addSql('ALTER TABLE reservation_materiel ADD quantity INT NOT NULL');
        $this->addSql('ALTER TABLE reservation_materiel ADD user_id INT NOT NULL');

        // Assuming your user table is named `user` and has a primary key column named `id`
        // Uncomment the following line to add foreign key constraint
        // $this->addSql('ALTER TABLE reservation_materiel ADD CONSTRAINT FK_RESERVATION_USER FOREIGN KEY (user_id) REFERENCES user(id)');
    }

    public function down(Schema $schema): void
    {
        // Removing columns
        $this->addSql('ALTER TABLE reservation_materiel DROP quantity');
        
        // Drop the foreign key constraint first if you added it in the up method
        // $this->addSql('ALTER TABLE reservation_materiel DROP FOREIGN KEY FK_RESERVATION_USER');
        $this->addSql('ALTER TABLE reservation_materiel DROP user_id');
    }
}
