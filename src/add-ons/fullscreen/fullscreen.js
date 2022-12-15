class Fullscreen {

    // The namespace to be used when adding event listeners
    namespace = 'fullscreen';

    // Reference to the base slider instance
    slider;

    // Stores the current settings of the slider
    settings;

    // Indicates whether the slider is currently in fullscreen mode
    isFullscreen = false;

    // Reference to the fullscreen button
    fullscreenButtonEl = null;

    // Reference to a set of settings that influence the slider's size
    // before it goes fullscreen
    sizeBeforeFullscreen = {};

    // Default add-on settings
    defaults = {

        // Indicates whether the fullscreen button is enabled
        fullscreen: false,

        // Indicates whether the button will fade in only on hover
        fadeFullscreen: true
    };

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        if ( document.fullscreenEnabled === false ) {
            return;
        }
	
        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
    }

    // Create or remove the fullscreen button depending on the value of the 'fullscreen' option
    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };
		
        if ( this.settings.fullscreen === true && this.fullscreenButtonEl === null ) {
            this.add();
        } else if ( this.settings.fullscreen === false && this.fullscreenButtonEl !== null ) {
            this.remove();
        }

        if ( this.settings.fullscreen === true ) {
            if ( this.settings.fadeFullscreen === true ) {
                this.fullscreenButtonEl.classList.add( 'sp-fade-fullscreen' );
            } else if ( this.settings.fadeFullscreen === false ) {
                this.fullscreenButtonEl.classList.remove( 'sp-fade-fullscreen' );
            }
        }
    }

    // Create the fullscreen button
    add() {
        this.fullscreenButtonEl = document.createElement('div');
        this.fullscreenButtonEl.classList.add( 'sp-fullscreen-button' );
        this.slider.sliderEl.appendChild( this.fullscreenButtonEl );
		
        const fullscreenButtonClickHandlerReference = () => {
            this.fullscreenButtonClickHandler();
        };

        this.eventHandlerReferences['click.fullscreenButton'] = fullscreenButtonClickHandlerReference;

        this.fullscreenButtonEl.addEventListener( 'click', fullscreenButtonClickHandlerReference );

        const fullscreenChangeHandlerReference = () => {
            this.fullscreenChangeHandler();
        };

        this.eventHandlerReferences['fullscreenchange'] = fullscreenChangeHandlerReference;

        document.addEventListener( 'fullscreenchange', fullscreenChangeHandlerReference );
    }

    // Remove the fullscreen button
    remove() {
        if ( this.fullscreenButtonEl !== null ) {
            const fullscreenButtonClickHandlerReference = this.eventHandlerReferences['click.fullscreenButton'];
            this.fullscreenButtonEl.removeEventListener( 'click', fullscreenButtonClickHandlerReference );
            this.fullscreenButtonEl.remove();
            this.fullscreenButtonEl = null;

            const fullscreenChangeHandlerReference = this.eventHandlerReferences['fullscreenchange'];
            document.removeEventListener( 'fullscreenchange', fullscreenChangeHandlerReference );
        }
    }

    // When the fullscreen button is clicked, put the slider into fullscreen mode, and
    // take it out of the fullscreen mode when it's clicked again.
    fullscreenButtonClickHandler() {
        if ( this.isFullscreen === false ) {
            this.slider.sliderEl.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // This will be called whenever the fullscreen mode changes.
    // If the slider is in fullscreen mode, set it to 'full window', and if it's
    // not in fullscreen mode anymore, set it back to the original size.
    fullscreenChangeHandler() {
        this.isFullscreen = document.fullscreenElement ? true : false;

        if ( this.isFullscreen === true ) {
            this.sizeBeforeFullscreen = {
                forceSize: this.settings.forceSize,
                autoHeight: this.settings.autoHeight
            };
            this.slider.sliderEl.classList.add( 'sp-fullscreen' );
            this.slider.settings.forceSize = 'fullWindow';
            this.slider.settings.autoHeight = false;
        } else {
            this.slider.sliderEl.style.margin = '';
            this.slider.sliderEl.classList.remove( 'sp-fullscreen' );
            this.slider.settings.forceSize = this.sizeBeforeFullscreen.forceSize;
            this.slider.settings.autoHeight = this.sizeBeforeFullscreen.autoHeight;
        }

        this.slider.resize();
    }

    // Destroy the module
    destroy() {
        this.slider.removeEventListener( 'update.' + this.namespace );
        this.remove();
    }
}

export default Fullscreen;