
/**
 * Import all external resources
 */
import Slide from './Classes/Slide';
import DOMHandler from './Classes/DOMHandler';
import AdaptData from '@adapt-retail/banner-data';
import SwipeController from './Classes/SwipeController';
import SwipeNavigation from './Classes/SwipeNavigation';
import { AdaptEvent, AdaptClickEvent, AdaptGoogleAnalythics } from '@adapt-retail/adapt-event';

// Extend the functionality of the Adapt Event
// to include element.adaptCLick function.
AdaptEvent.addPlugin( new AdaptClickEvent );
AdaptEvent.addPlugin( new AdaptGoogleAnalythics );

/**
 * Import all html templates
 */
import HeadTemplate from '../views/head.template.html';
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
    preview: false, // Should we use preview data from Adapt
} );

// Add container
DOMHandler.insertInBannerContainer( ContainerTemplate );
DOMHandler.insertInHead( HeadTemplate );

/**
 * Create instance of swipe controller
 */
var swipeController = new SwipeController();

/**
 * Create the swipe navigation
 * and connect to the SwipeController
 *
 * @return void
 */
var swipeNavigation = new SwipeNavigation({
    controller: swipeController,
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
        var slides = Object.keys( response.data ).map( function(key) {
            return response.data[key];
        } );
        
        /**
         * Convert array elements to Slide instances
         */
        slides = slides.map( function(item) {
            // Convert each item to a Slide instance
            return new Slide( item );
        } );

        /*
         * Insert all slides to swipe carousel
         */
        swipeController.addSlides( slides );

        /*
         * Mount controller and navigation
         */
        swipeController.mount( '#swipe-wrap' );
        swipeNavigation.mount( '#swipe-navigation' );

        /*
         * Add click event on logo
         */
        document.querySelector('.logo').adaptClickAndNavigate( 'https://adaptretail.com' );


    } );

}.bind( this ) );
