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
    mount( mountTo = '#swipe-navigation' ) {

        this.container = mountTo instanceof HTMLElement
            ? mountTo
            : document.querySelector( mountTo );

        for (var i = 0, len = this.controller.frames.length; i < len; i++) {

            /**
             * Add the navigation item
             * the the navigation
             */
            DOMHandler.insertHtml(
                this.container,
                mustache.render( this.navigationItem, { index: i } )
            );

            /**
             * When clicking on navigation
             * we swipe to that index
             */
            this.container.children[i].addEventListener( 'click', function( evt ) {
                this.controller.slideTo( evt.target.getAttribute( 'data-index' ) );
            }.bind( this ) );
        }

        // Update once when setting the navigation
        this.update();

    }

    /**
     * Update the .is-active on all elements
     *
     * @return void
     */
    update() {
        for (var i = 0, len = this.container.children.length; i < len; i++) {
            this.container.children[ i ].classList.remove( 'is-active' );
        }
        this.container.children[ this.controller.index ].classList.add( 'is-active' );
    }


}
