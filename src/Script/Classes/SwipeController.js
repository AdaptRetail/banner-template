import Swipe from 'swipejs';
import DOMHandler from './DOMHandler';

export default class SwipeController {

    constructor( options = {} ) {

        this.onSwipeEventListeners = [];

        options.addTo = options.addTo || 'body';
        options.startIndex = options.startIndex || null;
        options.index = 0;

        this.parent = document.querySelector( options.addTo );
        this.frames = [];

        var test = DOMHandler.insertHtml(
            this.parent,
            this.template()
        );

        this.swipeWrap = document.querySelector( '.swipe-wrap' );
    }

    start() {

        this.index = this.startIndex || Math.floor(Math.random() * this.frames.length);

        this.createSwipe();

        /**
         * Stop swiping when clicking on banner
         */
        this.swipeWrap.addEventListener( 'click', function() {
            window.swipe.stop();
        }, false );
    }

    template() {
        return `
            <div id="slider" class="swipe">
                <div class="swipe-wrap">
                </div>
            </div>
        `;
    }

    /**
     * Create swipe
     * 
     * @return void
     */
    createSwipe() {
        window.swipe = new Swipe(document.getElementById('slider'), {
            callback: function(index, element, direction, isInteraction) {

                console.log(index);
                this.index = index;

                this.callOnSwipeEventListeners.call( this, {
                    index,
                    to: this.elementAt( index ),
                    from: this.elementAt( this.itemIndexCarousel( index + direction ) ),
                    isInteraction,
                } );

            }.bind( this ),
            speed: 400,
            auto: 4000,

            draggable: true,

            startSlide: this.index,
        });
    }

    slideTo( index ) {
        window.swipe.slide( index );
    }

    stop() {
        /**
         * To stop the swipe we must get the swipe instance outside of the context
         * Therefor we put it in a setTimeout
         */
        window.setTimeout( function() {
            window.swipe.stop();
        },0 );
    }

    onSwipe( callback ) {
        this.onSwipeEventListeners.push( callback );
    }

    callOnSwipeEventListeners( data ) {
        for (var i = 0, len = this.onSwipeEventListeners.length; i < len; i++) {
            this.onSwipeEventListeners[i].call( this, data );
        }
    }

    /**
     * Calculate the next or previous product index.
     *
     * if below first we get the last product
     * if it is larger than number of products it chooses the first one.
     *
     * @return Integer
     */
    itemIndexCarousel( index ) {
        if (index < 0) {
            return this.frames.length -1;
        }
        else if (index >= this.frames.length) {
            return 0;
        }
        return index;
    };

    /**
     * Add product to swipe
     *
     * @param content
     *
     * @return void
     */
    addElement( content ) {
        this.frames.push( content );
        DOMHandler.insertHtml( this.swipeWrap, content );
    }

    elementAt( i ) {
        return this.swipeWrap.children[
            i
        ];
    }

    currentElement() {
        return this.elementAt( this.index );
    }

}
