class Fade {

    // The namespace to be used when adding event listeners
    namespace = 'fade';

    // Reference to the base slider instance
    slider;

    // Stores the current settings of the slider
    settings;

    // Reference to the original 'gotoSlide' method
    fadeGotoSlideReference = null;

    // Default add-on settings
    defaults = {

        // Indicates if fade will be used
        fade: false,

        // Indicates if the previous slide will be faded out (in addition to the next slide being faded in)
        fadeOutPreviousSlide: true,

        // Sets the duration of the fade effect
        fadeDuration: 500
    };

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
    }

    // If fade is enabled, store a reference to the original 'gotoSlide' method
    // and then assign a new function to 'gotoSlide'.
    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        if ( this.settings.fade === true ) {
            this.fadeGotoSlideReference = this.slider.gotoSlide.bind( this.slider );
            this.slider.gotoSlide = this.fadeToSlide.bind( this );
        }
    }

    // Will replace the original 'gotoSlide' function by adding a cross-fade effect
    // between the previous and the next slide.
    fadeToSlide( index ) {
        if ( index === this.slider.selectedSlideIndex ) {
            return;
        }
		
        // If the slides are being swiped/dragged, don't use fade, but call the original method instead.
        // If not, which means that a new slide was selected through a button, arrows or direct call, then
        // use fade.
        if ( this.slider.sliderEl.classList.contains( 'sp-swiping' ) ) {
            this.fadeGotoSlideReference( index );
        } else {
            let nextSlideEl,
                previousSlideEl,
                newIndex = index;

            // Loop through all the slides and overlap the previous and next slide,
            // and hide the other slides.
            this.slider.slides.forEach( ( slide ) => {
                const slideIndex = slide.index,
                    slideEl = slide.slideEl;

                if ( slideIndex === newIndex ) {
                    slideEl.style.opacity = 0;
                    slideEl.style.left = 0;
                    slideEl.style.top = 0;
                    slideEl.style.zIndex = 20;
                    slideEl.style.visibility = 'visible';
                    nextSlideEl = slideEl;
                } else if ( slideIndex === this.slider.selectedSlideIndex ) {
                    slideEl.style.opacity = 1;
                    slideEl.style.left = 0;
                    slideEl.style.top = 0;
                    slideEl.style.zIndex = 10;
                    slideEl.style.visibility = 'visible';
                    previousSlideEl = slideEl;
                } else {
                    slideEl.style.opacity = 1;
                    slideEl.style.visibility = 'hidden';
                    slideEl.style.removeProperty( 'z-index' );
                }
            });

            // Set the new indexes for the previous and selected slides
            this.slider.previousSlideIndex = this.slider.selectedSlideIndex;
            this.slider.selectedSlideIndex = index;

            // Re-assign the 'sp-selected' class to the currently selected slide
            this.slider.slidesEl.getElementsByClassName( 'sp-selected' )[0].classList.remove( 'sp-selected' );
            this.slider.slidesEl.getElementsByClassName( 'sp-slide' )[ this.slider.selectedSlideIndex ].classList.add( 'sp-selected' );
		
            // Rearrange the slides if the slider is loop-able
            if ( this.settings.loop === true ) {
                this.slider.updateSlidesOrder();
            }

            // Move the slides container so that the cross-fading slides (which now have the top and left
            // position set to 0) become visible.
            this.slider.moveTo( 0, true );

            // Fade in the selected slide
            this.setSlideOpacityTo( nextSlideEl, 1, () => {

                // This flag will indicate if all the fade transitions are complete,
                // in case there are multiple running at the same time, which happens
                // when the slides are navigated very quickly
                let allTransitionsComplete = true;

                // Go through all the slides and check if there is at least one slide 
                // that is still transitioning.
                this.slider.slides.forEach( ( slide ) => {
                    if ( slide.slideEl.getAttribute( 'data-transitioning' ) !== null ) {
                        allTransitionsComplete = false;
                    }
                });

                if ( allTransitionsComplete === true ) {

                    // After all the transitions are complete, make all the slides visible again
                    this.slider.slides.forEach( ( slide ) => {
                        const slideEl = slide.slideEl;
                        slideEl.style.removeProperty( 'visibility' );
                        slideEl.style.removeProperty( 'opacity' );
                        slideEl.style.removeProperty( 'z-index' );
                    });
					
                    // Reset the position of the slides and slides container
                    this.slider.resetSlidesPosition();
                }

                // Fire the 'gotoSlideComplete' event
                this.slider.dispatchEvent( 'gotoSlideComplete', {
                    index: index,
                    previousIndex: this.slider.previousSlideIndex
                });
            });

            // Fade out the previous slide, if indicated, in addition to fading in the next slide
            if ( this.settings.fadeOutPreviousSlide === true ) {
                this.setSlideOpacityTo( previousSlideEl, 0 );
            }

            if ( this.settings.autoHeight === true ) {
                this.slider.resizeHeight();
            }

            // Fire the 'gotoSlide' event
            this.slider.dispatchEvent( 'gotoSlide', {
                index: index,
                previousIndex: this.slider.previousSlideIndex
            });
        }
    }

    // Fade the target slide to the specified opacity (0 or 1)
    setSlideOpacityTo( target, opacity, callback ) {
		
        // apply the attribute only to slides that fade in
        if ( opacity === 1 ) {
            target.setAttribute( 'data-transitioning', true );
        }

        // There needs to be a delay between the moment the opacity is set
        // and the moment the transitions starts.
        setTimeout( () => {
            target.style.opacity = opacity;
            target.style.transition = 'opacity ' + this.settings.fadeDuration / 1000 + 's';
        }, 100 );

        const transitionEndHandler = ( event ) => {
            if ( event.target !== event.currentTarget ) {
                return;
            }
			
            target.removeEventListener( 'transitionend', transitionEndHandler );
            target.removeAttribute( 'data-transitioning');
            target.style.removeProperty( 'transition' );

            if ( typeof callback === 'function' ) {
                callback();
            }
        };

        target.addEventListener( 'transitionend', transitionEndHandler );
    }

    // Destroy the module
    destroy() {
        this.slider.removeEventListener( 'update.' + this.namespace );

        if ( this.fadeGotoSlideReference !== null ) {
            this.slider.gotoSlide = this.fadeGotoSlideReference;
        }
    }
}

export default Fade;