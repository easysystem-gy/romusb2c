# Images du thème Romusworld

Ce répertoire contient les assets visuels du thème Romusworld.

## Fichiers inclus

### Logo
- `logo-romusworld.svg` - Logo principal du site (format vectoriel)
- Couleurs : Rouge Romus (#c41e3a) et gris (#495057)
- Dimensions : 200x60px
- Utilisation : Header du site, emails, documents

### Favicon
- `favicon.ico` - Icône du site (16x16, 32x32, 48x48px)
- À remplacer par une vraie favicon générée

### Screenshot du thème
- `../screenshot.png` - Capture d'écran du thème pour l'admin Drupal
- Dimensions recommandées : 294x219px
- À remplacer par une vraie capture d'écran

## Assets à ajouter

### Logos supplémentaires
- `logo-romusworld.png` - Version PNG du logo (pour compatibilité)
- `logo-romusworld-white.svg` - Version blanche pour fonds sombres
- `logo-romusworld-small.svg` - Version compacte pour mobile

### Images de contenu
- `hero-background.jpg` - Image de fond pour la page d'accueil
- `products-placeholder.jpg` - Image par défaut pour produits sans photo
- `about-romus.jpg` - Image pour la page "À propos"

### Icônes
- `icon-tapis.svg` - Icône pour catégorie tapis
- `icon-outillage.svg` - Icône pour catégorie outillage  
- `icon-signaletique.svg` - Icône pour catégorie signalétique
- `icon-cart.svg` - Icône panier
- `icon-user.svg` - Icône compte utilisateur
- `icon-search.svg` - Icône recherche

### Images produits (exemples)
- `tapis-technique-exemple.jpg`
- `outillage-pose-exemple.jpg`
- `dalle-podotactile-exemple.jpg`

## Utilisation dans le thème

Les images sont référencées dans les templates Twig :
```twig
<img src="{{ base_path ~ directory }}/images/logo-romusworld.svg" alt="Romusworld" />
```

Et dans les fichiers CSS :
```css
.site-logo {
  background-image: url('../images/logo-romusworld.svg');
}
```

## Optimisation

- **SVG** : Privilégier pour logos et icônes (vectoriel, léger)
- **PNG** : Pour images avec transparence
- **JPG** : Pour photos produits (compression)
- **WebP** : Format moderne pour de meilleures performances

## Droits et licences

- Logo Romusworld : Propriété de l'entreprise Romus
- Images produits : Fournies par Romus ou libres de droits
- Icônes : Font Awesome, Feather Icons ou création personnalisée

