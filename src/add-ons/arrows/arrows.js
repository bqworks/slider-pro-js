class Arrows {

    // The namespace to be used when adding event listeners
    namespace = 'arrows';

    // Reference to the base slider instance
    slider;

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
        arrows: false,

        // Indicates whether the arrows will fade in only on hover
        fadeArrows: true
    };

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
        this.slider.addEventListener( 'gotoSlide.' + this.namespace, this.checkVisibility.bind( this ) );
    }

    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        // Create the arrows if the 'arrows' option is set to true
        if ( this.settings.arrows === true && this.arrowsEl === null ) {
            this.createArrows();

            this.checkVisibility();
        } else if ( this.settings.arrows === false && this.arrowsEl !== null ) {
            this.removeArrows();
        }

        if ( this.settings.arrows === true ) {
            if ( this.settings.fadeArrows === true ) {
                this.arrowsEl.classList.add( 'sp-fade-arrows' );
            } else if ( this.settings.fadeArrows === false ) {
                this.arrowsEl.classList.remove( 'sp-fade-arrows' );
            }
        }
    }

    // Show or hide the arrows depending on the position of the selected slide
    checkVisibility() {
        if ( this.settings.arrows === false || this.settings.loop === true ) {
            return;
        }

        if ( this.slider.selectedSlideIndex === 0 ) {
            this.previousArrowEl.style.display = 'none';
        } else {
            this.previousArrowEl.style.display = 'block';
        }

        if ( this.slider.selectedSlideIndex === this.slider.getTotalSlides() - 1 ) {
            this.nextArrowEl.style.display = 'none';
        } else {
            this.nextArrowEl.style.display = 'block';
        }
    }

    createArrows() {
        this.arrowsEl = document.createElement( 'div' );
        this.arrowsEl.classList.add( 'sp-arrows' );
        this.slider.slidesContainerEl.appendChild( this.arrowsEl );

        this.previousArrowEl = document.createElement( 'div' );
        this.previousArrowEl.classList.add( 'sp-arrow', 'sp-previous-arrow' );
        this.arrowsEl.appendChild( this.previousArrowEl );

        this.nextArrowEl = document.createElement( 'div' );
        this.nextArrowEl.classList.add( 'sp-arrow', 'sp-next-arrow' );
        this.arrowsEl.appendChild( this.nextArrowEl );

        const previousArrowClickHandler = () => {
            this.slider.previousSlide();
        };

        const nextArrowClickHandler = () => {
            this.slider.nextSlide();
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

    destroy() {
        this.removeArrows();
        this.slider.removeEventListener( 'update.' + this.namespace );
        this.slider.removeEventListener( 'gotoSlide.' + this.namespace );
    }
}

export default Arrows;