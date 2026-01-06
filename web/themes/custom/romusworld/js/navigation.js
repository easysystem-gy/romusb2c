/**
 * @file
 * Scripts pour la navigation Romusworld
 */

(function ($, Drupal) {
  'use strict';

  /**
   * Navigation responsive et interactions
   */
  Drupal.behaviors.romusworldNavigation = {
    attach: function (context, settings) {
      
      $('.main-navigation', context).once('navigation-init').each(function () {
        const $nav = $(this);
        
        // Initialiser la navigation mobile
        initMobileNavigation($nav);
        
        // Initialiser les menus déroulants
        initDropdownMenus($nav);
        
        // Initialiser la navigation sticky
        initStickyNavigation($nav);
        
        // Initialiser la recherche
        initSearchToggle($nav);
        
        // Initialiser les indicateurs actifs
        initActiveStates($nav);
      });
    }
  };

  /**
   * Navigation mobile avec menu hamburger
   */
  function initMobileNavigation($nav) {
    const $toggle = $nav.find('.mobile-menu-toggle');
    const $menu = $nav.find('.main-menu');
    
    // Créer le bouton hamburger s'il n'existe pas
    if (!$toggle.length) {
      const $hamburger = $(`
        <button class="mobile-menu-toggle" type="button" aria-label="Menu" aria-expanded="false">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      `);
      $nav.prepend($hamburger);
    }

    // Toggle du menu mobile
    $(document).on('click', '.mobile-menu-toggle', function (e) {
      e.preventDefault();
      const $button = $(this);
      const $menu = $nav.find('.main-menu');
      const isOpen = $button.attr('aria-expanded') === 'true';
      
      if (isOpen) {
        closeMobileMenu($button, $menu);
      } else {
        openMobileMenu($button, $menu);
      }
    });

    // Fermer le menu en cliquant à l'extérieur
    $(document).on('click', function (e) {
      if (!$nav[0].contains(e.target) && $nav.hasClass('mobile-menu-open')) {
        const $button = $nav.find('.mobile-menu-toggle');
        const $menu = $nav.find('.main-menu');
        closeMobileMenu($button, $menu);
      }
    });

    // Fermer le menu avec Escape
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $nav.hasClass('mobile-menu-open')) {
        const $button = $nav.find('.mobile-menu-toggle');
        const $menu = $nav.find('.main-menu');
        closeMobileMenu($button, $menu);
      }
    });

    // Gérer le redimensionnement de la fenêtre
    $(window).on('resize', Romusworld.debounce(function () {
      if (window.innerWidth > 1024 && $nav.hasClass('mobile-menu-open')) {
        const $button = $nav.find('.mobile-menu-toggle');
        const $menu = $nav.find('.main-menu');
        closeMobileMenu($button, $menu);
      }
    }, 250));
  }

  function openMobileMenu($button, $menu) {
    $button.attr('aria-expanded', 'true').addClass('active');
    $menu.addClass('mobile-open');
    $button.closest('.main-navigation').addClass('mobile-menu-open');
    $('body').addClass('mobile-menu-open');
    
    // Focus sur le premier lien
    const $firstLink = $menu.find('a').first();
    if ($firstLink.length) {
      setTimeout(() => $firstLink.focus(), 300);
    }
  }

  function closeMobileMenu($button, $menu) {
    $button.attr('aria-expanded', 'false').removeClass('active');
    $menu.removeClass('mobile-open');
    $button.closest('.main-navigation').removeClass('mobile-menu-open');
    $('body').removeClass('mobile-menu-open');
  }

  /**
   * Menus déroulants (dropdowns)
   */
  function initDropdownMenus($nav) {
    const $dropdownToggles = $nav.find('.menu-item--expanded > a');
    
    $dropdownToggles.each(function () {
      const $toggle = $(this);
      const $item = $toggle.parent();
      const $submenu = $item.find('.menu').first();
      
      // Ajouter l'indicateur de sous-menu
      if (!$toggle.find('.dropdown-indicator').length) {
        $toggle.append('<span class="dropdown-indicator" aria-hidden="true"></span>');
      }
      
      // Gestion hover sur desktop
      if (window.innerWidth > 1024) {
        $item.on('mouseenter', function () {
          openDropdown($item, $submenu);
        });
        
        $item.on('mouseleave', function () {
          closeDropdown($item, $submenu);
        });
      }
      
      // Gestion click/touch
      $toggle.on('click', function (e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          const isOpen = $item.hasClass('dropdown-open');
          
          // Fermer tous les autres dropdowns
          $nav.find('.dropdown-open').removeClass('dropdown-open');
          $nav.find('.submenu-open').removeClass('submenu-open');
          
          if (!isOpen) {
            openDropdown($item, $submenu);
          }
        }
      });
    });

    // Fermer les dropdowns en cliquant à l'extérieur
    $(document).on('click', function (e) {
      if (!$nav[0].contains(e.target)) {
        $nav.find('.dropdown-open').removeClass('dropdown-open');
        $nav.find('.submenu-open').removeClass('submenu-open');
      }
    });
  }

  function openDropdown($item, $submenu) {
    $item.addClass('dropdown-open');
    $submenu.addClass('submenu-open');
    
    // Ajuster la position si nécessaire
    adjustDropdownPosition($submenu);
  }

  function closeDropdown($item, $submenu) {
    $item.removeClass('dropdown-open');
    $submenu.removeClass('submenu-open');
  }

  function adjustDropdownPosition($submenu) {
    const submenuRect = $submenu[0].getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Si le sous-menu dépasse à droite
    if (submenuRect.right > viewportWidth) {
      $submenu.addClass('dropdown-right');
    } else {
      $submenu.removeClass('dropdown-right');
    }
  }

  /**
   * Navigation sticky
   */
  function initStickyNavigation($nav) {
    const $header = $nav.closest('.site-header');
    let lastScrollTop = 0;
    let isSticky = false;
    
    const handleScroll = Romusworld.throttle(function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const headerHeight = $header.outerHeight();
      
      // Ajouter/retirer la classe sticky
      if (scrollTop > headerHeight && !isSticky) {
        $header.addClass('header-sticky');
        $('body').css('padding-top', headerHeight + 'px');
        isSticky = true;
      } else if (scrollTop <= headerHeight && isSticky) {
        $header.removeClass('header-sticky');
        $('body').css('padding-top', '0');
        isSticky = false;
      }
      
      // Masquer/afficher la navigation au scroll (optionnel)
      if (isSticky) {
        if (scrollTop > lastScrollTop && scrollTop > headerHeight * 2) {
          // Scroll vers le bas - masquer
          $header.addClass('header-hidden');
        } else {
          // Scroll vers le haut - afficher
          $header.removeClass('header-hidden');
        }
      }
      
      lastScrollTop = scrollTop;
    }, 100);
    
    $(window).on('scroll', handleScroll);
  }

  /**
   * Toggle de la recherche
   */
  function initSearchToggle($nav) {
    const $searchToggle = $nav.find('.search-toggle');
    const $searchForm = $nav.find('.search-form');
    
    $searchToggle.on('click', function (e) {
      e.preventDefault();
      const isOpen = $searchForm.hasClass('search-open');
      
      if (isOpen) {
        closeSearch($searchForm, $searchToggle);
      } else {
        openSearch($searchForm, $searchToggle);
      }
    });
    
    // Fermer la recherche avec Escape
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $searchForm.hasClass('search-open')) {
        closeSearch($searchForm, $searchToggle);
      }
    });
    
    // Fermer en cliquant à l'extérieur
    $(document).on('click', function (e) {
      if (!$searchForm[0].contains(e.target) && !$searchToggle[0].contains(e.target)) {
        if ($searchForm.hasClass('search-open')) {
          closeSearch($searchForm, $searchToggle);
        }
      }
    });
  }

  function openSearch($searchForm, $searchToggle) {
    $searchForm.addClass('search-open');
    $searchToggle.addClass('active');
    
    // Focus sur le champ de recherche
    const $input = $searchForm.find('input[type="search"]');
    setTimeout(() => $input.focus(), 300);
  }

  function closeSearch($searchForm, $searchToggle) {
    $searchForm.removeClass('search-open');
    $searchToggle.removeClass('active');
  }

  /**
   * États actifs de la navigation
   */
  function initActiveStates($nav) {
    const currentPath = window.location.pathname;
    const $menuLinks = $nav.find('.menu a');
    
    $menuLinks.each(function () {
      const $link = $(this);
      const linkPath = $link.attr('href');
      
      // Marquer le lien actif
      if (linkPath === currentPath || 
          (linkPath !== '/' && currentPath.startsWith(linkPath))) {
        $link.addClass('active');
        $link.closest('.menu-item').addClass('menu-item--active-trail');
        
        // Marquer les parents actifs
        $link.parents('.menu-item--expanded').addClass('menu-item--active-trail');
      }
    });
  }

  /**
   * Accessibilité clavier pour la navigation
   */
  $(document).on('keydown', '.main-navigation a', function (e) {
    const $link = $(this);
    const $item = $link.closest('.menu-item');
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if ($item.hasClass('menu-item--expanded')) {
          // Ouvrir le sous-menu et focus sur le premier élément
          const $submenu = $item.find('.menu').first();
          openDropdown($item, $submenu);
          $submenu.find('a').first().focus();
        } else {
          // Focus sur l'élément suivant
          const $nextItem = $item.next('.menu-item');
          if ($nextItem.length) {
            $nextItem.find('> a').focus();
          }
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const $prevItem = $item.prev('.menu-item');
        if ($prevItem.length) {
          $prevItem.find('> a').focus();
        }
        break;
        
      case 'ArrowRight':
        e.preventDefault();
        if ($item.hasClass('menu-item--expanded')) {
          const $submenu = $item.find('.menu').first();
          openDropdown($item, $submenu);
          $submenu.find('a').first().focus();
        }
        break;
        
      case 'ArrowLeft':
        e.preventDefault();
        const $parentItem = $item.closest('.menu-item--expanded');
        if ($parentItem.length) {
          closeDropdown($parentItem, $parentItem.find('.menu').first());
          $parentItem.find('> a').focus();
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        const $openParent = $item.closest('.dropdown-open');
        if ($openParent.length) {
          closeDropdown($openParent, $openParent.find('.menu').first());
          $openParent.find('> a').focus();
        }
        break;
    }
  });

})(jQuery, Drupal);

