import DOMHandler from './DOMHandler';
import mustache from 'mustache';

export default class SwipeNavigation {

    constructor( options = {} ) {
        this.options = options;
        this.controller = options.controller || null;
        this.controller.navigation = this;
        this.navigationItem = options.navigationItem || '<div class="navigation__item" data-index="{{ index }}"></div>';
    }

    /**
     * Add the Navigation to an element
     *
     * @return void
     */
    mount( selector = '#swipe-navigation' ) {

        this.container = document.querySelector( selector );

        for (var i = 0, len = this.controller.frames.length; i < len; i++) {
            DOMHandler.insertHtml(
                this.container,
                mustache.render( this.navigationItem, { index: i } )
            );
        }

        this.update();

    }

    update() {
        for (var i = 0, len = this.container.children.length; i < len; i++) {
            this.container.children[ i ].classList.remove( 'is-active' );
        }
        this.container.children[ this.controller.index ].classList.add( 'is-active' );
    }

        /**
         * When clicking on navigation we swipe to that index
         */
        // for (var i = 0, len = navigation.children.length; i < len; i++) {
            // navigation.children[i].addEventListener( 'click', function( evt ) {
                // swipeController.slideTo( evt.target.getAttribute( 'data-index' ) );
            // } );
        // }

}
