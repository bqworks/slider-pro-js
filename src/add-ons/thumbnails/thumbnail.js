import CustomEventTarget from '../../helpers/custom-event-target.js';
import { checkImagesComplete, resolveUnit } from '../../helpers/util.js';

class Thumbnail extends CustomEventTarget {

    // Indicates the index of the thumbnail
    index;

    // Reference to the thumbnail jQuery element
    thumbnailEl = null;

    // Reference to the thumbnail scroller
    thumbnailsEl = null;

    // Reference to the thumbnail's container, which will be 
    // created dynamically.
    thumbnailContainerEl = null;

    // The width and height of the thumbnail
    width = 0;
    height = 0;

    // Indicates whether the thumbnail's image is loaded
    isImageLoaded = false;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    constructor ( thumbnailEl, thumbnailsEl, index ) {
        super();

        // Reference to the thumbnail jQuery element
        this.thumbnailEl = thumbnailEl;

        // Reference to the thumbnail scroller
        this.thumbnailsEl = thumbnailsEl;

        // Set the index of the slide
        this.setIndex( index );

        // Initialize the thumbnail
        this.init();
    }

    init() {
        // Mark the thumbnail as initialized
        this.thumbnailEl.setAttribute( 'data-init', true );

        // Create a container for the thumbnail and add the original thumbnail to this container.
        // Having a container will help crop the thumbnail image if it's too large.
        this.thumbnailContainerEl = document.createElement( 'div' );
        this.thumbnailContainerEl.classList.add( 'sp-thumbnail-container' );
        this.thumbnailsEl.appendChild( this.thumbnailContainerEl );

        if ( this.thumbnailEl.parentElement.tagName === 'A' ) {
            this.thumbnailContainerEl.appendChild( this.thumbnailEl.parentElement );
        } else {
            this.thumbnailContainerEl.appendChild( this.thumbnailEl );
        }

        const thumbnailContainerClickHandler = () => {
            this.dispatchEvent( 'thumbnailClick', { index: this.index } );
        };

        // When the thumbnail container is clicked, fire an event
        this.thumbnailContainerEl.addEventListener( 'click', thumbnailContainerClickHandler );

        this.eventHandlerReferences[ 'thumbnailContainerClick' ] = thumbnailContainerClickHandler;
    }

    // Set the width and height of the thumbnail
    setSize( width, height ) {
        this.width = width;
        this.height = height;

        // Apply the width and height to the thumbnail's container
        this.thumbnailContainerEl.style.width = resolveUnit( this.width );
        this.thumbnailContainerEl.style.height = resolveUnit( this.height );

        // If there is an image, resize it to fit the thumbnail container
        if ( this.thumbnailEl.tagName === 'IMG' && this.thumbnailEl.getAttribute( 'data-src' ) === null ) {
            this.resizeImage();
        }
    }

    // Return the width and height of the thumbnail
    getSize() {
        return {
            width: this.thumbnailContainerEl.offsetWidth + parseInt( window.getComputedStyle( this.thumbnailContainerEl ).marginLeft, 10 ) + parseInt( window.getComputedStyle( this.thumbnailContainerEl ).marginRight, 10 ),
            height: this.thumbnailContainerEl.offsetHeight + parseInt( window.getComputedStyle( this.thumbnailContainerEl ).marginTop, 10 ) + parseInt( window.getComputedStyle( this.thumbnailContainerEl ).marginBottom, 10 )
        };
    }

    // Return the top, bottom, left and right position of the thumbnail
    getPosition() {
        return {
            left: this.thumbnailContainerEl.offsetLeft + parseInt( window.getComputedStyle( this.thumbnailContainerEl ).marginLeft, 10 ),
            right: this.thumbnailContainerEl.offsetLeft + parseInt( window.getComputedStyle( this.thumbnailContainerEl ).marginLeft, 10 ) + this.thumbnailContainerEl.offsetWidth,
            top: this.thumbnailContainerEl.offsetTop + parseInt( window.getComputedStyle( this.thumbnailContainerEl ).marginTop, 10 ),
            bottom: this.thumbnailContainerEl.offsetTop + parseInt( window.getComputedStyle( this.thumbnailContainerEl ).marginTop, 10 ) + this.thumbnailContainerEl.offsetHeight
        };
    }

    // Set the index of the thumbnail
    setIndex( index ) {
        this.index = index;
        this.thumbnailEl.setAttribute( 'data-index', this.index );
    }

    // Resize the thumbnail's image
    resizeImage() {
        // If the image is not loaded yet, load it
        if ( this.isImageLoaded === false ) {
            checkImagesComplete( this.thumbnailContainerEl , () => {
                this.isImageLoaded = true;
                this.resizeImage();
            });

            return;
        }

        // Get the reference to the thumbnail image again because it was replaced by
        // another img element during the loading process
        this.thumbnailEl = this.thumbnailContainerEl.getElementsByClassName( 'sp-thumbnail' )[0];

        // Calculate whether the image should stretch horizontally or vertically
        let imageWidth = this.thumbnailEl.clientWidth,
            imageHeight = this.thumbnailEl.clientHeight;

        if ( imageWidth / imageHeight <= this.width / this.height ) {
            this.thumbnailEl.style.width = '100%';
            this.thumbnailEl.style.height = 'auto';
        } else {
            this.thumbnailEl.style.width = 'auto';
            this.thumbnailEl.style.height = '100%';
        }

        this.thumbnailEl.style.marginLeft = resolveUnit( ( this.thumbnailContainerEl.clientWidth - this.thumbnailEl.clientWidth ) * 0.5 ); 
        this.thumbnailEl.style.marginTop = resolveUnit( ( this.thumbnailContainerEl.clientHeight - this.thumbnailEl.clientHeight ) * 0.5 );
    }

    // Destroy the thumbnail
    destroy() {
        this.thumbnailContainerEl.removeEventListener( 'click', this.eventHandlerReferences );

        // Remove added attributes
        this.thumbnailEl.removeAttribute( 'data-init' );
        this.thumbnailEl.removeAttribute( 'data-index' );

        // Remove the thumbnail's container and add the thumbnail
        // back to the thumbnail scroller container
        if ( this.thumbnailEl.parentElement.tagName === 'A' ) {
            this.thumbnailsEl.insertBefore( this.thumbnailEl.parentElement, this.thumbnailContainerEl );
        } else {
            this.thumbnailsEl.insertBefore( this.thumbnailEl, this.thumbnailContainerEl );
        }
		
        this.thumbnailContainerEl.remove();
    }
}

export default Thumbnail;