<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\RequestStack;

class PanierService
{
    private $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function getNbArticles()
    {
        $session = $this->requestStack->getSession();
        $panier = $session->get("panier", []);
        return count($panier);
    }

    public function getTotal()
    {
        $session = $this->requestStack->getSession();
        $panier = $session->get("panier", []);
        $total = 0;

        foreach ($panier as $item) {
            // Ajoutez le montant total de chaque article au total général
            $total += $item['total'];
        }

        return $total;
    }
}
