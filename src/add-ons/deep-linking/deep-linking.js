class DeepLinking {

    // The namespace to be used when adding event listeners
    namespace = 'deeplinking';

    // Reference to the base slider instance
    slider;

    // Stores the current settings of the slider
    settings;

    // Default add-on settings
    defaults = {

        // Indicates whether the hash will be updated when a new slide is selected
        updateHash: false
    };

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        // Parse the initial hash
        this.slider.addEventListener( 'init.' + this.namespace, () => {
            this.gotoHash( window.location.hash );
        });

        // Update the hash when a new slide is selected
        this.slider.addEventListener( 'gotoSlide.' + this.namespace, ( event ) => {
            if ( this.settings.updateHash === true ) {

                // get the 'id' attribute of the slide
                let slideId = this.slider.sliderEl.getElementsByClassName( 'sp-slide' )[ event.detail.index ].getAttribute( 'id' );

                // if the slide doesn't have an 'id' attribute, use the slide index
                if ( slideId === null ) {
                    slideId = event.detail.index;
                }

                window.location.hash = this.slider.sliderEl.getAttribute( 'id' ) + '/' + slideId;
            }
        });

        const hashChangeHandler = () => {
            this.gotoHash( window.location.hash );
        };

        this.eventHandlerReferences[ 'hashchange' ] = hashChangeHandler;

        // Check when the hash changes and navigate to the indicated slide
        window.addEventListener( 'hashchange', hashChangeHandler );
    }

    // Parse the hash and return the slider id and the slide id
    parseHash( hash ) {
        if ( hash !== '' ) {
            // Eliminate the # symbol
            hash = hash.substring(1);

            // Get the specified slider id and slide id
            const values = hash.split( '/' ),
                slideId = values.pop(),
                sliderId = hash.slice( 0, - slideId.toString().length - 1 );

            if ( this.slider.sliderEl.getAttribute( 'id' ) === sliderId ) {
                return {
                    sliderId,
                    slideId
                };
            }
        }

        return false;
    }

    // Navigate to the appropriate slide, sliderd on the specified hash
    gotoHash( hash ) {
        const parsedHash = this.parseHash( hash );
		
        if ( parsedHash === false ) {
            return;
        }

        const { slideId } = parsedHash;

        const slideIdNumber = parseInt( slideId, 10 );

        // check if the specified slide id is a number or string
        if ( isNaN( slideIdNumber ) ) {
            // get the index of the slide sliderd on the specified id
            const slideEl = document.getElementById( slideId );
            const slideIndex = Array.from( this.slider.sliderEl.getElementsByClassName( 'sp-slide') ).indexOf( slideEl );

            if ( slideIndex !== -1 && slideIndex !== this.slider.selectedSlideIndex ) {
                this.slider.gotoSlide( slideIndex );
            }
        } else if ( slideIdNumber !== this.slider.selectedSlideIndex ) {
            this.slider.gotoSlide( slideIdNumber );
        }
    }

    // Destroy the module
    destroy() {
        this.slider.removeEventListener( 'init.' + this.namespace );
        this.slider.removeEventListener( 'gotoSlide.' + this.namespace );

        const hashChangeHandler = this.eventHandlerReferences[ 'hashchange' ];
        window.removeEventListener( 'hashchange', hashChangeHandler );
    }
}

export default DeepLinking;