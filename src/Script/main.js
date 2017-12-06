
/**
 * Import all external resources
 */
import Frame from './Classes/Frame';
import DOMHandler from './Classes/DOMHandler';
import AdaptData from '@adapt-retail/banner-data';
import SwipeController from './Classes/SwipeController';

/**
 * Import all html templates
 */
import HeadTemplate from '../views/head.template.html';
import ProductTemplate from '../views/product.template.html';
import ContainerTemplate from '../views/container.template.html';

/**
 * Prepare Adapt data
 * If local development we connect to the API
 * If not we are using the data adapt provides for us
 */
window.adaptData = new AdaptData( {
    account: 'priceco58c12436f20b4',
    project: 1,
    campaign: 1,
    production: 1,
} );

/**
 * Prepare element to show
 */
var prepareSwipeElementToShow = function() {

    var navigation = document.querySelector( '.navigation' );

    // Remove all is-active on each navigation dot
    for (var i = 0, len = navigation.children.length; i < len; i++) {
        navigation.children[ i ].classList.remove( 'is-active' );
    }
    navigation.children[ swipeController.index ].classList.add( 'is-active' );
};

var items = [];

// Add container
DOMHandler.insertInBannerContainer( ContainerTemplate );
DOMHandler.insertInHead( HeadTemplate );

/**
 * Create instance of swipe controller
 */
var swipeController = new SwipeController({
    addTo: '#swipe-wrap',
});

/**
 * Run logic when DOM is ready
 */
document.addEventListener( "DOMContentLoaded", function(e) {

    /**
     * Start connection to Adapt retail
     * We return the data in the callback function
     */
    adaptData.start( function( response ) {

        /**
         * Convert Adapt response data to an array
         */
        items = Object.keys( response.data ).map( function(key) {
            return response.data[key];
        } ).map( function(item) {
            // Convert each item to a Frame instance
            return new Frame( item );
        } );

        // Find element to add all the swipe information in to
        var navigation = document.querySelector( '.navigation' );

        // Insert all products to swipe carousel
        for (var i = 0, len = items.length; i < len; i++) {
            var product = items[i];

            // Render template
            swipeController.addFrame( product );

            // Add dot to navigation
            DOMHandler.insertHtml( navigation, '<div class="navigation__item" data-index="' + i + '"></div>', { index: i } );
        }

        swipeController.mount( '#swipe-wrap' );

        /**
         * When clicking on navigation we swipe to that index
         */
        for (var i = 0, len = navigation.children.length; i < len; i++) {
            navigation.children[i].addEventListener( 'click', function( evt ) {
                swipeController.slideTo( evt.target.getAttribute( 'data-index' ) );
            } );
        }

    } );

}.bind( this ) );
