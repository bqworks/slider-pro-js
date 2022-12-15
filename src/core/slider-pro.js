import defaults from './slider-pro-defaults.js';
import { resolveUnit } from '../helpers/util.js';
import SliderProSlide from './slider-pro-slide.js';
import CustomEventTarget from '../helpers/custom-event-target.js';
import WindowResizeHandler from '../helpers/window-resize-handler.js';
import AddOnsManager from '../add-ons/add-ons-manager.js';

class SliderPro extends CustomEventTarget {

    // The namespace to be used when adding event listeners
    namespace = 'sliderpro';

    // Holds the final settings of the slider after merging the specified
    // ones with the default ones.
    settings = {};

    // Selector for the main element of the slider
    selector;

    // Reference to the slider element
    sliderEl;

    // Reference to the slides element
    slidesEl;

    // Reference to the mask element
    slidesMaskEl;

    // Reference to the slides element
    slidesContainerEl;

    // Indicates the position of the slides container
    slidesPosition = 0;

    // Array of SliderProSlide objects, ordered by their DOM index
    slides = [];

    // Array of SliderProSlide objects, ordered by their left/top position in the slider.
    // This will be updated continuously if the slider is loopable.
    slidesOrder = [];

    // The index of the currently selected slide (starts with 0)
    selectedSlideIndex = 0;

    // The index of the previously selected slide
    previousSlideIndex = 0;

    // The width of the individual slide
    slideWidth = 0;

    // The height of the individual slide
    slideHeight = 0;

    // Reference to the old slide width, used to check if the width has changed
    previousSlideWidth = 0;

    // Reference to the old slide height, used to check if the height has changed
    previousSlideHeight = 0;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Reference to the WindowResizeHandler instance
    windowResizeHandler;

    // Reference to the AddOnsManager instance
    addOnsManager;

    constructor( selector, options = null ) {
        super();

        this.selector = selector;

        this.settings = options !== null ? { ...defaults, ...options } : { ...defaults };

        this.addOnsManager = new AddOnsManager( this, this.settings.addOns );
        this.addOnsManager.init();

        this.init();
    }

    // The starting place for the slider
    init() {
        this.dispatchEvent( 'beforeInit' );

        this.sliderEl = document.querySelector( this.selector );

        // Remove the 'sp-no-js' when the slider's JavaScript code starts running
        this.sliderEl.classList.remove( 'sp-no-js' );

        // Set up the slides containers
        // slider-pro > sp-slides-container > sp-mask > sp-slides > sp-slide
        this.slidesContainerEl = document.createElement( 'div' );
        this.slidesContainerEl.classList.add( 'sp-slides-container' );
        this.sliderEl.appendChild( this.slidesContainerEl );

        this.slidesMaskEl = document.createElement( 'div' );
        this.slidesMaskEl.classList.add( 'sp-mask' );
        this.slidesContainerEl.appendChild( this.slidesMaskEl );

        this.slidesEl = this.sliderEl.getElementsByClassName( 'sp-slides' )[0];
        this.slidesMaskEl.appendChild( this.slidesEl );

        // Set which slide should be selected initially
        this.selectedSlideIndex = this.settings.startSlide;

        // Shuffle/randomize the slides
        if ( this.settings.shuffle === true ) {
            const slides = Array.from( this.slidesEl.getElementsByClassName( 'sp-slide' ) );
            const shuffledSlides = [ ...slides ];

            for ( let k = shuffledSlides.length - 1; k > 0; k-- ) {
                let l = Math.floor( Math.random() * ( k + 1 ) );
                let temp = shuffledSlides[ k ];

                shuffledSlides[ k ] = shuffledSlides[ l ];
                shuffledSlides[ l ] = temp;
            }

            this.slidesEl.replaceChildren( ...shuffledSlides );
        }
        
        this.windowResizeHandler = new WindowResizeHandler();
        this.windowResizeHandler.addEventListener( 'resize', () => {
            this.resize();
        });

        this.update();

        // add the 'sp-selected' class to the initially selected slide
        this.slidesEl.getElementsByClassName( 'sp-slide' )[ this.selectedSlideIndex ].classList.add( 'sp-selected' );
        
        this.dispatchEvent( 'init' );
    }

    // Update the slider by checking for setting changes and for slides
    // that weren't initialized yet.
    update() {
        this.dispatchEvent( 'beforeUpdate' );

        // Check the current slider orientation and reset CSS that might have been
        // added for a different orientation, since the orientation can be changed
        // at runtime.
        if ( this.settings.orientation === 'horizontal' ) {
            this.sliderEl.classList.remove( 'sp-vertical' );
            this.sliderEl.classList.add( 'sp-horizontal' );
            this.sliderEl.style.removeProperty( 'height');
            this.sliderEl.style.removeProperty( 'max-height' );

            Array.from( this.slidesEl.getElementsByClassName( 'sp-slide' ) ).forEach( ( slideEl ) => {
                slideEl.style.removeProperty( 'top' );
            });
        } else if ( this.settings.orientation === 'vertical' ) {
            this.sliderEl.classList.remove( 'sp-horizontal' );
            this.sliderEl.classList.add( 'sp-vertical' );

            Array.from( this.slidesEl.getElementsByClassName( 'sp-slide' ) ).forEach( ( slideEl ) => {
                slideEl.style.removeProperty( 'left' );
            });
        }

        if ( this.settings.rightToLeft === true ) {
            this.sliderEl.classList.add( 'sp-rtl' );
        } else {
            this.sliderEl.classList.remove( 'sp-rtl' );
        }

        // Loop through the array of SliderProSlide objects and if a stored slide is found
        // which is not in the DOM anymore, destroy that slide.
        [ ...this.slides ].forEach( ( slide, index ) => {
            if ( this.sliderEl.querySelector( `.sp-slide[data-index="${index}"]` ) === null ) {
                slide.removeEventListener( 'imagesLoaded' );
                slide.destroy();
                
                const indexOfSlide = this.slides.findIndex( slide => slide.index === index );
                this.slides.splice( indexOfSlide, 1 );
            }
        });

        this.slidesOrder.length = 0;

        // Loop through the list of slides and initialize newly added slides if any,
        // and reset the index of each slide.
        Array.from( this.sliderEl.getElementsByClassName( 'sp-slide' ) ).forEach( ( slideEl, index ) => {
            if ( slideEl.hasAttribute( 'data-init' ) === false ) {
                const slide = this.createSlide( slideEl );
                this.slides.splice( index, 0, slide );
            }
            
            this.slides[ index ].index = index;
            this.slidesOrder.push( index );
        });

        // Arrange the slides in a loop
        if ( this.settings.loop === true ) {
            this.updateSlidesOrder();
        }

        // Reset the previous slide width
        this.previousSlideWidth = 0;

        this.dispatchEvent( 'update' );

        // Some updates might require a resize
        this.resize();
    }

    // Called when the slider needs to resize
    resize() {
        this.dispatchEvent( 'beforeResize' );
        
        // Set the width of the main slider container based on whether or not the slider is responsive,
        // full width or full size
        if ( this.settings.responsive === true ) {
            if ( ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) &&
                ( this.settings.visibleSize === 'auto' || this.settings.visibleSize !== 'auto' && this.settings.orientation === 'vertical' )
            ) {
                this.sliderEl.style.margin = '0';
                this.sliderEl.style.width = resolveUnit( window.innerWidth );
                this.sliderEl.style.maxWidth = '';
                this.sliderEl.style.marginLeft = - resolveUnit( this.sliderEl.offsetLeft );
            } else {
                this.sliderEl.style.width = '100%';
                this.sliderEl.style.maxWidth = resolveUnit( this.settings.width );
                this.sliderEl.style.marginLeft = '';
            }
        } else {
            this.sliderEl.style.width = resolveUnit( this.settings.width );
        }

        // Calculate the aspect ratio of the slider
        if ( this.settings.aspectRatio === -1 ) {
            this.settings.aspectRatio = this.settings.width / this.settings.height;
        }

        // Initially set the slide width to the size of the slider.
        // Later, this will be set to less if there are multiple visible slides.
        const possiblePadding = parseInt( window.getComputedStyle( this.sliderEl ).paddingLeft, 10 ) + parseInt( window.getComputedStyle( this.sliderEl ).paddingRight, 10 );
        this.slideWidth = this.sliderEl.clientWidth - possiblePadding;

        // Set the height to the same size as the browser window if the slider is set to be 'fullWindow',
        // or calculate the height based on the width and the aspect ratio.
        if ( this.settings.forceSize === 'fullWindow' ) {
            this.slideHeight = window.innerHeight;
        } else {
            this.slideHeight = isNaN( this.settings.aspectRatio ) ? this.settings.height : this.slideWidth / this.settings.aspectRatio;
        }

        // Resize the slider only if the size of the slider has changed
        // If it hasn't, return.
        if ( this.previousSlideWidth !== this.slideWidth ||
            this.previousSlideHeight !== this.slideHeight ||
            this.settings.visibleSize !== 'auto' ||
            this.sliderEl.offsetWidth > this.sliderEl.parentElement.clientWidth ||
            this.sliderEl.clientWidth !== this.slidesMaskEl.clientWidth
        ) {
            this.previousSlideWidth = this.slideWidth;
            this.previousSlideHeight = this.slideHeight;
        } else {
            return;
        }

        this.resizeSlides();

        // Set the initial size of the mask container to the size of an individual slide
        this.slidesMaskEl.style.width = resolveUnit( this.slideWidth );
        this.slidesMaskEl.style.height = resolveUnit( this.slideHeight );

        // Adjust the height if it's set to 'auto'
        if ( this.settings.autoHeight === true ) {

            // Delay the resizing of the height to allow for other resize handlers
            // to execute first before calculating the final height of the slide
            setTimeout( () => {
                this.resizeHeight();
            }, 1 );
        } else {
            this.slidesMaskEl.style.removeProperty( 'transition' );
        }

        // The 'visibleSize' option can be set to fixed or percentage size to make more slides
        // visible at a time.
        // By default it's set to 'auto'.
        if ( this.settings.visibleSize !== 'auto' ) {
            if ( this.settings.orientation === 'horizontal' ) {

                // If the size is forced to full width or full window, the 'visibleSize' option will be
                // ignored and the slider will become as wide as the browser window.
                if ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) {
                    this.sliderEl.style.removeProperty( 'margin' );
                    this.sliderEl.style.removeProperty( 'max-width' );
                    this.sliderEl.style.width = resolveUnit( window.innerWidth );
                    this.sliderEl.style.marginLeft = - this.sliderEl.offsetLeft;
                } else {
                    this.sliderEl.style.width = resolveUnit( this.settings.visibleSize );
                    this.sliderEl.style.maxWidth = '100%';
                    this.sliderEl.style.marginLeft = 0;
                }
                
                this.slidesMaskEl.style.width = resolveUnit( this.sliderEl.clientWidth );
            } else {

                // If the size is forced to full window, the 'visibleSize' option will be
                // ignored and the slider will become as high as the browser window.
                if ( this.settings.forceSize === 'fullWindow' ) {
                    this.sliderEl.style.height = resolveUnit( window.innerHeight );
                    this.sliderEl.style.removeProperty( 'max-height' );
                } else {
                    this.sliderEl.style.height = resolveUnit( this.settings.visibleSize );
                    this.sliderEl.style.maxHeight = '100%';
                }

                this.slidesMaskEl.style.height = resolveUnit( this.sliderEl.clientHeight );
            }
        }

        this.resetSlidesPosition();

        // Fire the 'sliderResize' event
        this.dispatchEvent( 'resize' );
    }

    // Resize each individual slide
    resizeSlides() {
        let slideWidth = this.slideWidth,
            slideHeight = this.slideHeight;

        if ( this.settings.autoSlideSize === true ) {
            if ( this.settings.orientation === 'horizontal' ) {
                slideWidth = 'auto';
            } else if ( this.settings.orientation === 'vertical' ) {
                slideHeight = 'auto';
            }
        } else if ( this.settings.autoHeight === true ) {
            slideHeight = 'auto';
        }

        // Loop through the existing slides and reset their size.
        this.slides.forEach( ( slide ) => {
            slide.settings = this.settings;
            slide.setSize( slideWidth, slideHeight );
        });
    }

    // Create a SliderProSlide instance for the slide passed as a jQuery element
    createSlide( element ) {
        const slide = new SliderProSlide( element, this.settings );

        slide.addEventListener( 'imagesLoaded', ( event ) => {
            if ( this.settings.autoSlideSize === true ) {
                if ( this.slidesEl.classList.contains( 'sp-animated' ) === false ) {
                    this.resetSlidesPosition();
                }
            }

            if ( this.settings.autoHeight === true && event.detail.index === this.selectedSlideIndex ) {
                this.resizeHeightTo( slide.getSize().height );
            }
        });

        return slide;
    }

    // Arrange the slide elements in a loop inside the 'slidesOrder' array
    updateSlidesOrder() {
        let	slicedItems;

        // Calculate the position/index of the middle slide
        const middleSlidePosition = parseInt( ( this.slidesOrder.length - 1 ) / 2, 10 );

        // Calculate the distance between the selected element and the middle position
        const distance = this.slidesOrder.findIndex( slideIndex => slideIndex === this.selectedSlideIndex ) - middleSlidePosition;
        
        // If the distance is negative it means that the selected slider is before the middle position, so
        // slides from the end of the array will be added at the beginning, in order to shift the selected slide
        // forward.
        // If the distance is positive, slides from the beginning of the array will be added at the end.
        if ( distance < 0 ) {
            slicedItems = this.slidesOrder.splice( distance, Math.abs( distance ) );

            for ( let i = slicedItems.length - 1; i >= 0; i-- ) {
                this.slidesOrder.unshift( slicedItems[ i ] );
            }
        } else if ( distance > 0 ) {
            slicedItems = this.slidesOrder.splice( 0, distance );

            for ( let i = 0; i <= slicedItems.length - 1; i++ ) {
                this.slidesOrder.push( slicedItems[ i ] );
            }
        }
    }

    // Set the left/top position of the slides based on their position in the 'slidesOrder' array
    updateSlidesPosition() {
        const selectedSlide = this.slidesEl.getElementsByClassName( 'sp-slide' )[ this.selectedSlideIndex ];
        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';
        const sizeProperty = this.settings.orientation === 'horizontal' ? 'width' : 'height';
        const selectedSlidePixelPosition = parseInt( selectedSlide.style[ positionProperty ], 10 );
        
        // Calculate the position/index of the middle slide
        const middleSlidePosition = parseInt( ( this.slidesOrder.length - 1 ) / 2, 10 );
        
        let slide,
            slideEl,
            slideIndex,
            previousPosition = selectedSlidePixelPosition,
            newPosition,
            directionMultiplier,
            slideSize;
        
        if ( this.settings.autoSlideSize === true ) {
            if ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ) {
                for ( slideIndex = middleSlidePosition; slideIndex >= 0; slideIndex-- ) {
                    slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
                    slideEl = slide.slideEl;
                    newPosition = previousPosition;
                    slideEl.style[ positionProperty ] = resolveUnit( newPosition );
                    previousPosition = parseInt( slideEl.style[ positionProperty ], 10 ) + slide.getSize()[ sizeProperty ] + this.settings.slideDistance;
                }

                previousPosition = selectedSlidePixelPosition;

                for ( slideIndex = middleSlidePosition + 1; slideIndex < this.slidesOrder.length; slideIndex++ ) {
                    slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
                    slideEl = slide.slideEl;
                    newPosition = previousPosition - ( slide.getSize()[ sizeProperty ] + this.settings.slideDistance );
                    slideEl.style[ positionProperty ] = resolveUnit( newPosition );
                    previousPosition = parseInt( slideEl.style[ positionProperty ], 10 );
                }
            } else {
                for ( slideIndex = middleSlidePosition - 1; slideIndex >= 0; slideIndex-- ) {
                    slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
                    slideEl = slide.slideEl;
                    newPosition = previousPosition - ( slide.getSize()[ sizeProperty ] + this.settings.slideDistance );
                    slideEl.style[ positionProperty ] = resolveUnit( newPosition );
                    previousPosition = parseInt( slideEl.style[ positionProperty ], 10 );
                }

                previousPosition = selectedSlidePixelPosition;

                for ( slideIndex = middleSlidePosition; slideIndex < this.slidesOrder.length; slideIndex++ ) {
                    slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
                    slideEl = slide.slideEl;
                    newPosition = previousPosition;
                    slideEl.style[ positionProperty ] = resolveUnit( newPosition );
                    previousPosition = parseInt( slideEl.style[ positionProperty ], 10 ) + slide.getSize()[ sizeProperty ] + this.settings.slideDistance;
                }
            }
        } else {
            directionMultiplier = ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ) ? -1 : 1;
            slideSize = ( this.settings.orientation === 'horizontal' ) ? this.slideWidth : this.slideHeight;

            for ( slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
                slideEl = this.slidesEl.getElementsByClassName( 'sp-slide' )[ this.slidesOrder[ slideIndex ] ];
                newPosition = selectedSlidePixelPosition + directionMultiplier * ( slideIndex - middleSlidePosition ) * ( slideSize + this.settings.slideDistance );
                slideEl.style[ positionProperty ] = resolveUnit( newPosition );
            }
        }
    }

    // Set the left/top position of the slides based on their position in the 'slidesOrder' array,
    // and also set the position of the slides container.
    resetSlidesPosition() {
        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';
        const sizeProperty = this.settings.orientation === 'horizontal' ? 'width' : 'height';

        let previousPosition = 0,
            newPosition,
            slide,
            slideEl,
            slideIndex,
            selectedSlideSize,
            directionMultiplier,
            slideSize;

        if ( this.settings.autoSlideSize === true ) {
            if ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ) {
                for ( slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
                    slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
                    slideEl = slide.slideEl;
                    newPosition = previousPosition - ( slide.getSize()[ sizeProperty ] + this.settings.slideDistance );
                    slideEl.style[ positionProperty ] = resolveUnit( newPosition );
                    previousPosition = parseInt( slideEl.style[ positionProperty ], 10 );
                }
            } else {
                for ( slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
                    slide = this.getSlideAt( this.slidesOrder[ slideIndex ] );
                    slideEl = slide.slideEl;
                    newPosition = previousPosition;
                    slideEl.style[ positionProperty] = resolveUnit( previousPosition );
                    previousPosition = parseInt( slideEl.style[ positionProperty ], 10 ) + slide.getSize()[ sizeProperty ] + this.settings.slideDistance;
                }
            }

            selectedSlideSize = this.getSlideAt( this.selectedSlideIndex ).getSize()[ sizeProperty ];
        } else {
            directionMultiplier = ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ) === true ? -1 : 1;
            slideSize = ( this.settings.orientation === 'horizontal' ) ? this.slideWidth : this.slideHeight;

            for ( slideIndex = 0; slideIndex < this.slidesOrder.length; slideIndex++ ) {
                slideEl = this.slidesEl.getElementsByClassName( 'sp-slide' )[ this.slidesOrder[ slideIndex ] ];
                newPosition = directionMultiplier * slideIndex * ( slideSize + this.settings.slideDistance );
                slideEl.style[ positionProperty ] = resolveUnit( newPosition );
            }

            selectedSlideSize = slideSize;
        }

        let selectedSlideOffset = this.settings.centerSelectedSlide === true && this.settings.visibleSize !== 'auto' ? Math.round( ( parseInt( this.slidesMaskEl.style[ sizeProperty ], 10 ) - selectedSlideSize ) / 2 ) : 0,
            newSlidesPosition = - parseInt( this.slidesEl.getElementsByClassName( 'sp-slide' )[ this.selectedSlideIndex ].style[ positionProperty ], 10 ) + selectedSlideOffset;
        
        this.moveTo( newSlidesPosition, true );
    }

    // Resize the height of the slider to the height of the selected slide.
    // It's used when the 'autoHeight' option is set to 'true'.
    resizeHeight() {
        const selectedSlide = this.getSlideAt( this.selectedSlideIndex );

        this.resizeHeightTo( selectedSlide.getSize().height );
    }

    // Get the current position of the slides by parsing the 'transform' property
    getSlidesPosition() {
        let left = 0;
        let top = 0;

        if ( this.slidesEl.style.transform !== '' ) {
            const matrixString = window.getComputedStyle(this.slidesEl).transform,
                matrixType = matrixString.indexOf( 'matrix3d' ) !== -1 ? 'matrix3d' : 'matrix',
                matrixArray = matrixString.replace( matrixType, '' ).match( /-?[0-9.]+/g );
            
            left = matrixType === 'matrix3d' ? parseInt( matrixArray[ 12 ], 10 ) : parseInt( matrixArray[ 4 ], 10 );
            top = matrixType === 'matrix3d' ? parseInt( matrixArray[ 13 ], 10 ) : parseInt( matrixArray[ 5 ], 10 );
        }

        return {
            left,
            top
        };
    }

    // Move the slides container to the specified position.
    // The movement can be instant or animated.
    moveTo( position, instant, callback ) {
        if ( position === this.slidesPosition ) {
            return;
        }

        this.slidesPosition = position;
        
        if ( typeof instant !== 'undefined' && instant === true ) {
            this.slidesEl.style.transition = '';
        } else {
            this.slidesEl.classList.add( 'sp-animated' );

            const transitionEventHandler = ( event ) => {
                if ( event.target !== event.currentTarget ) {
                    return;
                }

                this.slidesEl.removeEventListener( 'transitionend', transitionEventHandler );
                this.slidesEl.classList.remove( 'sp-animated' );
                
                if ( typeof callback === 'function' ) {
                    callback();
                }
            };

            this.slidesEl.addEventListener( 'transitionend', transitionEventHandler );
            this.eventHandlerReferences[ 'slidesEl.' + 'transitionend' ] = transitionEventHandler;

            this.slidesEl.style.transition = 'transform ' + this.settings.slideAnimationDuration / 1000 + 's';
        }

        const newLeft = this.settings.orientation === 'horizontal' ? position : 0;
        const newTop = this.settings.orientation === 'horizontal' ? 0 : position;

        this.slidesEl.style.transform = 'translate3d(' + newLeft + 'px, ' + newTop + 'px, 0)';
    }

    // Stop the movement of the slides
    stopMovement() {
        const { left, top } = this.getSlidesPosition();
        
        this.slidesPosition = this.settings.orientation === 'horizontal' ? left : top;
            
        // Set the transform property to the value that the transform had when the function was called
        this.slidesEl.style.transform = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
        this.slidesEl.style.removeProperty( 'transition' );

        this.slidesEl.removeEventListener( 'transitionend', this.eventHandlerReferences[ 'slidesEl.' + 'transitionend' ] );
        this.slidesEl.classList.remove( 'sp-animated' );
    }

    // Resize the height of the slider to the specified value
    resizeHeightTo( height ) {
        const transitionEventHandler = ( event ) => {
            if ( event.target !== event.currentTarget ) {
                return;
            }

            this.slidesMaskEl.removeEventListener( 'transitionend', transitionEventHandler );

            // Fire the 'resizeHeightComplete' event
            this.dispatchEvent( 'resizeHeightComplete' );
        };
        
        this.slidesMaskEl.removeEventListener( 'transitionend', this.eventHandlerReferences[ 'slidesMaskEl.' + 'transitionend' ] );
        this.slidesMaskEl.addEventListener( 'transitionend', transitionEventHandler );
        this.eventHandlerReferences[ 'slidesMaskEl.' + 'transitionend' ] = transitionEventHandler;

        this.slidesMaskEl.style.height = resolveUnit( height );
        this.slidesMaskEl.style.transition = 'height ' + this.settings.heightAnimationDuration / 1000 + 's';
    }

    // Open the slide at the specified index
    gotoSlide( index ) {
        if ( index === this.selectedSlideIndex || typeof this.slides[ index ] === 'undefined' ) {
            return;
        }

        this.previousSlideIndex = this.selectedSlideIndex;
        this.selectedSlideIndex = index;

        // Re-assign the 'sp-selected' class to the currently selected slide
        this.slidesEl.getElementsByClassName( 'sp-selected' )[0].classList.remove( 'sp-selected' );
        this.slidesEl.getElementsByClassName( 'sp-slide' )[ this.selectedSlideIndex ].classList.add( 'sp-selected' );

        // If the slider is loopable reorder the slides to have the selected slide in the middle
        // and update the slides' position.
        if ( this.settings.loop === true ) {
            this.updateSlidesOrder();
            this.updateSlidesPosition();
        }

        // Adjust the height of the slider
        if ( this.settings.autoHeight === true ) {
            this.resizeHeight();
        }

        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';
        const sizeProperty = this.settings.orientation === 'horizontal' ? 'width' : 'height';
        const selectedSlideOffset = this.settings.centerSelectedSlide === true && this.settings.visibleSize !== 'auto' ? Math.round( ( parseInt( this.slidesMaskEl.style[ sizeProperty ], 10 ) - this.getSlideAt( this.selectedSlideIndex ).getSize()[ sizeProperty ] ) / 2 ) : 0;
        const newSlidesPosition = - parseInt( this.slidesEl.getElementsByClassName( 'sp-slide' )[ this.selectedSlideIndex ].style[ positionProperty ], 10 ) + selectedSlideOffset;

        // Move the slides container to the new position
        this.moveTo( newSlidesPosition, false, () => {
            this.resetSlidesPosition();

            // Fire the 'gotoSlideComplete' event
            this.dispatchEvent( 'gotoSlideComplete', {
                index: index,
                previousIndex: this.previousSlideIndex
            });
        });

        // Fire the 'gotoSlide' event
        this.dispatchEvent( 'gotoSlide', {
            index: index,
            previousIndex: this.previousSlideIndex
        });
    }

    // Open the next slide
    nextSlide() {
        const index = ( this.selectedSlideIndex >= this.getTotalSlides() - 1 ) ? 0 : ( this.selectedSlideIndex + 1 );
        this.gotoSlide( index );
    }

    // Open the previous slide
    previousSlide() {
        const index = this.selectedSlideIndex <= 0 ? ( this.getTotalSlides() - 1 ) : ( this.selectedSlideIndex - 1 );
        this.gotoSlide( index );
    }

    // Return the slide at the specified index
    getSlideAt( index ) {
        return this.slides[ index ];
    }

    // Return the index of the currently opened slide
    getSelectedSlide() {
        return this.selectedSlideIndex;
    }

    // Return the total amount of slides
    getTotalSlides() {
        return this.slides.length;
    }

    // Destroy the slider instance
    destroy() {
        this.addOnsManager.destroyAll();

        // Clean the CSS
        this.sliderEl.removeAttribute( 'style' );
        this.sliderEl.setAttribute( 'class', 'slider-pro sp-no-js' );

        this.slidesEl.removeAttribute( 'style' );
        this.slidesEl.setAttribute( 'class', 'sp-slides' );

        // Remove event listeners
        this.removeEventListener( 'update' );
        this.windowResizeHandler.removeEventListener( 'resize' );
        this.windowResizeHandler.destroy();

        // Destroy all slides
        this.slides.forEach( ( slide ) => {
            slide.destroy();
        });

        this.slides.length = 0;

        // Move the slides to their initial position in the DOM and 
        // remove the container elements created dynamically.
        this.sliderEl.insertBefore( this.slidesEl, this.sliderEl.firstChild );
        this.slidesContainerEl.remove();
    }
}

export default SliderPro;