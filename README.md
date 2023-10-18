# my_audiovisual_equipement_manager
things to do

MON COMPTE

SéCURITé
-routes Admin non sécurisées  

PANIER
-reduire champs formulaire
-limite stock??
-- auto remplir la commande avec infos user
- enlever les fleche pour le chiffre

ACCUEIL

DETAIL PRODUITS
- evaluations sur les product details 


BDD
-nombre d'éléments en reserve
-creer une table type pour restreindre dans le form de création de materiel
-table adresse relié au id user

STYLE

- notification 
-mettre en prod

LES Fonctionnalités du site

Bien sûr, d'après les routes que vous avez fournies, voici un résumé des fonctionnalités de votre application:

### **Fonctionnalités Admin**:
1. **Gestion des Produits**:
   - Liste des produits : `/admin/`
   - Afficher un produit : `/admin/admin/{id}`
   - Créer un produit : `/admin/new`
   - Éditer un produit : `/admin/admin/{id}/edit` 
   - Supprimer un produit : `/admin/materiel/{id}/delete`
   
2. **Gestion des Utilisateurs**:
   - Liste des utilisateurs : `/admin/users`
   - Afficher un utilisateur : `/admin/{id}`
   - Éditer un utilisateur : `/admin/{id}/edit`
   - Créer un utilisateur : `/admin/create/user`
   - Supprimer un utilisateur : `/admin/{id}`(redirection vers profile a corriger)
   - Détails de commande d'un utilisateur : `/admin/user/{id}/order/{orderId}`

3. **Gestion des Boutiques**:
   - Liste des boutiques : `/admin/shops`
   - Créer une boutique : `/admin/create-boutique`
   - Éditer une boutique : `/admin/admin/boutique/{id}/edit`
   - Supprimer une boutique : `/admin/boutique/{id}/delete`

4. **Gestion des Devis**:
   - Liste des devis : `/admin/list/devis`
   - Détails d'un devis : `/admin/details/devis/{id}/{orderId}`
   - Valider un devis : `/admin/details/devis/{id}/{orderId}/is-validated`
   - Invalider un devis : `/admin/details/devis/{id}/{orderId}/invalidate`
   - Télécharger le PDF d'un devis : `/admin/pdf/{id}/{orderId}`(logo vistason absent)

5. **Gestion des Évaluations**:
   - Liste des évaluations : `/admin/list/evaluation`

### **Fonctionnalités Client**:
1. **Panier**:
   - Réservation : `/cart/reservation`
   - Mise à jour des prix : `/cart/update-prices` (ne marche pas)
   - Ajouter un produit : `/cart/add/{id}`
   - Retirer un produit : `/cart/remove/{id}`
   - Supprimer un produit : `/cart/delete/{id}`
   - Vider le panier : `/cart/delete`

2. **Produits**:
   - Page d'accueil : `/`
   - Détail d'un produit : `/product_detail/{id}`
   - Recherche de produits : `/search_products/result`, `/search_products/page/{keyword}`, `/search_products/page/type/{type}`
    photos qui ne s'affiche pas en prod
    
   - Liste des produits : `/materiel/`
   - Éditer un produit : `/materiel/{id}/edit`
   - Supprimer un produit : `/materiel/{id}`

3. **Compte Utilisateur**:
   - Inscription : `/register`
   - Vérification de compte : `/verify/{token}`
   - Renvoyer le mail de vérification : `/renvoiverif`
   - Connexion : `/login`
   - Déconnexion : `/logout`
   - Mot de passe oublié : `/oubli-pass` Call to undefined method App\Entity\User::setResetToken()
   - Réinitialiser le mot de passe : `/oubli-pass/{token}`
   - Profil de l'utilisateur : `/profile`
   - Éditer le profil : `/profile/{id}/edit` (tel limité a 9 chiffre)
   - Historique de commande : `/orders/{id}`
   - Détails de la commande : `/user/{id}/order/{orderId}`
   - Liste des évaluations : `/list/evaluation`
   - Supprimer le profil : `/{id}/delete`

4. **Divers**:
   - Page de présentation : `/presentation`
   - Historique des évaluations : `/reviews`
   
Estimation globale et ordre de correction:
Revoir la logique de gestion d'image (Éditer un produit) - 2h
Corriger Warning: Undefined variable $entityManager (Éditer un produit) - 1h
Mise en page et stylisation du formulaire (Créer un utilisateur) - 3h
Corriger la redirection vers le profil (Supprimer un utilisateur) - 1h
Corriger le problème du logo "vistason" manquant (Télécharger le PDF d'un devis) - 2h
Identifier et corriger le problème de mise à jour des prix (Mise à jour des prix du panier) - 3h
Corriger la limite du numéro de téléphone à 9 chiffres (Éditer le profil) - 1h
Corriger l'erreur avec setResetToken() (Mot de passe oublié) - 2h


