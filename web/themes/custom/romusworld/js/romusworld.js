/**
 * @file
 * Scripts principaux du thème Romusworld
 */

(function ($, Drupal, drupalSettings) {
  'use strict';

  /**
   * Initialisation générale du thème
   */
  Drupal.behaviors.romusworldGeneral = {
    attach: function (context, settings) {
      
      // Initialiser les composants une seule fois
      $('body', context).once('romusworld-init').each(function () {
        
        // Smooth scroll pour les ancres
        initSmoothScroll();
        
        // Lazy loading des images
        initLazyLoading();
        
        // Animations au scroll
        initScrollAnimations();
        
        // Gestion des modales
        initModals();
        
        // Tooltips
        initTooltips();
        
        // Notifications
        initNotifications();
        
      });
    }
  };

  /**
   * Smooth scroll pour les liens d'ancrage
   */
  function initSmoothScroll() {
    $('a[href^="#"]').on('click', function (e) {
      var target = $(this.getAttribute('href'));
      
      if (target.length) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - 80 // Offset pour le header fixe
        }, 800, 'easeInOutCubic');
      }
    });
  }

  /**
   * Lazy loading des images avec Intersection Observer
   */
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Animations au scroll avec Intersection Observer
   */
  function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
      });
    }
  }

  /**
   * Gestion des modales
   */
  function initModals() {
    // Ouvrir une modale
    $(document).on('click', '[data-modal-trigger]', function (e) {
      e.preventDefault();
      const modalId = $(this).data('modal-trigger');
      const $modal = $('#' + modalId);
      
      if ($modal.length) {
        $modal.addClass('active');
        $('body').addClass('modal-open');
        
        // Focus sur le premier élément focusable
        const firstFocusable = $modal.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').first();
        if (firstFocusable.length) {
          firstFocusable.focus();
        }
      }
    });

    // Fermer une modale
    $(document).on('click', '[data-modal-close], .modal-overlay', function (e) {
      e.preventDefault();
      closeModal();
    });

    // Fermer avec Escape
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $('.modal.active').length) {
        closeModal();
      }
    });

    function closeModal() {
      $('.modal.active').removeClass('active');
      $('body').removeClass('modal-open');
    }
  }

  /**
   * Initialisation des tooltips
   */
  function initTooltips() {
    $('[data-tooltip]').each(function () {
      const $element = $(this);
      const tooltipText = $element.data('tooltip');
      
      $element.on('mouseenter focus', function () {
        showTooltip($element, tooltipText);
      });
      
      $element.on('mouseleave blur', function () {
        hideTooltip();
      });
    });
  }

  function showTooltip($element, text) {
    const $tooltip = $('<div class="tooltip">' + text + '</div>');
    $('body').append($tooltip);
    
    const elementRect = $element[0].getBoundingClientRect();
    const tooltipRect = $tooltip[0].getBoundingClientRect();
    
    $tooltip.css({
      top: elementRect.top - tooltipRect.height - 10,
      left: elementRect.left + (elementRect.width - tooltipRect.width) / 2
    });
    
    setTimeout(() => $tooltip.addClass('visible'), 10);
  }

  function hideTooltip() {
    $('.tooltip').remove();
  }

  /**
   * Système de notifications
   */
  function initNotifications() {
    // Auto-hide des messages après 5 secondes
    $('.alert').each(function () {
      const $alert = $(this);
      setTimeout(() => {
        $alert.fadeOut(300, function () {
          $(this).remove();
        });
      }, 5000);
    });

    // Bouton de fermeture des notifications
    $(document).on('click', '.alert .close', function () {
      $(this).closest('.alert').fadeOut(300, function () {
        $(this).remove();
      });
    });
  }

  /**
   * Utilitaires globaux
   */
  window.Romusworld = {
    
    /**
     * Afficher une notification
     */
    showNotification: function (message, type = 'info') {
      const $notification = $(`
        <div class="alert alert-${type} notification-popup">
          <span class="message">${message}</span>
          <button type="button" class="close" aria-label="Fermer">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `);
      
      $('body').append($notification);
      
      setTimeout(() => {
        $notification.addClass('show');
      }, 100);
      
      setTimeout(() => {
        $notification.removeClass('show');
        setTimeout(() => $notification.remove(), 300);
      }, 4000);
    },

    /**
     * Formater un prix
     */
    formatPrice: function (price, currency = '€') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency === '€' ? 'EUR' : currency
      }).format(price);
    },

    /**
     * Debounce function
     */
    debounce: function (func, wait, immediate) {
      let timeout;
      return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    /**
     * Throttle function
     */
    throttle: function (func, limit) {
      let inThrottle;
      return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  };

  /**
   * Gestion des erreurs JavaScript
   */
  window.addEventListener('error', function (e) {
    console.error('Erreur JavaScript:', e.error);
    
    // En développement, afficher l'erreur
    if (drupalSettings.romusworld && drupalSettings.romusworld.debug) {
      Romusworld.showNotification('Erreur JavaScript: ' + e.message, 'error');
    }
  });

  /**
   * Performance monitoring
   */
  if ('performance' in window && 'measure' in window.performance) {
    window.addEventListener('load', function () {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Performance Romusworld:', {
          'Temps de chargement': Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms',
          'DOM Ready': Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart) + 'ms',
          'First Paint': Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0) + 'ms'
        });
      }, 0);
    });
  }

})(jQuery, Drupal, drupalSettings);

