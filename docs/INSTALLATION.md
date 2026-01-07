# 🚀 Guide d'Installation - Romusworld B2C

Guide complet pour installer et configurer le site e-commerce Romusworld basé sur Drupal 10.2.

## 📋 Prérequis

### Serveur Web
- **PHP 8.1+** avec extensions : `gd`, `curl`, `mbstring`, `xml`, `zip`, `pdo_pgsql`
- **PostgreSQL 13+** ou **MySQL 8.0+** (PostgreSQL recommandé)
- **Apache 2.4+** ou **Nginx 1.18+**
- **Composer 2.0+**
- **Node.js 16+** et **npm/yarn** (pour les assets frontend)

### Outils de développement
- **Git** pour la gestion de version
- **Drush 11+** (installé via Composer)
- **Éditeur de code** (VS Code, PhpStorm, etc.)

## 🔧 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/easysystem-gy/romusb2c.git
cd romusb2c

# Récupérer la branche de développement
git checkout codegen-bot/romusworld-b2c-initialization-1767717442
```

### 2. Installation des dépendances

```bash
# Installation des packages PHP via Composer
composer install

# Installation des dépendances Node.js (si nécessaire)
npm install
```

**⚠️ Note importante** : Les modules de langue (`language`, `content_translation`, `config_translation`, `locale`) sont intégrés à Drupal Core et ne nécessitent pas d'installation via Composer.

### 3. Configuration de la base de données

#### PostgreSQL (recommandé)
```sql
-- Créer la base de données
CREATE DATABASE romusworld_db;
CREATE USER romusworld_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE romusworld_db TO romusworld_user;
```

#### MySQL (alternative)
```sql
-- Créer la base de données
CREATE DATABASE romusworld_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'romusworld_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON romusworld_db.* TO 'romusworld_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Configuration Drupal

#### Copier le fichier de configuration
```bash
cp web/sites/default/default.settings.php web/sites/default/settings.php
chmod 666 web/sites/default/settings.php
mkdir -p web/sites/default/files
chmod 777 web/sites/default/files
```

#### Ajouter la configuration de base de données
Éditer `web/sites/default/settings.php` et ajouter :

```php
// Configuration PostgreSQL
$databases['default']['default'] = [
  'database' => 'romusworld_db',
  'username' => 'romusworld_user',
  'password' => 'votre_mot_de_passe_securise',
  'prefix' => '',
  'host' => 'localhost',
  'port' => '5432',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\pgsql',
  'driver' => 'pgsql',
];

// Configuration MySQL (alternative)
/*
$databases['default']['default'] = [
  'database' => 'romusworld_db',
  'username' => 'romusworld_user',
  'password' => 'votre_mot_de_passe_securise',
  'prefix' => '',
  'host' => 'localhost',
  'port' => '3306',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
];
*/

// Configuration des fichiers
$settings['file_private_path'] = '../private';
$settings['config_sync_directory'] = '../config/sync';

// Sécurité
$settings['hash_salt'] = 'GENERER_UNE_CLE_ALEATOIRE_LONGUE_ET_SECURISEE';
```

### 5. Installation de Drupal

```bash
# Installation de base de Drupal
./vendor/bin/drush site:install standard \
  --db-url="pgsql://romusworld_user:votre_mot_de_passe_securise@localhost:5432/romusworld_db" \
  --site-name="Romusworld" \
  --account-name="admin" \
  --account-pass="admin_password_securise" \
  --account-mail="admin@romusworld.com" \
  -y

# Activation des modules de langue (intégrés à Core)
./vendor/bin/drush en language content_translation config_translation locale -y

# Activation des modules personnalisés Romus
./vendor/bin/drush en romus_products romus_commerce -y

# Activation du thème personnalisé
./vendor/bin/drush theme:enable romusworld -y
./vendor/bin/drush config:set system.theme default romusworld -y

# Nettoyage du cache
./vendor/bin/drush cache:rebuild
```

### 6. Configuration post-installation

#### Permissions des fichiers
```bash
chmod 644 web/sites/default/settings.php
chmod 755 web/sites/default/files
```

#### Configuration multilingue (optionnel)
```bash
# Ajouter l'anglais comme langue
./vendor/bin/drush language:add en

# Définir le français comme langue par défaut
./vendor/bin/drush config:set language.negotiation url.prefixes.fr '' -y
./vendor/bin/drush config:set language.negotiation url.prefixes.en 'en' -y
```

## 🛠️ Configuration des modules

### Drupal Commerce

```bash
# Activation des modules Commerce
./vendor/bin/drush en commerce commerce_product commerce_cart commerce_checkout commerce_order commerce_payment commerce_price -y

# Configuration de base Commerce
./vendor/bin/drush commerce:install
```

### Modules personnalisés Romus

Les modules `romus_products` et `romus_commerce` sont automatiquement configurés lors de leur activation et incluent :

#### romus_products
- Gestion des produits Romus (tapis, outillage, signalétique)
- Génération automatique de codes produits (TAP-, OUT-, SIG-)
- Templates personnalisés pour chaque type de produit

#### romus_commerce
- Fonctionnalités e-commerce personnalisées
- Templates panier et checkout en français
- Emails de confirmation personnalisés

## 🎨 Configuration du thème

Le thème `romusworld` est automatiquement configuré et inclut :

- **Design responsive** mobile-first
- **Charte graphique** rouge et gris
- **Navigation** hamburger mobile et mega-menu desktop
- **Intégration Commerce** complète
- **Accessibilité** WCAG 2.1

### Personnalisation des couleurs

Les couleurs peuvent être modifiées dans `web/themes/custom/romusworld/css/style.css` :

```css
:root {
  --romus-red: #c41e3a;        /* Rouge principal */
  --romus-red-dark: #a01729;   /* Rouge foncé */
  --romus-red-light: #e63946;  /* Rouge clair */
  --romus-gray: #6c757d;       /* Gris principal */
  --romus-gray-dark: #495057;  /* Gris foncé */
  --romus-gray-light: #adb5bd; /* Gris clair */
}
```

## 🔒 Sécurité et Performance

### Configuration de sécurité

```bash
# Mise à jour des permissions
find web/sites/default/files -type d -exec chmod 755 {} \;
find web/sites/default/files -type f -exec chmod 644 {} \;

# Configuration HTTPS (recommandé)
./vendor/bin/drush config:set system.performance css.preprocess 1 -y
./vendor/bin/drush config:set system.performance js.preprocess 1 -y
```

### Optimisation des performances

```bash
# Activation du cache
./vendor/bin/drush config:set system.performance cache.page.max_age 3600 -y

# Configuration des images
./vendor/bin/drush config:set image.settings allow_insecure_derivatives false -y
```

## 🧪 Tests et Vérification

### Vérification de l'installation

```bash
# Statut du site
./vendor/bin/drush status

# Vérification des modules
./vendor/bin/drush pm:list --type=module --status=enabled

# Vérification du thème
./vendor/bin/drush theme:list
```

### Tests fonctionnels

1. **Accès au site** : `http://localhost/romusb2c/web`
2. **Administration** : `http://localhost/romusb2c/web/admin`
3. **Commerce** : Vérifier la création de produits et le panier
4. **Responsive** : Tester sur mobile, tablet, desktop

## 📊 Configuration de développement

### Environnement de développement

```bash
# Mode développement
./vendor/bin/drush config:set system.performance css.preprocess 0 -y
./vendor/bin/drush config:set system.performance js.preprocess 0 -y
./vendor/bin/drush config:set system.logging error_level verbose -y

# Désactiver le cache pour le développement
./vendor/bin/drush config:set system.performance cache.page.max_age 0 -y
```

### Outils de développement

```bash
# Installation de Devel (optionnel)
composer require drupal/devel
./vendor/bin/drush en devel -y

# Installation de Admin Toolbar (optionnel)
composer require drupal/admin_toolbar
./vendor/bin/drush en admin_toolbar admin_toolbar_tools -y
```

## 🚀 Déploiement en production

### Préparation pour la production

```bash
# Optimisation des performances
./vendor/bin/drush config:set system.performance css.preprocess 1 -y
./vendor/bin/drush config:set system.performance js.preprocess 1 -y
./vendor/bin/drush config:set system.logging error_level hide -y

# Export de la configuration
./vendor/bin/drush config:export -y

# Nettoyage final
./vendor/bin/drush cache:rebuild
```

### Variables d'environnement

Créer un fichier `.env` pour la production :

```bash
# Base de données
DB_HOST=localhost
DB_NAME=romusworld_prod
DB_USER=romusworld_prod_user
DB_PASS=mot_de_passe_production_securise

# Sécurité
HASH_SALT=cle_salt_production_longue_et_aleatoire
TRUSTED_HOST_PATTERNS=^romusworld\.com$

# Performance
CACHE_ENABLED=1
CSS_JS_PREPROCESS=1
```

## 🆘 Dépannage

### Problèmes courants

#### Erreur "Unknown themes: romusworld"
```bash
# Vérifier que le thème existe
ls -la web/themes/custom/romusworld/

# Réinstaller le thème
./vendor/bin/drush theme:enable romusworld -y
```

#### Erreur "Unable to install modules romus_products, romus_commerce"
```bash
# Vérifier que les modules existent
ls -la web/modules/custom/romus_products/
ls -la web/modules/custom/romus_commerce/

# Réinstaller les modules
./vendor/bin/drush en romus_products romus_commerce -y
```

#### Erreur Composer "minimum-stability"
```bash
# Vérifier la configuration dans composer.json
grep -A 5 -B 5 "minimum-stability" composer.json

# Doit être : "minimum-stability": "RC"
```

#### Problèmes de permissions
```bash
# Réinitialiser les permissions
sudo chown -R www-data:www-data web/sites/default/files
sudo chmod -R 755 web/sites/default/files
```

### Logs et débogage

```bash
# Consulter les logs Drupal
./vendor/bin/drush watchdog:show

# Logs Apache/Nginx
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/nginx/error.log

# Logs PHP
sudo tail -f /var/log/php/error.log
```

## 📞 Support

Pour toute question ou problème :

1. **Documentation Drupal** : https://www.drupal.org/docs
2. **Drupal Commerce** : https://docs.drupalcommerce.org
3. **Issues GitHub** : https://github.com/easysystem-gy/romusb2c/issues

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2026  
**Drupal** : 10.2+  
**PHP** : 8.1+

