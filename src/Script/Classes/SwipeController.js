import Swipe from 'swipejs';
import DOMHandler from './DOMHandler';

export default class SwipeController {

    constructor( options = {} ) {
        options.startIndex = options.startIndex || null;

        this.navigation = null;

        this.frames = [];
    }

    /**
     * Get the template
     *
     * @return string
     */
    template() {
        return `
            <div id="slider" class="swipe">
                <div class="swipe-wrap"></div>
            </div>
        `;
    }

    /**
     * Create swipe
     * 
     * @return void
     */
    mount( selector = 'body' ) {

        DOMHandler.insertHtml(
            document.querySelector( selector ),
            this.template()
        );

        this.swipeWrap = document.querySelector( '.swipe-wrap' );

        for (var i = 0, len = this.frames.length; i < len; i++) {
            this.swipeWrap.appendChild( this.frames[i].render() );
        }

        this.index = this.startIndex || Math.floor(Math.random() * this.frames.length);

        // Fake a trigger to element on the first frame
        this.currentFrame().onSwipeTo();

        window.swipe = new Swipe(document.getElementById('slider'), {
            callback: function(index, element, direction, isInteraction) {

                this.index = index;
                var swipeData = {
                    index,
                    to: this.frameAt( index ),
                    from: this.frameAt( this._itemIndexCarousel( index + direction ) ),
                    isInteraction,
                };

                swipeData.to.onSwipeTo( swipeData );
                swipeData.from.onSwipeFrom( swipeData );

                if (this.navigation && this.navigation.container) {
                    this.navigation.update();
                }

            }.bind( this ),
            speed: 400,
            auto: 4000,

            draggable: true,

            startSlide: this.index,
        });
    }

    /**
     * Calculate the next or previous product index.
     *
     * if below first we get the last product
     * if it is larger than number of products it chooses the first one.
     *
     * @return Integer
     */
    _itemIndexCarousel( index ) {
        if (index < 0) {
            return this.frames.length -1;
        }
        else if (index >= this.frames.length) {
            return 0;
        }
        return index;
    };

    /**
     * Slide to a spesific frame
     *
     * @return void
     */
    slideTo( index ) {
        window.swipe.slide( index );
    }

    /**
     * Stop the swipe library
     *
     * To stop the swipe we must get the swipe instance outside of the context
     * Therefor we put it in a setTimeout
     *
     * @return void
     */
    stop() {
        window.setTimeout( function() {
            window.swipe.stop();
        },0 );
    }

    /**
     * Add multiple frames at once
     *
     * @param frames
     *
     * @return void
     */
    addFrames( frames = [] ) {
        for (var i = 0, len = frames.length; i < len; i++) {
            this.addFrame( frames[i] );
        }
    }

    /**
     * Add product to swipe
     *
     * @return void
     */
    addFrame( frame ) {
        this.frames.push( frame );
    }

    /**
     * Get current frame
     *
     * @return Frame
     */
    currentFrame() {
        return this.frameAt( this.index );
    }

    /**
     * Get frame at index
     *
     * @return Frame
     */
    frameAt( index ) {
        return this.frames[ index ];
    }

}
