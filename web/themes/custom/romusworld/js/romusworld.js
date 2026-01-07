/**
 * @file
 * JavaScript principal du thème Romusworld
 */

(function ($, Drupal) {
  'use strict';

  /**
   * Comportement principal du thème Romusworld
   */
  Drupal.behaviors.romusworld = {
    attach: function (context, settings) {
      
      // Initialisation des composants
      this.initProductCards(context);
      this.initCartInteractions(context);
      this.initFormEnhancements(context);
      this.initScrollEffects(context);
      
    },

    /**
     * Amélioration des cartes produits
     */
    initProductCards: function (context) {
      $('.product-card', context).once('romusworld-product-card').each(function () {
        var $card = $(this);
        
        // Animation au survol
        $card.hover(
          function () {
            $(this).addClass('product-card--hover');
          },
          function () {
            $(this).removeClass('product-card--hover');
          }
        );
        
        // Gestion des images produits
        var $image = $card.find('.product-image');
        if ($image.length) {
          $image.on('error', function () {
            $(this).attr('src', '/themes/custom/romusworld/images/placeholder-product.jpg');
          });
        }
      });
    },

    /**
     * Interactions du panier
     */
    initCartInteractions: function (context) {
      
      // Boutons d'ajout au panier
      $('.btn-add-to-cart', context).once('romusworld-cart').each(function () {
        $(this).on('click', function (e) {
          var $btn = $(this);
          
          // Animation de chargement
          $btn.addClass('btn-loading').prop('disabled', true);
          
          // Restaurer après 2 secondes (le temps de la requête AJAX)
          setTimeout(function () {
            $btn.removeClass('btn-loading').prop('disabled', false);
          }, 2000);
        });
      });
      
      // Mise à jour quantités panier
      $('.cart-quantity-input', context).once('romusworld-quantity').each(function () {
        $(this).on('change', function () {
          var $input = $(this);
          var quantity = parseInt($input.val());
          
          if (quantity < 1) {
            $input.val(1);
          }
          
          // Déclencher la mise à jour du panier
          $input.closest('form').find('.btn-update-cart').trigger('click');
        });
      });
    },

    /**
     * Améliorations des formulaires
     */
    initFormEnhancements: function (context) {
      
      // Labels flottants
      $('.form-control', context).once('romusworld-form').each(function () {
        var $input = $(this);
        var $group = $input.closest('.form-group');
        
        $input.on('focus blur', function () {
          $group.toggleClass('form-group--focused', $(this).is(':focus'));
          $group.toggleClass('form-group--filled', $(this).val().length > 0);
        });
        
        // État initial
        if ($input.val().length > 0) {
          $group.addClass('form-group--filled');
        }
      });
      
      // Validation en temps réel
      $('.form-control[required]', context).once('romusworld-validation').each(function () {
        $(this).on('blur', function () {
          var $input = $(this);
          var $group = $input.closest('.form-group');
          
          if ($input.val().length === 0) {
            $group.addClass('form-group--error');
          } else {
            $group.removeClass('form-group--error');
          }
        });
      });
    },

    /**
     * Effets de scroll
     */
    initScrollEffects: function (context) {
      
      // Bouton retour en haut
      var $backToTop = $('<button class="btn-back-to-top" title="Retour en haut"><i class="icon-arrow-up"></i></button>');
      $('body').append($backToTop);
      
      $backToTop.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
      });
      
      // Afficher/masquer selon le scroll
      $(window).on('scroll', function () {
        if ($(window).scrollTop() > 300) {
          $backToTop.addClass('btn-back-to-top--visible');
        } else {
          $backToTop.removeClass('btn-back-to-top--visible');
        }
      });
      
      // Animation des éléments au scroll
      $('.product-card, .cart-summary', context).once('romusworld-scroll').each(function () {
        var $element = $(this);
        
        $(window).on('scroll', function () {
          var elementTop = $element.offset().top;
          var windowBottom = $(window).scrollTop() + $(window).height();
          
          if (elementTop < windowBottom - 100) {
            $element.addClass('animate-in');
          }
        });
      });
    }
  };

  /**
   * Utilitaires globaux Romusworld
   */
  Drupal.romusworld = {
    
    /**
     * Afficher une notification
     */
    showNotification: function (message, type) {
      type = type || 'info';
      
      var $notification = $('<div class="notification notification--' + type + '">' + message + '</div>');
      $('body').append($notification);
      
      setTimeout(function () {
        $notification.addClass('notification--visible');
      }, 100);
      
      setTimeout(function () {
        $notification.removeClass('notification--visible');
        setTimeout(function () {
          $notification.remove();
        }, 300);
      }, 3000);
    },
    
    /**
     * Formater un prix
     */
    formatPrice: function (price) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price);
    },
    
    /**
     * Débounce pour les événements
     */
    debounce: function (func, wait) {
      var timeout;
      return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function () {
          timeout = null;
          func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

})(jQuery, Drupal);

