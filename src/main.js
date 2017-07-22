import AdaptData from '@adapt-retail/adapt-api';
console.log(AdaptData);
import mustache from 'mustache';
import Swipe from 'swipejs';

import { TweenLite } from 'gsap';

// include style
// require( './Style/main.scss' );

var debugging = true;
var debug = function( object ) {
    if (debugging) {
        console.log(object);
    }
}

window.adapt_data = {
        data: [
            {
                name: 'Prime hvilestol',
                description: 'Prime fotskammel eik, x-fot alu, fåreskinn charcoal. For dette møbelet er det mulig å velge mellom flere ulike stoffer eller materialer.',
                image: 'assets/images/prime_hvilestol.png',
                price: {
                    now: '15.195',
                    save: '3.800',
                },
                intropris: false,
            },
            {
                name: 'Trondheim høy stol',
                description: 'Velg mellom ulike stoffer eller materialer. Sittehøyde på 56 cm. Krakk følger ikke med. Trondheim krakk 2.895,– (Før 3.495,–)',
                image: 'assets/images/trondheim_large.png',
                price: {
                    now: '9.995',
                    save: '3.000',
                },
                intropris: true,
            },
        ]
    }

// Prepare adapt data
var adaptData = new AdaptData();

var insertHtml = function(element, html) {
    element.insertAdjacentHTML( 'beforeEnd', html );
};

var itemIndexCarousel = function( index ) {
    if (index < 0) {
        return items.length -1;
    }
    else if (index >= items.length) {
        return 0;
    }
    return index;
};

var animateProductIn = function( element ) {
    var image = element ? element.querySelector( '.image' ) : '.image';
    TweenLite.set( '.image', { opacity: 0 } );
    TweenLite.fromTo( image, 3, { 
        opacity: '0',
        rotation: '8deg',
        scale: .7,
    }, { 
        opacity: '1',
        rotation: '-3deg',
        scale: 1,
    } );
}
var animateProductOut = function( element ) {
}

var items = [];
var startItem = 0;

// Prepare views
var productTemplate = require( './views/product.template.html' );
var bannerContainer = document.getElementById( 'adaptBanner' );

// Add Html
insertHtml( document.querySelector( 'head' ), require( './views/head.template.html' ) );
insertHtml( bannerContainer, require( './views/container.template.html' ) );

var swipeWrap = document.querySelector( '.swipe-wrap' );
var slider = document.getElementById('slider');

// Run init when DOM is ready
document.addEventListener( "DOMContentLoaded", function(e) {

    adaptData.start( function( data ) {
        debug(data);
        items = Object.keys( data.data ).map( function(key) {
            return data.data[key];
        } ).map( function(item) {
            return item;
        } );
        debug(items[0]);

        // Innsert all products to swiper
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var content = mustache.render( productTemplate, item );
            insertHtml( swipeWrap, content );
        }

        // TweenLite.set( '.image', { opacity: 0 } );
        // animateProductIn();

        // Init swipe
        window.mySwipe = new Swipe(slider, {
            callback: function(index, element, direction, isInteraction) {
                var to = items[index];
                var from = items[ itemIndexCarousel( index + direction ) ];
                debug( from.name + ' -> ' + to.name );

                var itemid = to.id;

                // animateProductIn( element );

                //This is called on human/touch swipe
                if (isInteraction) {
                    // if (adform) {
                        // dhtml.sendEvent(4, 'Next');
                    // }
                    // event('Next',itemid);
                    window.mySwipe.stop(); // This does not work. (Something wrong with SwipeJs?)
                }
            },
            transitionEnd: function(index, element) {
                animateProductOut( element );
            },
            speed: 400,
            draggable: true,
            auto: 4000,

            autoRestart: true,

            startSlide: startItem
        });

    } );

} );
