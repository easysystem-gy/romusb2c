# Romusworld B2C - Site Web E-commerce

Site web B2C dédié aux produits et outillages Romus, spécialisés dans les solutions pour murs et sols.

## 🏗️ Présentation du Projet

Ce site web présente le catalogue complet des produits Romus :
- **Tapis techniques** : en rouleaux, rigides, modulaires, caoutchouc, lavables
- **Signalétique tactile** : dalles podotactiles, bandes d'éveil, nez de marches
- **Outillage professionnel** : outils de pose sols/murs, découpe, préparation
- **Accessoires** : cadres, profilés, fixations, colles, produits d'entretien

## 🚀 Technologies

- **CMS** : Drupal 10
- **Base de données** : PostgreSQL
- **Frontend** : Responsive design (mobile-first)
- **Langues** : Français / Anglais
- **E-commerce** : Drupal Commerce

## 📋 Fonctionnalités Principales

### Catalogue Produits
- Fiches produits détaillées avec caractéristiques techniques
- Galerie photos HD et vidéos de démonstration
- Documents téléchargeables (fiches techniques, notices de pose)
- Système de filtres avancés (usage, matériau, dimensions, prix)

### Espace Client
- Création de compte et authentification
- Gestion des commandes et suivi de livraison
- Historique des achats
- Liste de favoris

### Navigation & Recherche
- Arborescence optimisée (3 clics maximum)
- Moteur de recherche intelligent
- Navigation par catégories et usages
- Suggestions de produits complémentaires

### Contenu Éditorial
- Blog actualités et conseils techniques
- Galerie de réalisations clients
- Guides de pose et tutoriels vidéo
- FAQ produits et support technique

## 🛠️ Installation

### Prérequis
- PHP 8.1+
- PostgreSQL 13+
- Composer 2.x
- Node.js 16+ (pour le thème)

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/easysystem-gy/romusb2c.git
cd romusb2c

# Installer les dépendances
composer install

# Créer la base de données PostgreSQL
createdb romusworld_db

# Copier et configurer les paramètres
cp web/sites/default/default.settings.php web/sites/default/settings.php

# Installer Drupal
drush site:install --db-url=pgsql://username:password@localhost/romusworld_db

# Importer la configuration
drush config:import

# Vider les caches
drush cache:rebuild
```

### Configuration PostgreSQL

Ajouter dans `web/sites/default/settings.php` :

```php
$databases['default']['default'] = [
  'database' => 'romusworld_db',
  'username' => 'your_username',
  'password' => 'your_password',
  'prefix' => '',
  'host' => 'localhost',
  'port' => '5432',
  'namespace' => 'Drupal\\pgsql\\Driver\\Database\\pgsql',
  'driver' => 'pgsql',
];
```

## 🎨 Thème et Design

### Charte Graphique
- **Couleurs principales** : Rouge Romus, Gris anthracite
- **Typographie** : Moderne et lisible
- **Style** : Minimaliste, professionnel, orienté bâtiment

### Responsive Design
- Mobile-first approach
- Breakpoints optimisés pour tous les écrans
- Navigation hamburger sur mobile
- Images adaptatives

## 📁 Structure du Projet

```
romusb2c/
├── config/                 # Configuration Drupal
│   └── sync/               # Configuration exportée
├── web/                    # Racine web Drupal
│   ├── modules/
│   │   └── custom/         # Modules personnalisés
│   │       ├── romus_products/    # Gestion produits
│   │       └── romus_commerce/    # Fonctionnalités e-commerce
│   ├── themes/
│   │   └── custom/
│   │       └── romusworld/        # Thème principal
│   └── sites/default/
├── private/                # Fichiers privés
└── docs/                   # Documentation
```

## 🔧 Modules Personnalisés

### romus_products
- Content types spécialisés (tapis, outillage, signalétique)
- Champs personnalisés (caractéristiques techniques, usages)
- Taxonomies métier (catégories, matériaux, normes)

### romus_commerce
- Gestion du catalogue B2C
- Système de panier et commandes
- Intégration avec les systèmes de paiement
- Gestion des stocks et livraisons

## 🌐 Multilingue

Le site supporte le français et l'anglais :
- Interface traduite
- Contenu multilingue
- URLs localisées
- Détection automatique de la langue

## 📊 SEO et Analytics

- URLs optimisées (pathauto)
- Meta tags personnalisés
- Sitemap XML automatique
- Google Analytics intégré
- Données structurées (schema.org)

## 🔒 Sécurité

- Conformité RGPD
- Chiffrement des données sensibles
- Sauvegardes automatiques
- Authentification sécurisée
- Protection contre les attaques courantes

## 📈 Performance

- Cache Drupal optimisé
- Agrégation CSS/JS
- Optimisation des images
- CDN ready
- Monitoring des performances

## 🚀 Déploiement

### Environnements
- **Développement** : Local
- **Staging** : Serveur de test
- **Production** : Cloud européen (OVH/Scaleway)

### Process de déploiement
1. Tests automatisés
2. Déploiement staging
3. Validation client
4. Déploiement production
5. Monitoring post-déploiement

## 📞 Support

Pour toute question technique :
- **Documentation** : `/docs/`
- **Issues** : GitHub Issues
- **Contact** : support@easysystem.gy

## 📄 Licence

Ce projet est sous licence propriétaire. Tous droits réservés à EasySystem et Romus.

---

**Développé avec ❤️ par EasySystem pour Romus**

