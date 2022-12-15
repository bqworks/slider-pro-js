class Keyboard {

    // The namespace to be used when adding event listeners
    namespace = 'keyboards';

    // Reference to the base slider instance
    slider;

    // Stores the current settings of the slider
    settings;

    // Indicates whether the keyboard navigation is enabled
    isEnabled = false;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {

        // Indicates whether keyboard navigation will be enabled
        keyboard: true,

        // Indicates whether the slider will respond to keyboard input only when
        // the slider is in focus.
        keyboardOnlyOnFocus: false
    };

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
    }

    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        if ( this.settings.keyboard === true && this.isEnabled === false ) {
            this.isEnabled = true;
            this.enable();
        }

        if ( this.settings.keyboard === false && this.isEnabled === true ) {
            this.isEnabled = false;
            this.disable();
        }
    }

    enable() {
        let hasFocus = false;

        // Detect when the slide is in focus and when it's not, and, optionally, make it
        // responsive to keyboard input only when it's in focus
        const focusHandler = () => {
            hasFocus = true;
        };

        this.eventHandlerReferences['focus'] = focusHandler;
        this.slider.sliderEl.addEventListener( 'focus', focusHandler );

        const blurHandler = () => {
            hasFocus = false;
        };

        this.eventHandlerReferences['blur'] = blurHandler;
        this.slider.sliderEl.addEventListener( 'blur', blurHandler );

        const keydownHandler = ( event ) => {
            if ( this.settings.keyboardOnlyOnFocus === true && hasFocus === false ) {
                return;
            }

            // If the left arrow key is pressed, go to the previous slide.
            // If the right arrow key is pressed, go to the next slide.
            // If the Enter key is pressed, open the link attached to the main slide image.
            if ( event.which === 37 ) {
                this.slider.previousSlide();
            } else if ( event.which === 39 ) {
                this.slider.nextSlide();
            } else if ( event.which === 13 ) {
                const link = this.slider.sliderEl.getElementsByClassName( 'sp-slide' )[ this.slider.selectedSlideIndex ].querySelector( '.sp-image-container > a' );

                if ( link !== null ) {
                    link.click();
                }
            }
        };

        this.eventHandlerReferences['keydown'] = keydownHandler;
        document.addEventListener( 'keydown', keydownHandler );
    }

    disable() {
        this.slider.sliderEl.removeEventListener( 'focus', this.eventHandlerReferences['focus'] );
        this.slider.sliderEl.removeEventListener( 'blur', this.eventHandlerReferences['blur'] );
        document.removeEventListener( 'keydown', this.eventHandlerReferences['keydown'] );
    }

    // Destroy the module
    destroy() {
        this.slider.removeEventListener( 'update.' + this.namespace );
        this.disable();
    }
}

export default Keyboard;