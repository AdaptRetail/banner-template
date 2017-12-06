
/**
 * Import all external resources
 */
import AdaptData from '@adapt-retail/banner-data';
import DOMHandler from './Classes/DOMHandler';
import SwipeController from './Classes/SwipeController';
import mustache from 'mustache';

/**
 * Import all html templates
 */
import HeadTemplate from '../views/head.template.html';
import ContainerTemplate from '../views/container.template.html';
import ProductTemplate from '../views/product.template.html';

/**
 * Prepare Adapt data
 * If local development we connect to the API
 * If not we are using the data adapt provides for us
 */
var adaptData = new AdaptData( {
    account: 'priceco58c12436f20b4',
    project: 1,
    campaign: 1,
    production: 1,
} );

/**
 * Set backgroundImage to every element that has data-background-image attribute
 * This is to lazy load images to save load time for banner.
 */
var lazyLoadBackgroundImages = function( element ) {
    var backgroundImageElements = element.querySelectorAll( '[data-background-image]' )
    for (var i = 0, len = backgroundImageElements.length; i < len; i++) {
        var tmp = backgroundImageElements[i];
        tmp.style.backgroundImage = 'url(' + tmp.getAttribute( 'data-background-image' ) + ')';
    }
}

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

    lazyLoadBackgroundImages( swipeController.currentElement() );
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

            /**
            * Format the Adapt data to fit this templates needs
            */
        } ).map( function(item) {
            item.image = adaptData.asset( item.image );
            item.vendorlogo = adaptData.asset( item.vendorlogo );
            item.pricematch = item.pricematch === "1";
            item.threefortwo = item.threefortwo === "1";
            item.description = item.descriptionshort;

            /**
             * Split the price now to become array with integer and decimal
             * If no decimal is found, we set as 00
             */
            var tmpPrice = item.pricenow.split( /[,\.]/ );
            item.price = {
                integer: tmpPrice[0],
                decimal: tmpPrice.length >= 2 ? tmpPrice[1] : '00',
            }

            /**
             * Set the url to google analytics if url does not exists
             */
            item.url = item.url || 'https://google.com' + response.details.ga_url + '&utm_content=' + item.id;

            return item;
        } );

        // Find element to add all the swipe information in to
        var navigation = document.querySelector( '.navigation' );


        // Insert all products to swipe carousel
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];

            // Render template
            swipeController.addElement(
                mustache.render( ProductTemplate, item )
            );

            // Add dot to navigation
            DOMHandler.insertHtml( navigation, '<div class="navigation__item" data-index="' + i + '"></div>', { index: i } );
        }

        swipeController.onSwipe( function( options ) {
            prepareSwipeElementToShow();

            if (options.isInteraction) {
                swipeController.stop();
            }
        } );

        swipeController.start();


        /**
         * Prepare first showin element
         */
        prepareSwipeElementToShow();

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
