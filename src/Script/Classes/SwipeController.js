import Swipe from 'swipejs';
import DOMHandler from './DOMHandler';

export default class SwipeController {

    constructor( options = {} ) {
        options.startIndex = options.startIndex || null;

        this.navigation = null;

        this.slides = [];
        this.swipe = null;
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
    mount( mountTo = 'body' ) {

        if ( ! ( mountTo instanceof HTMLElement ) ) {
            mountTo = document.querySelector( mountTo );
        }

        DOMHandler.insertHtml(
            mountTo,
            this.template()
        );


        this.swipeWrap = document.querySelector( '.swipe-wrap' );

        for (var i = 0, len = this.slides.length; i < len; i++) {
            this.swipeWrap.appendChild( this.slides[i].render() );
        }

        this.index = this.startIndex || Math.floor(Math.random() * this.slides.length);

        // Fake a trigger to element on the first slide
        this.currentSlide().onSwipeTo();

        this.swipe = new Swipe(document.getElementById('slider'), {
            callback: function(index, element, direction, isInteraction) {

                this.index = index;
                var swipeData = {
                    index,
                    direction: direction < 0 ? 'right' : 'left',
                    to: this.slideAt( index ),
                    from: this.slideAt( this._itemIndexCarousel( index + direction ) ),
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
            return this.slides.length -1;
        }
        else if (index >= this.slides.length) {
            return 0;
        }
        return index;
    };

    /**
     * Slide to a spesific slide
     *
     * @return void
     */
    slideTo( index ) {
        this.swipe.slide( index );
    }

    /**
     * Swipe to next slide
     *
     * @return void
     */
    next() {
        this.swipe.next();
    }

    /**
     * Swipe to previous slide
     *
     * @return void
     */
    prev() {
        this.swipe.prev();
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
            this.swipe.stop();
        },0 );
    }

    /**
     * Add multiple slides at once
     *
     * @param slides
     *
     * @return void
     */
    addSlides( slides = [] ) {
        for (var i = 0, len = slides.length; i < len; i++) {
            this.addSlide( slides[i] );
        }
    }

    /**
     * Add product to swipe
     *
     * @return void
     */
    addSlide( slide ) {
        this.slides.push( slide );
    }

    /**
     * Get current slide
     *
     * @return Slide
     */
    currentSlide() {
        return this.slideAt( this.index );
    }

    /**
     * Get slide at index
     *
     * @return Slide
     */
    slideAt( index ) {
        return this.slides[ index ];
    }

}
