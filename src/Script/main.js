
/**
 * Import all external resources
 */
import AdaptData from '@adapt-retail/banner-data';
import DOMHandler from './Classes/DOMHandler';
import mustache from 'mustache';
import Swipe from 'swipejs';

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
 * Calculate the next or previous product index.
 *
 * if below first we get the last product
 * if it is larger than number of products it chooses the first one.
 *
 * @return Integer
 */
var itemIndexCarousel = function( index ) {
    if (index < 0) {
        return items.length -1;
    }
    else if (index >= items.length) {
        return 0;
    }
    return index;
};

var items = [];
var startItem = 0;

// Add container
DOMHandler.insertInBannerContainer( ContainerTemplate );
DOMHandler.insertInHead( HeadTemplate );

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

            console.log(item);

            return item;
        } );

        // Find element to add all the swipe information in to
        var swipeWrap = document.querySelector( '.swipe-wrap' );

        // Insert all products to swipe carousel
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];

            // Render template
            var content = mustache.render( ProductTemplate, item );
            DOMHandler.insertHtml( swipeWrap, content );
        }

        // Init swipe
        window.mySwipe = new Swipe(document.getElementById('slider'), {
            callback: function(index, element, direction, isInteraction) {
                var to = items[index];
                var from = items[ itemIndexCarousel( index + direction ) ];
                console.log( from.name + ' -> ' + to.name );

                var itemid = to.id;


                //This is called on human/touch swipe
                if (isInteraction) {
                    console.log( 'is interaction' );
                    // if (adform) {
                        // dhtml.sendEvent(4, 'Next');
                    // }
                    // event('Next',itemid);
                    window.mySwipe.stop(); // This does not work. (Something wrong with SwipeJs?)
                }
            },
            speed: 400,
            draggable: true,
            auto: 4000,

            autoRestart: true,

            startSlide: startItem
        });


    } );

} );
