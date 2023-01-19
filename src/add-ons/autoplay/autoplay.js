class Autoplay {

    // The namespace to be used when adding event listeners
    namespace = 'autoplay';

    // Reference to the base slider instance
    slider;

    // Stores the current settings of the slider
    settings;

    // Reference to the setTimeout timer
    autoplayTimer;

    // Stopped, paused, running
    autoplayState = 'stopped';

    // Indicates whether the slider is hovered or not
    isHover = false;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {
        autoplay: true,
        autoplayDelay: 5000,
        autoplayDirection: 'normal', // Possible values are 'normal' and 'backwards'.
        autoplayOnHover: 'pause' // Possible values are 'pause', 'stop' or 'none'.
    };

    constructor( slider ) {
        this.slider = slider;
        this.slider.autoplay = this;
        
        this.init();
    }

    init() {
        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
    }

    // Start the autoplay if it's enabled, or stop it if it's disabled but running 
    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        if ( this.settings.autoplay === true && this.autoplayState === 'stopped' ) {
            this.slider.addEventListener( 'gotoSlide.' + this.namespace, () => {
                this.gotoSlideHandler();
            });

            this.slider.addEventListener( 'gotoSlideComplete.' + this.namespace, () => {
                this.gotoSlideCompleteHandler();
            });

            const mouseEnterHandlerReference = () => {
                this.mouseEnterHandler();
            };

            this.eventHandlerReferences[ 'mouseenter' ] = mouseEnterHandlerReference;
            this.slider.sliderEl.addEventListener( 'mouseenter', mouseEnterHandlerReference );

            const mouseLeaveHandlerReference = () => {
                this.mouseLeaveHandler();
            };

            this.eventHandlerReferences[ 'mouseleave' ] = mouseLeaveHandlerReference;
            this.slider.sliderEl.addEventListener( 'mouseleave', mouseLeaveHandlerReference );

            this.autoplayState = 'running';
            this.start();
        } else if ( this.settings.autoplay === true && this.autoplayState === 'running' ) {
            this.slider.removeEventListener( 'gotoSlide.' + this.namespace );
            this.slider.removeEventListener( 'gotoSlideComplete.' + this.namespace );
            this.slider.removeEventListener( 'mouseenter.' + this.namespace );
            this.slider.removeEventListener( 'mouseleave.' + this.namespace );

            this.autoplayState = 'stopped';
            this.stop();
        }
    }

    // Restart the autoplay timer when a new slide is selected
    gotoSlideHandler() {
        // stop previous timers before starting a new one
        if ( this.autoplayState === 'running' ) {
            this.stop();
            this.autoplayState = 'paused';
        }
    }

    gotoSlideCompleteHandler() {
        if ( this.isHover === true && ( this.settings.autoplayOnHover === 'pause' || this.settings.autoplayOnHover === 'stop' ) ) {
            return;
        }

        if ( this.autoplayState === 'paused' ) {
            this.start();
            this.autoplayState = 'running';
        }
    }

    // Pause the autoplay when the slider is hovered
    mouseEnterHandler() {
        this.isHover = true;

        if ( this.autoplayState === 'running' && ( this.settings.autoplayOnHover === 'pause' || this.settings.autoplayOnHover === 'stop' ) ) {
            this.stop();
            this.autoplayState = 'paused';
        }
    }

    // Start the autoplay when the mouse moves away from the slider
    mouseLeaveHandler() {
        this.isHover = false;

        if ( this.settings.autoplay === true && this.autoplayState === 'paused' && this.settings.autoplayOnHover !== 'stop' ) {
            this.start();
            this.autoplayState = 'running';
        }
    }

    // Starts the autoplay
    start() {
        this.autoplayTimer = setTimeout(() => {
            if ( this.settings.autoplayDirection === 'normal' ) {
                this.slider.nextSlide();
            } else if ( this.settings.autoplayDirection === 'backwards' ) {
                this.slider.previousSlide();
            }
        }, this.settings.autoplayDelay );
    }

    // Stops the autoplay
    stop() {
        clearTimeout( this.autoplayTimer );
    }

    // Destroy the module
    destroy() {
        clearTimeout( this.autoplayTimer );

        this.slider.removeEventListener( 'update.' + this.namespace );
        this.slider.removeEventListener( 'gotoSlide.' + this.namespace );
        this.slider.removeEventListener( 'gotoSlideComplete.' + this.namespace );

        this.slider.sliderEl.removeEventListener( 'mouseenter', this.eventHandlerReferences[ 'mouseenter' ] );
        this.slider.sliderEl.removeEventListener( 'mouseleave', this.eventHandlerReferences[ 'mouseleave' ] );
    }
}

export default Autoplay;