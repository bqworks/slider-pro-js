class ThumbnailArrows {

    // The namespace to be used when adding event listeners
    namespace = 'thumbnailarrows';

    // Reference to the base slider instance
    slider;

    // Reference to the Thumbnails instance created by the slider
    thumbnails;

    // Stores the current settings of the slider
    settings;

    // Reference to the arrows container
    arrowsEl = null;

    // Reference to the previous arrow
    previousArrowEl = null;

    // Reference to the next arrow
    nextArrowEl = null;

    // Default add-on settings
    defaults = {
        // Indicates whether the arrow buttons will be created
        thumbnailArrows: false,

        // Indicates whether the arrows will fade in only on hover
        fadeThumbnailArrows: true
    };

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    constructor( slider ) {
        this.slider = slider;
        this.thumbnails = this.slider.thumbnails;

        this.init();
    }

    init() {
        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );

        // Check if the arrows need to be visible or invisible when the thumbnail scroller
        // resizes and when the thumbnail scroller moves.
        this.slider.addEventListener( 'resize.' + this.namespace, () => {
            if ( this.thumbnails.isThumbnailScroller === true && this.settings.thumbnailArrows === true ) {
                this.checkVisibility();
            }
        });

        this.thumbnails.addEventListener( 'thumbnailsMoveComplete.' + this.namespace, () => {
            if ( this.thumbnails.isThumbnailScroller === true && this.settings.thumbnailArrows === true ) {
                this.checkVisibility();
            }
        });
    }

	
    // Called when the slider is updated
    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };
		
        if ( this.thumbnails.isThumbnailScroller === false ) {
            return;
        }

        // Create or remove the thumbnail scroller arrows
        if ( this.settings.thumbnailArrows === true && this.arrowsEl === null ) {
            this.createArrows();
        } else if ( this.settings.thumbnailArrows === false && this.arrowsEl !== null ) {
            this.removeArrows();
        }

        // Add fading functionality and check if the arrows need to be visible or not
        if ( this.settings.thumbnailArrows === true ) {
            if ( this.settings.fadeThumbnailArrows === true ) {
                this.arrowsEl.classList.add( 'sp-fade-thumbnail-thumbnail-arrows' );
            } else if ( this.settings.fadeThumbnailArrows === false ) {
                this.arrowsEl.classList.remove( 'sp-fade-thumbnail-thumbnail-arrows' );
            }

            this.checkVisibility();
        }
    }

    createArrows() {
        this.arrowsEl = document.createElement( 'div' );
        this.arrowsEl.classList.add( 'sp-thumbnail-arrows' );
        this.thumbnails.thumbnailsContainerEl.appendChild( this.arrowsEl );

        this.previousArrowEl = document.createElement( 'div' );
        this.previousArrowEl.classList.add( 'sp-thumbnail-arrow', 'sp-previous-thumbnail-arrow' );
        this.arrowsEl.appendChild( this.previousArrowEl );

        this.nextArrowEl = document.createElement( 'div' );
        this.nextArrowEl.classList.add( 'sp-thumbnail-arrow', 'sp-next-thumbnail-arrow' );
        this.arrowsEl.appendChild( this.nextArrowEl );

        const previousArrowClickHandler = () => {
            const previousPosition = Math.min( 0, this.thumbnails.thumbnailsPosition + this.thumbnails.thumbnailsContainerSize );
            this.thumbnails.moveTo( previousPosition );
        };

        const nextArrowClickHandler = () => {
            const nextPosition = Math.max( this.thumbnails.thumbnailsContainerSize - this.thumbnails.thumbnailsSize, this.thumbnails.thumbnailsPosition - this.thumbnails.thumbnailsContainerSize );
            this.thumbnails.moveTo( nextPosition );
        };

        this.eventHandlerReferences[ 'click.previousArrow' ] = previousArrowClickHandler;
        this.previousArrowEl.addEventListener( 'click', previousArrowClickHandler );

        this.eventHandlerReferences[ 'click.nextArrow' ] = nextArrowClickHandler;
        this.nextArrowEl.addEventListener( 'click', nextArrowClickHandler);
    }
	
    removeArrows() {
        const previousArrowClickHandler = this.eventHandlerReferences[ 'click.previousArrow' ];
        const nextArrowClickHandler = this.eventHandlerReferences[ 'click.nextArrow' ];

        this.previousArrowEl.removeEventListener( 'click', previousArrowClickHandler );
        this.nextArrowEl.removeEventListener( 'click', nextArrowClickHandler );
        this.arrowsEl.remove();
        this.arrowsEl = null;
    }

    // Checks if the 'next' or 'previous' arrows need to be visible or hidden,
    // based on the position of the thumbnail scroller
    checkVisibility() {
        if ( this.thumbnails.thumbnailsPosition === 0 ) {
            this.previousArrowEl.style.display = 'none';
        } else {
            this.previousArrowEl.style.display = 'block';
        }

        if ( this.thumbnails.thumbnailsPosition === this.thumbnails.thumbnailsContainerSize - this.thumbnails.thumbnailsSize ) {
            this.nextArrowEl.style.display = 'none';
        } else {
            this.nextArrowEl.style.display = 'block';
        }
    }

    // Destroy the module
    destroy() {
        this.removeArrows();
        this.slider.removeEventListener( 'update.' + this.namespace );
        this.slider.removeEventListener( 'resize.' + this.namespace );
        this.thumbnails.removeEventListener( 'thumbnailsMoveComplete.' + this.namespace );
    }
}

export default ThumbnailArrows;