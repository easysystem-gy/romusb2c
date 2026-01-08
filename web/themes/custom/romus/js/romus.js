/**
 * @file
 * JavaScript de base pour le thème Romus
 */

(function ($, Drupal) {
  'use strict';

  /**
   * Comportement de base pour le thème Romus
   */
  Drupal.behaviors.romusBase = {
    attach: function (context, settings) {
      // Initialisation de base
      console.log('Thème Romus initialisé');
      
      // Gestion des boutons icônes
      $('.btn-icon', context).once('romus-btn-icon').on('click', function(e) {
        // Logique de base pour les boutons icônes
      });
    }
  };

})(jQuery, Drupal);
