class Caption {

    // The namespace to be used when adding event listeners
    namespace = 'caption';

    // Reference to the base slider instance
    slider;

    // Stores the current settings of the slider
    settings;

    // Reference to the container element that will hold the caption
    containerEl = null;

    // The caption content/text
    content = '';

    // Default add-on settings
    defaults = {

        // Indicates whether or not the captions will be faded
        fadeCaption: true,

        // Sets the duration of the fade animation
        captionFadeDuration: 500
    };

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
        this.slider.addEventListener( 'gotoSlide.' + this.namespace, this.updateContent.bind( this ) );
    }

    // Create the caption container and hide the captions inside the slides
    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        if ( this.slider.sliderEl.getElementsByClassName( 'sp-caption' ).length !== 0 && this.slider.sliderEl.getElementsByClassName( 'sp-caption-container' ).length === 0 ) {
            this.containerEl = document.createElement( 'div' );
            this.containerEl.classList.add( 'sp-caption-container' );
            this.slider.sliderEl.appendChild( this.containerEl );

            // Show the caption for the selected slide
            this.updateContent();
        }

        // Hide the captions inside the slides
        Array.from( this.slider.sliderEl.getElementsByClassName( 'sp-caption' ) ).forEach( ( element ) => {
            element.style.display = 'none';
        });
    }

    // Show the caption content for the selected slide
    updateContent() {
        const newField = this.slider.sliderEl.getElementsByClassName( 'sp-slide' )[ this.slider.selectedSlideIndex ].getElementsByClassName( 'sp-caption' )[0];
        const newContent = ( newField !== undefined ) ? newField.innerHTML : '';

        if ( newContent === '' && this.content === '' ) {
            return;
        }
        
        // Either use a fade effect for swapping the captions or use an instant change
        if ( this.settings.fadeCaption === true ) {
			
            // If the previous slide had a caption, fade out that caption first and when the animation is over
            // fade in the current caption.
            // If the previous slide didn't have a caption, fade in the current caption directly.
            if ( this.content !== '' ) {

                // If the caption container has 0 opacity when the fade out transition starts, set it
                // to 1 because the transition wouldn't work if the initial and final values are the same,
                // and the callback functions wouldn't fire in this case.
                if ( parseInt( this.containerEl.style.opacity ) === 0 ) {
                    this.containerEl.style.transition = '';
                    this.containerEl.style.opacity = '1';
                }

                this.fadeTo( 0, () => {
                    this.content = newContent;

                    if ( newContent !== '' ) {
                        this.containerEl.innerHTML = this.content;
                        this.fadeTo( 1 );
                    } else {
                        this.containerEl.innerHTML = '';
                    }
                });
            } else {
                this.content = newContent;
                this.containerEl.innerHTML = this.content;
                this.containerEl.style.opacity = '0';
                this.fadeTo( 1 );
            }
        } else {
            this.content = newContent;
            this.containerEl.innerHTML = this.content;
        }
    }

    // Fade the caption container to the specified opacity
    fadeTo( opacity, callback ) {

        // There needs to be a delay between the moment the opacity is set
        // and the moment the transitions starts.
        setTimeout(() => {
            this.containerEl.style.opacity = opacity;
            this.containerEl.style.transition =  'opacity ' + this.settings.captionFadeDuration / 1000 + 's';
        }, 1 );

        const transitionEndHandler = ( event ) => {
            if ( event.target !== event.currentTarget ) {
                return;
            }

            this.containerEl.removeEventListener( 'transitionend', transitionEndHandler );
            this.containerEl.style.transition = '';

            if ( typeof callback === 'function' ) {
                callback();
            }
        };

        this.containerEl.addEventListener( 'transitionend', transitionEndHandler );
    }

    // Destroy the module
    destroy() {
        this.slider.removeEventListener( 'update.' + this.namespace );
        this.slider.removeEventListener( 'gotoSlide.' + this.namespace );

        this.containerEl.remove();

        Array.from( this.slider.sliderEl.getElementsByClassName( 'sp-caption' ) ).forEach( ( element ) => {
            element.style.removeProperty( 'display' );
        });
    }
}

export default Caption;