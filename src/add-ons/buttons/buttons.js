class Buttons {

    // The namespace to be used when adding event listeners
    namespace = 'buttons';

    // Reference to the base slider instance
    slider;

    // Stores the current settings of the slider
    settings;

    // Reference to the buttons container
    buttonsEl = null;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {
		
        // Indicates whether the buttons will be created
        buttons: true
    };

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );

        // Select the corresponding button when the slide changes
        this.slider.addEventListener( 'gotoSlide.' + this.namespace, ( event ) => {
            if ( typeof this.buttonsEl === 'undefined' ) {
                return;
            }

            this.buttonsEl.getElementsByClassName( 'sp-selected-button' )[0].classList.remove( 'sp-selected-button' );
            this.buttonsEl.getElementsByClassName( 'sp-button' )[ event.detail.index ].classList.add( 'sp-selected-button' );
        });
    }

    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        this.buttonsEl = this.slider.sliderEl.getElementsByClassName( 'sp-buttons' )[0];

        const totalSlides = this.slider.getTotalSlides();

        // If there is more that one slide but the buttons weren't created yet, create the buttons.
        // If the buttons were created but their number differs from the total number of slides, re-create the buttons.
        // If the buttons were created but there are less than one slide, remove the buttons.s
        if ( this.settings.buttons === true && totalSlides > 1 && typeof this.buttonsEl === 'undefined' ) {
            this.createButtons();
        } else if ( this.settings.buttons === true && typeof this.buttonsEl !== 'undefined' && totalSlides !== this.buttonsEl.getElementsByClassName( 'sp-button' ).length ) {
            this.adjustButtons();
        } else if ( ( this.settings.buttons === false && typeof this.buttonsEl !== 'undefined' ) || ( totalSlides <= 1 && typeof this.buttonsEl !== 'undefined' ) ) {
            this.removeButtons();
        }
    }

    // Create the buttons
    createButtons() {
        // Create the buttons' container
        this.buttonsEl = document.createElement( 'div' );
        this.buttonsEl.classList.add( 'sp-buttons' );
        this.slider.sliderEl.appendChild( this.buttonsEl );

        // Create the buttons
        for ( let i = 0; i < this.slider.getTotalSlides(); i++ ) {
            const buttonEl = document.createElement( 'div' );
            buttonEl.classList.add( 'sp-button' );
            this.buttonsEl.appendChild( buttonEl );

            if ( i === this.slider.selectedSlideIndex ) {
                buttonEl.classList.add( 'sp-selected-button' );
            }

            const buttonClickHandler = () => {
                this.slider.gotoSlide( i );
            };

            this.eventHandlerReferences[ 'click.button' + i ] = buttonClickHandler;

            buttonEl.addEventListener( 'click', buttonClickHandler );
        }

        // Indicate that the slider has buttons 
        this.slider.sliderEl.classList.add( 'sp-has-buttons' );
    }

    // Re-create the buttons. This is calles when the number of slides changes.
    adjustButtons() {
        this.removeButtons();
        this.createButtons();
    }

    // Remove the buttons
    removeButtons() {
        Array.from( this.buttonsEl.getElementsByClassName( 'sp-button' ) ).forEach( ( buttonEl, index ) => {
            const buttonClickHandler = this.eventHandlerReferences[ 'click.button' + index ];
			
            buttonEl.removeEventListener( 'click', buttonClickHandler );
        });
		
        this.buttonsEl.remove();
        this.slider.sliderEl.classList.remove( 'sp-has-buttons' );
    }

    destroy() {
        this.slider.removeEventListener( 'gotoSlide.' + this.namespace );
        this.slider.removeEventListener( 'update.' + this.namespace );
        this.removeButtons();
    }
}

export default Buttons;