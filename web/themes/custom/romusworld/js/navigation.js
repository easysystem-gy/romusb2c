/**
 * @file
 * JavaScript pour la navigation Romusworld
 */

(function ($, Drupal) {
  'use strict';

  /**
   * Comportement de navigation responsive
   */
  Drupal.behaviors.romusworldNavigation = {
    attach: function (context, settings) {
      
      this.initMobileMenu(context);
      this.initMegaMenu(context);
      this.initSearchToggle(context);
      this.initStickyHeader(context);
      
    },

    /**
     * Menu mobile hamburger
     */
    initMobileMenu: function (context) {
      
      // Créer le bouton hamburger s'il n'existe pas
      if (!$('.mobile-menu-toggle').length) {
        var $toggle = $('<button class="mobile-menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button>');
        $('.site-header .container').append($toggle);
      }
      
      $('.mobile-menu-toggle', context).once('romusworld-mobile-menu').on('click', function () {
        var $toggle = $(this);
        var $nav = $('.main-navigation');
        
        $toggle.toggleClass('mobile-menu-toggle--active');
        $nav.toggleClass('is-open');
        
        // Accessibilité
        var isOpen = $nav.hasClass('is-open');
        $toggle.attr('aria-expanded', isOpen);
        
        // Empêcher le scroll du body quand le menu est ouvert
        $('body').toggleClass('mobile-menu-open', isOpen);
      });
      
      // Fermer le menu en cliquant à l'extérieur
      $(document).on('click', function (e) {
        if (!$(e.target).closest('.main-navigation, .mobile-menu-toggle').length) {
          $('.main-navigation').removeClass('is-open');
          $('.mobile-menu-toggle').removeClass('mobile-menu-toggle--active').attr('aria-expanded', false);
          $('body').removeClass('mobile-menu-open');
        }
      });
      
      // Fermer le menu au redimensionnement
      $(window).on('resize', function () {
        if ($(window).width() >= 768) {
          $('.main-navigation').removeClass('is-open');
          $('.mobile-menu-toggle').removeClass('mobile-menu-toggle--active').attr('aria-expanded', false);
          $('body').removeClass('mobile-menu-open');
        }
      });
    },

    /**
     * Mega menu pour desktop
     */
    initMegaMenu: function (context) {
      
      $('.main-navigation .menu-item--expanded', context).once('romusworld-mega-menu').each(function () {
        var $item = $(this);
        var $link = $item.find('> a');
        var $submenu = $item.find('> .sub-menu');
        
        var showTimeout, hideTimeout;
        
        $item.hover(
          function () {
            clearTimeout(hideTimeout);
            showTimeout = setTimeout(function () {
              $submenu.addClass('sub-menu--visible');
              $link.addClass('menu-link--active');
            }, 150);
          },
          function () {
            clearTimeout(showTimeout);
            hideTimeout = setTimeout(function () {
              $submenu.removeClass('sub-menu--visible');
              $link.removeClass('menu-link--active');
            }, 300);
          }
        );
        
        // Navigation au clavier
        $link.on('focus', function () {
          $submenu.addClass('sub-menu--visible');
          $(this).addClass('menu-link--active');
        });
        
        $item.on('focusout', function (e) {
          // Vérifier si le focus reste dans le sous-menu
          setTimeout(function () {
            if (!$item.find(':focus').length) {
              $submenu.removeClass('sub-menu--visible');
              $link.removeClass('menu-link--active');
            }
          }, 100);
        });
      });
    },

    /**
     * Toggle de recherche
     */
    initSearchToggle: function (context) {
      
      $('.search-toggle', context).once('romusworld-search').on('click', function (e) {
        e.preventDefault();
        
        var $toggle = $(this);
        var $searchForm = $('.search-form');
        
        $searchForm.toggleClass('search-form--visible');
        
        if ($searchForm.hasClass('search-form--visible')) {
          $searchForm.find('input[type="search"]').focus();
        }
      });
      
      // Fermer la recherche avec Escape
      $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
          $('.search-form').removeClass('search-form--visible');
        }
      });
    },

    /**
     * Header sticky
     */
    initStickyHeader: function (context) {
      
      var $header = $('.site-header');
      var headerHeight = $header.outerHeight();
      var scrollThreshold = headerHeight;
      
      $(window).on('scroll', function () {
        var scrollTop = $(window).scrollTop();
        
        if (scrollTop > scrollThreshold) {
          $header.addClass('site-header--sticky');
          $('body').css('padding-top', headerHeight + 'px');
        } else {
          $header.removeClass('site-header--sticky');
          $('body').css('padding-top', '0');
        }
      });
      
      // Recalculer au redimensionnement
      $(window).on('resize', function () {
        headerHeight = $header.outerHeight();
        scrollThreshold = headerHeight;
      });
    }
  };

  /**
   * Comportement du breadcrumb
   */
  Drupal.behaviors.romusworldBreadcrumb = {
    attach: function (context, settings) {
      
      $('.breadcrumb', context).once('romusworld-breadcrumb').each(function () {
        var $breadcrumb = $(this);
        var $items = $breadcrumb.find('.breadcrumb-item');
        
        // Masquer les éléments intermédiaires sur mobile si trop nombreux
        if ($items.length > 3 && $(window).width() < 768) {
          $items.slice(1, -1).addClass('breadcrumb-item--hidden');
          
          // Ajouter un indicateur "..."
          if (!$breadcrumb.find('.breadcrumb-ellipsis').length) {
            $items.eq(1).before('<li class="breadcrumb-item breadcrumb-ellipsis">...</li>');
          }
        }
      });
      
      // Réafficher tous les éléments sur desktop
      $(window).on('resize', function () {
        if ($(window).width() >= 768) {
          $('.breadcrumb-item--hidden').removeClass('breadcrumb-item--hidden');
          $('.breadcrumb-ellipsis').remove();
        }
      });
    }
  };

  /**
   * Comportement de la recherche
   */
  Drupal.behaviors.romusworldSearch = {
    attach: function (context, settings) {
      
      $('.search-form input[type="search"]', context).once('romusworld-search-input').each(function () {
        var $input = $(this);
        var $form = $input.closest('form');
        
        // Recherche en temps réel (debounced)
        var searchTimeout;
        $input.on('input', function () {
          clearTimeout(searchTimeout);
          var query = $(this).val();
          
          if (query.length >= 3) {
            searchTimeout = setTimeout(function () {
              // Ici on pourrait implémenter une recherche AJAX
              console.log('Recherche:', query);
            }, 500);
          }
        });
        
        // Effacer la recherche
        var $clearBtn = $('<button type="button" class="search-clear" aria-label="Effacer">×</button>');
        $input.after($clearBtn);
        
        $clearBtn.on('click', function () {
          $input.val('').focus();
          // Effacer les résultats de recherche
        });
        
        // Afficher/masquer le bouton d'effacement
        $input.on('input', function () {
          $clearBtn.toggle($(this).val().length > 0);
        });
      });
    }
  };

})(jQuery, Drupal);

