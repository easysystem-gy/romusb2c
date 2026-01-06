# Guide d'Installation - Romusworld B2C

## Prérequis Système

### Serveur Web
- **Apache 2.4+** ou **Nginx 1.18+**
- **PHP 8.1+** avec extensions :
  - pdo_pgsql (pour PostgreSQL)
  - gd ou imagick (traitement d'images)
  - curl
  - mbstring
  - xml
  - zip
  - opcache (recommandé)

### Base de Données
- **PostgreSQL 13+** (recommandé pour les performances)
- Minimum 1GB d'espace disque pour la base
- Utilisateur avec privilèges CREATE DATABASE

### Outils de Développement
- **Composer 2.x** (gestion des dépendances PHP)
- **Node.js 16+** et **npm/yarn** (pour le thème)
- **Git** (gestion de version)
- **Drush 12+** (outil en ligne de commande Drupal)

## Installation Étape par Étape

### 1. Préparation de l'Environnement

```bash
# Cloner le repository
git clone https://github.com/easysystem-gy/romusb2c.git
cd romusb2c

# Vérifier les prérequis PHP
php -v
php -m | grep -E "(pdo_pgsql|gd|curl|mbstring|xml|zip)"
```

### 2. Installation des Dépendances

```bash
# Installer les dépendances Composer
composer install --no-dev --optimize-autoloader

# Si erreur de mémoire PHP
php -d memory_limit=512M /usr/local/bin/composer install
```

### 3. Configuration de la Base de Données

```sql
-- Se connecter à PostgreSQL en tant que superutilisateur
sudo -u postgres psql

-- Créer l'utilisateur et la base de données
CREATE USER romus_user WITH PASSWORD 'votre_mot_de_passe_securise';
CREATE DATABASE romusworld_db OWNER romus_user;
GRANT ALL PRIVILEGES ON DATABASE romusworld_db TO romus_user;

-- Quitter PostgreSQL
\q
```

### 4. Configuration Drupal

```bash
# Copier le fichier de configuration
cp web/sites/default/default.settings.php web/sites/default/settings.php

# Modifier les permissions
chmod 666 web/sites/default/settings.php
mkdir -p web/sites/default/files
chmod 777 web/sites/default/files
```

Éditer `web/sites/default/settings.php` et modifier :

```php
$databases['default']['default'] = [
  'database' => 'romusworld_db',
  'username' => 'romus_user',
  'password' => 'votre_mot_de_passe_securise',
  'prefix' => '',
  'host' => 'localhost',
  'port' => '5432',
  'namespace' => 'Drupal\\pgsql\\Driver\\Database\\pgsql',
  'driver' => 'pgsql',
];

// Générer une nouvelle clé de hachage
$settings['hash_salt'] = 'GENERER_UNE_CLE_ALEATOIRE_64_CARACTERES';
```

### 5. Installation Drupal

```bash
# Installation via Drush (recommandé)
./vendor/bin/drush site:install standard \
  --db-url=pgsql://romus_user:votre_mot_de_passe@localhost/romusworld_db \
  --site-name="Romusworld B2C" \
  --account-name=admin \
  --account-pass=admin_password_securise \
  --account-mail=admin@romusworld.com \
  --locale=fr

# Ou installation via interface web
# Aller sur http://votre-domaine.com/core/install.php
```

### 6. Configuration Post-Installation

```bash
# Activer les modules nécessaires
./vendor/bin/drush en -y \
  admin_toolbar \
  pathauto \
  metatag \
  token \
  field_group \
  paragraphs \
  commerce \
  search_api \
  facets \
  webform \
  google_analytics \
  redirect \
  xmlsitemap

# Importer la configuration personnalisée
./vendor/bin/drush config:import -y

# Vider les caches
./vendor/bin/drush cache:rebuild

# Indexer le contenu pour la recherche
./vendor/bin/drush search-api:index
```

### 7. Configuration du Thème

```bash
# Aller dans le répertoire du thème
cd web/themes/custom/romusworld

# Installer les dépendances Node.js
npm install

# Compiler les assets (CSS/JS)
npm run build

# Retourner à la racine
cd ../../../../

# Activer le thème
./vendor/bin/drush theme:enable romusworld
./vendor/bin/drush config:set system.theme default romusworld
```

### 8. Configuration des Permissions

```bash
# Sécuriser les fichiers de configuration
chmod 644 web/sites/default/settings.php
chmod 755 web/sites/default/files

# Configurer les permissions Apache/Nginx
# Voir la section "Configuration Serveur Web" ci-dessous
```

## Configuration Serveur Web

### Apache (.htaccess)

Le fichier `.htaccess` est inclus avec Drupal. Vérifier que `mod_rewrite` est activé :

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

Configuration VirtualHost recommandée :

```apache
<VirtualHost *:80>
    ServerName romusworld.com
    ServerAlias www.romusworld.com
    DocumentRoot /var/www/romusb2c/web
    
    <Directory /var/www/romusb2c/web>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/romusworld_error.log
    CustomLog ${APACHE_LOG_DIR}/romusworld_access.log combined
</VirtualHost>
```

### Nginx

Configuration Nginx recommandée :

```nginx
server {
    listen 80;
    server_name romusworld.com www.romusworld.com;
    root /var/www/romusb2c/web;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\. {
        deny all;
    }
}
```

## Configuration de Production

### 1. Optimisations de Performance

```bash
# Activer l'agrégation CSS/JS
./vendor/bin/drush config:set system.performance css.preprocess 1
./vendor/bin/drush config:set system.performance js.preprocess 1

# Configurer le cache
./vendor/bin/drush config:set system.performance cache.page.max_age 3600

# Optimiser les images
./vendor/bin/drush config:set image.settings allow_insecure_derivatives 0
```

### 2. Sécurité

```bash
# Masquer les erreurs PHP
./vendor/bin/drush config:set system.logging error_level hide

# Configurer les mises à jour automatiques
./vendor/bin/drush config:set update.settings notification.emails.0 admin@romusworld.com

# Configurer HTTPS (recommandé)
# Voir la documentation SSL de votre hébergeur
```

### 3. Sauvegardes

```bash
# Sauvegarde de la base de données
./vendor/bin/drush sql:dump --result-file=backup-$(date +%Y%m%d-%H%M%S).sql

# Sauvegarde des fichiers
tar -czf files-backup-$(date +%Y%m%d-%H%M%S).tar.gz web/sites/default/files/

# Automatiser avec cron (exemple)
# 0 2 * * * cd /var/www/romusb2c && ./vendor/bin/drush sql:dump --result-file=backup-$(date +\%Y\%m\%d).sql
```

## Maintenance et Mises à Jour

### Mises à Jour de Sécurité

```bash
# Vérifier les mises à jour disponibles
./vendor/bin/drush ups

# Mettre à jour Drupal Core
composer update drupal/core-recommended --with-dependencies
./vendor/bin/drush updatedb
./vendor/bin/drush cache:rebuild

# Mettre à jour les modules
composer update
./vendor/bin/drush updatedb
./vendor/bin/drush cache:rebuild
```

### Monitoring

```bash
# Vérifier l'état du site
./vendor/bin/drush status

# Vérifier les logs d'erreur
./vendor/bin/drush watchdog:show --type=php

# Vérifier les performances
./vendor/bin/drush core:requirements
```

## Dépannage

### Problèmes Courants

1. **Erreur de mémoire PHP**
   ```bash
   # Augmenter memory_limit dans php.ini
   memory_limit = 512M
   ```

2. **Problèmes de permissions**
   ```bash
   # Réinitialiser les permissions
   find web/sites/default/files -type d -exec chmod 755 {} \;
   find web/sites/default/files -type f -exec chmod 644 {} \;
   ```

3. **Cache bloqué**
   ```bash
   # Vider tous les caches
   ./vendor/bin/drush cache:rebuild
   ./vendor/bin/drush cr
   ```

4. **Base de données corrompue**
   ```bash
   # Réparer les tables
   ./vendor/bin/drush updatedb
   ```

### Logs Utiles

- **Drupal** : Administration > Rapports > Messages récents
- **Apache** : `/var/log/apache2/error.log`
- **Nginx** : `/var/log/nginx/error.log`
- **PHP** : `/var/log/php8.1-fpm.log`
- **PostgreSQL** : `/var/log/postgresql/postgresql-13-main.log`

## Support

Pour toute assistance technique :
- **Documentation Drupal** : https://www.drupal.org/docs
- **Support EasySystem** : support@easysystem.gy
- **Issues GitHub** : https://github.com/easysystem-gy/romusb2c/issues

---

*Guide d'installation v1.0 - Romusworld B2C*

