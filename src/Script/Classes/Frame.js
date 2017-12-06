import mustache from 'mustache';
import DOMHandler from './DOMHandler';

export default class Frame {

    constructor( data ){
        this.data = this.format( data );
    }

    template() {
        return require( '../../views/product.template.html' );
    }

    format( item ) {

        /**
         * Split the price now to become array with integer and decimal
         * If no decimal is found, we set as 00
         */
        var tmpPrice = item.pricenow.split( /[,\.]/ );

        return {
            name: item.name,
            image: adaptData.asset( item.image ),
            vendorlogo: adaptData.asset( item.vendorlogo ),
            pricematch: item.pricematch === "1",
            threefortwo: item.threefortwo === "1",
            description: item.descriptionshort,
            price: {
                integer: tmpPrice[0],
                decimal: tmpPrice.length >= 2 ? tmpPrice[1] : '00',
            },

            /**
             * Set the url to google analytics if url does not exists
             */
            url: item.url || 'https://google.com' + response.details.ga_url + '&utm_content=' + item.id,
        }

    }

    onClick() {}

    /**
     * Set backgroundImage to every element that has data-background-image attribute
     * This is to lazy load images to save load time for banner.
     */
    onSwipeTo() {
        var backgroundImageElements = this.template.querySelectorAll( '[data-background-image]' )
        for (var i = 0, len = backgroundImageElements.length; i < len; i++) {
            var tmp = backgroundImageElements[i];
            tmp.style.backgroundImage = 'url(' + tmp.getAttribute( 'data-background-image' ) + ')';
        }
    }
    onSwipeFrom() {}

    render() {
        return this.template = DOMHandler.htmlToDOM(
            mustache.render( this.template(), this.data )
        );
    }

}
