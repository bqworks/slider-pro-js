import CustomEventTarget from '../../helpers/custom-event-target.js';
import { resolveUnit } from '../../helpers/util.js';
import Thumbnail from './thumbnail.js';

class Thumbnails extends CustomEventTarget {

    // The namespace to be used when adding event listeners
    namespace = 'thumbnails';

    // Reference to the base slider instance
    slider;

    // Stores the current settings of the slider
    settings;

    // Reference to the thumbnail scroller 
    thumbnailsEl = null;

    // Reference to the container of the thumbnail scroller
    thumbnailsContainerEl = null;

    // List of Thumbnail objects
    thumbnails = null;

    // Index of the selected thumbnail
    selectedThumbnailIndex = 0;

    // Total size (width or height, depending on the orientation) of the thumbnails
    thumbnailsSize = 0;

    // Size of the thumbnail's container
    thumbnailsContainerSize = 0;

    // The position of the thumbnail scroller inside its container
    thumbnailsPosition = 0;

    // Orientation of the thumbnails
    thumbnailsOrientation = null;

    // Indicates the 'left' or 'top' position based on the orientation of the thumbnails
    thumbnailsPositionProperty = null;

    // Indicates if there are thumbnails in the slider
    isThumbnailScroller = false;

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {

        // Sets the width of the thumbnail
        thumbnailWidth: 100,

        // Sets the height of the thumbnail
        thumbnailHeight: 80,

        // Sets the position of the thumbnail scroller (top, bottom, right, left)
        thumbnailsPosition: 'bottom',

        // Indicates if a pointer will be displayed for the selected thumbnail
        thumbnailPointer: false
    };

    constructor ( slider ) {
        super();

        this.slider = slider;
        this.slider.thumbnails = this;

        this.init();
    }

    init() {
        this.thumbnails = [];

        this.slider.addEventListener( 'beforeInit.' + this.namespace, () => {
            Array.from( document.querySelector( this.slider.selector ).getElementsByClassName( 'sp-slide' ) ).forEach( ( slideEl, index ) => {
                slideEl.setAttribute( 'data-original-index', index );
            });
        });

        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
        this.slider.addEventListener( 'resize.' + this.namespace, this.resizeHandler.bind( this ) );
        this.slider.addEventListener( 'gotoSlide.' + this.namespace, ( event ) => {
            this.gotoThumbnail( event.detail.index );
        });
    }

    // Called when the slider is updated
    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        if ( this.slider.sliderEl.getElementsByClassName( 'sp-thumbnail' ).length === 0 && this.thumbnails.length === 0 ) {
            this.isThumbnailScroller = false;
            return;
        }

        this.isThumbnailScroller = true;

        // Create the container of the thumbnail scroller, if it wasn't created yet
        if ( this.thumbnailsContainerEl === null ) {
            this.thumbnailsContainerEl = document.createElement( 'div' );
            this.thumbnailsContainerEl.classList.add( 'sp-thumbnails-container' );
            this.slider.slidesContainerEl.after( this.thumbnailsContainerEl );
        }

        // If the thumbnails' main container doesn't exist, create it, and get a reference to it
        if ( this.thumbnailsEl === null ) {
            if ( this.slider.sliderEl.getElementsByClassName( 'sp-thumbnails' ).length !== 0 ) {
                this.thumbnailsEl = this.slider.sliderEl.getElementsByClassName( 'sp-thumbnails' )[0];
                this.thumbnailsContainerEl.appendChild( this.thumbnailsEl );

                // Shuffle/randomize the thumbnails
                if ( this.settings.shuffle === true ) {
                    let thumbnails = Array.from( this.thumbnailsEl.getElementsByClassName( 'sp-thumbnail' ) ),
                        shuffledThumbnails = [];

                    // Reposition the thumbnails based on the order of the indexes in the
                    // 'shuffledIndexes' array from the slider
                    Array.from( this.slider.sliderEl.getElementsByClassName( 'sp-slide' ) ).forEach( ( slideEl ) => {
                        let thumbnailEl = thumbnails[ parseInt( slideEl.getAttribute( 'data-original-index' ), 10 ) ];

                        if ( thumbnailEl.parentElement.tagName === 'A' ) {
                            thumbnailEl = thumbnailEl.parentElement;
                        }

                        shuffledThumbnails.push( thumbnailEl );
                    });
					
                    // Append the sorted thumbnails to the thumbnail scroller
                    this.thumbnailsEl.replaceChildren( ...shuffledThumbnails ) ;
                }
            } else {
                this.thumbnailsEl = document.createElement( 'div' );
                this.thumbnailsEl.classList.add( 'sp-thumbnails' );
                this.thumbnailsContainerEl.appendChild( this.thumbnailsEl );
            }
        }

        // Check if there are thumbnails inside the slides and move them in the thumbnails container
        Array.from( this.slider.slidesEl.getElementsByClassName( 'sp-thumbnail' ) ).forEach( function( thumbnailEl, index ) {
            const lastThumbnailIndex = this.thumbnailsEl.getElementsByClassName( 'sp-thumbnail' ).length - 1;

            if ( thumbnailEl.parentElement.tagName === 'A' ) {
                thumbnailEl = thumbnailEl.parentElement;
            }

            // If the index of the slide that contains the thumbnail is greater than the total number
            // of thumbnails from the thumbnails container, position the thumbnail at the end.
            // Otherwise, add the thumbnails at the corresponding position.
            if ( index > lastThumbnailIndex ) {
                this.thumbnailsEl.appendChild( thumbnailEl );
            } else {
                this.thumbnailsEl.insertBefore( thumbnailEl, this.thumbnailsEl.getElementsByClassName( 'sp-thumbnail' )[ index ] );
            }
        });

        // Loop through the Thumbnail objects and if a corresponding element is not found in the DOM,
        // it means that the thumbnail might have been removed. In this case, destroy that Thumbnail instance.
        for ( let i = this.thumbnails.length - 1; i >= 0; i-- ) {
            if ( this.thumbnailsEl.querySelector( '.sp-thumbnail[data-index="' + i + '"]' ) === null ) {
                const thumbnail = this.thumbnails[ i ];

                thumbnail.destroy();
                this.thumbnails.splice( i, 1 );
            }
        }

        // Loop through the thumbnails and if there is any uninitialized thumbnail,
        // initialize it, else update the thumbnail's index.
        Array.from( this.thumbnailsEl.getElementsByClassName( 'sp-thumbnail' ) ).forEach( ( thumbnailEl, index ) => {
            if ( thumbnailEl.getAttribute( 'data-init' ) === null ) {
                this._createThumbnail( thumbnailEl, index );
            } else {
                this.thumbnails[ index ].setIndex( index );
            }
        });

        // Remove the previous class that corresponds to the position of the thumbnail scroller
        this.thumbnailsContainerEl.classList.remove( 'sp-top-thumbnails', 'sp-bottom-thumbnails', 'sp-left-thumbnails', 'sp-right-thumbnails' );

        // Check the position of the thumbnail scroller and assign it the appropriate class and styling
        if ( this.settings.thumbnailsPosition === 'top' ) {
            this.thumbnailsContainerEl.classList.add( 'sp-top-thumbnails' );
            this.thumbnailsOrientation = 'horizontal';
        } else if ( this.settings.thumbnailsPosition === 'bottom' ) {
            this.thumbnailsContainerEl.classList.add( 'sp-bottom-thumbnails' );
            this.thumbnailsOrientation = 'horizontal';
        } else if ( this.settings.thumbnailsPosition === 'left' ) {
            this.thumbnailsContainerEl.classList.add( 'sp-left-thumbnails' );
            this.thumbnailsOrientation = 'vertical';
        } else if ( this.settings.thumbnailsPosition === 'right' ) {
            this.thumbnailsContainerEl.classList.add( 'sp-right-thumbnails' );
            this.thumbnailsOrientation = 'vertical';
        }

        // Check if the pointer needs to be created
        if ( this.settings.thumbnailPointer === true ) {
            this.thumbnailsContainerEl.classList.add( 'sp-has-pointer' );
        } else {
            this.thumbnailsContainerEl.classList.remove( 'sp-has-pointer' );
        }

        // Mark the thumbnail that corresponds to the selected slide
        this.selectedThumbnailIndex = this.slider.selectedSlideIndex;
        this.thumbnailsEl.getElementsByClassName( 'sp-thumbnail-container' )[ this.selectedThumbnailIndex ].classList.add( 'sp-selected-thumbnail' );
		
        // Calculate the total size of the thumbnails
        this.thumbnailsSize = 0;

        this.thumbnails.forEach( ( thumbnail ) => {
            thumbnail.setSize( this.settings.thumbnailWidth, this.settings.thumbnailHeight );
            this.thumbnailsSize += this.thumbnailsOrientation === 'horizontal' ? thumbnail.getSize().width : thumbnail.getSize().height;
        });

        // Set the size of the thumbnails
        if ( this.thumbnailsOrientation === 'horizontal' ) {
            this.thumbnailsEl.style.width = resolveUnit( this.thumbnailsSize );
            this.thumbnailsEl.style.height = resolveUnit( this.settings.thumbnailHeight );
            this.thumbnailsContainerEl.style.removeProperty( 'height' );
            this.thumbnailsPositionProperty = 'left';
        } else {
            this.thumbnailsEl.style.width = resolveUnit( this.settings.thumbnailWidth );
            this.thumbnailsEl.style.height = resolveUnit( this.thumbnailsSize );
            this.thumbnailsContainerEl.style.removeProperty( 'width' );
            this.thumbnailsPositionProperty = 'top';
        }

        // Fire the 'thumbnailsUpdate' event
        this.dispatchEvent( 'thumbnailsUpdate' );
    }

    // Create an individual thumbnail
    _createThumbnail( thumbnailEl, index ) {
        const thumbnail = new Thumbnail( thumbnailEl, this.thumbnailsEl, index );

        // When the thumbnail is clicked, navigate to the corresponding slide
        const thumbnailClickHandler = ( event ) => {
            this.slider.gotoSlide( event.detail.index );
        };

        thumbnail.addEventListener( 'thumbnailClick', thumbnailClickHandler );

        this.eventHandlerReferences[ 'thumbnailClick' + index ] = thumbnailClickHandler;

        // Add the thumbnail at the specified index
        this.thumbnails.splice( index, 0, thumbnail );
    }

    // Called when the slider is resized.
    // Resets the size and position of the thumbnail scroller container.
    resizeHandler() {
        if ( this.isThumbnailScroller === false ) {
            return;
        }

        let newThumbnailsPosition;

        if ( this.thumbnailsOrientation === 'horizontal' ) {
            this.thumbnailsContainerSize = Math.min( this.slider.slidesMaskEl.clientWidth, this.thumbnailsSize );
            this.thumbnailsContainerEl.style.width = resolveUnit( this.thumbnailsContainerSize );

            // Reduce the slide mask's height, to make room for the thumbnails
            if ( this.settings.forceSize === 'fullWindow' ) {
                this.slider.slidesMaskEl.style.height = resolveUnit( this.slider.slidesMaskEl.clientHeight - this.thumbnailsContainerEl.offsetHeight );

                // Resize the slides
                this.slider.slideHeight = this.slider.slidesMaskEl.clientHeight;
                this.slider.resizeSlides();

                // Re-arrange the slides
                this.slider.resetSlidesPosition();
            }
        } else if ( this.thumbnailsOrientation === 'vertical' ) {

            // Check if the width of the slide mask plus the width of the thumbnail scroller is greater than
            // the width of the slider's container and if that's the case, reduce the slides container width
            // in order to make the entire slider fit inside the slider's container.
            if ( this.slider.slidesMaskEl.clientWidth + this.thumbnailsContainerEl.offsetWidth > this.slider.sliderEl.parentElement.clientWidth ) {
                
                // Reduce the slider's width, to make room for the thumbnails
                if ( this.settings.forceSize === 'fullWidth' || this.settings.forceSize === 'fullWindow' ) {
                    this.slider.sliderEl.style.maxWidth = resolveUnit( window.innerWidth - this.thumbnailsContainerEl.offsetWidth );
                } else {
                    this.slider.sliderEl.style.maxWidth = resolveUnit( this.slider.sliderEl.parentElement.clientWidth - this.thumbnailsContainerEl.offsetWidth );
                }

                this.slider.slidesMaskEl.style.width = resolveUnit( window.getComputedStyle( this.slider.sliderEl ).width );

                // If the slides are vertically oriented, update the width and height (to maintain the aspect ratio)
                // of the slides.
                if ( this.settings.orientation === 'vertical' ) {
                    this.slider.slideWidth = this.slider.sliderEl.clientWidth;

                    this.slider.resizeSlides();
                }

                // Re-arrange the slides
                this.slider.resetSlidesPosition();
            }

            this.thumbnailsContainerSize = Math.min( this.slider.slidesMaskEl.clientHeight, this.thumbnailsSize );
            this.thumbnailsContainerEl.style.height = resolveUnit( this.thumbnailsContainerSize );
        }

        // If the total size of the thumbnails is smaller than the thumbnail scroller' container (which has
        // the same size as the slides container), it means that all the thumbnails will be visible, so set
        // the position of the thumbnail scroller to 0.
        // 
        // If that's not the case, the thumbnail scroller will be positioned based on which thumbnail is selected.
        if ( this.thumbnailsSize <= this.thumbnailsContainerSize || this.thumbnailsEl.getElementsByClassName( 'sp-selected-thumbnail' ).length === 0 ) {
            newThumbnailsPosition = 0;
        } else {
            newThumbnailsPosition = Math.max( - this.thumbnails[ this.selectedThumbnailIndex ].getPosition()[ this.thumbnailsPositionProperty ], this.thumbnailsContainerSize - this.thumbnailsSize );
        }

        // Add a padding to the slider, based on the thumbnail scroller's orientation, to make room
        // for the thumbnails.
        const thumbnailsComputedStyle = window.getComputedStyle( this.thumbnailsContainerEl );
        const thumbnailsWidth = this.thumbnailsContainerEl.offsetWidth + parseInt( thumbnailsComputedStyle.marginLeft ) + parseInt( thumbnailsComputedStyle.marginRight );
        const thumbnailsHeight = this.thumbnailsContainerEl.offsetHeight + parseInt( thumbnailsComputedStyle.marginTop ) + parseInt( thumbnailsComputedStyle.marginBottom );

        if ( this.settings.thumbnailsPosition === 'top' ) {
            this.slider.sliderEl.style.paddingTop = resolveUnit( thumbnailsHeight );
            this.slider.sliderEl.style.removeProperty( 'padding-left' );
            this.slider.sliderEl.style.removeProperty( 'padding-right' );
        } else if ( this.settings.thumbnailsPosition === 'bottom' ) {
            this.slider.sliderEl.style.removeProperty( 'padding-top' );
            this.slider.sliderEl.style.removeProperty( 'padding-left' );
            this.slider.sliderEl.style.removeProperty( 'padding-right' );
        } else if ( this.settings.thumbnailsPosition === 'left' ) {
            this.slider.sliderEl.style.removeProperty( 'padding-top' );
            this.slider.sliderEl.style.paddingLeft = resolveUnit( thumbnailsWidth ); 
            this.slider.sliderEl.style.removeProperty( 'padding-right' );
        } else if ( this.settings.thumbnailsPosition === 'right' ) {
            this.slider.sliderEl.style.removeProperty( 'padding-top' );
            this.slider.sliderEl.style.removeProperty( 'padding-left' );
            this.slider.sliderEl.style.paddingRight = resolveUnit( thumbnailsWidth );
        }

        this.moveTo( newThumbnailsPosition, true );
    }

    // Selects the thumbnail at the indicated index and moves the thumbnail scroller
    // accordingly.
    gotoThumbnail( index ) {
        if ( this.isThumbnailScroller === false || typeof this.thumbnails[ index ] === 'undefined' ) {
            return;
        }

        let previousIndex = this.selectedThumbnailIndex,
            newThumbnailsPosition = this.thumbnailsPosition;

        this.selectedThumbnailIndex = index;

        // Set the 'selected' class to the appropriate thumbnail
        this.thumbnailsEl.getElementsByClassName( 'sp-selected-thumbnail' )[0].classList.remove( 'sp-selected-thumbnail' );
        this.thumbnailsEl.getElementsByClassName( 'sp-thumbnail-container' )[ this.selectedThumbnailIndex ].classList.add( 'sp-selected-thumbnail' );

        // Calculate the new position that the thumbnail scroller needs to go to.
        // 
        // If the selected thumbnail has a higher index than the previous one, make sure that the thumbnail
        // that comes after the selected thumbnail will be visible, if the selected thumbnail is not the
        // last thumbnail in the list.
        // 
        // If the selected thumbnail has a lower index than the previous one, make sure that the thumbnail
        // that's before the selected thumbnail will be visible, if the selected thumbnail is not the
        // first thumbnail in the list.
        if ( this.settings.rightToLeft === true && this.thumbnailsOrientation === 'horizontal' ) {
            if ( this.selectedThumbnailIndex >= previousIndex ) {
                const rtlNextThumbnailIndex = this.selectedThumbnailIndex === this.thumbnails.length - 1 ? this.selectedThumbnailIndex : this.selectedThumbnailIndex + 1,
                    rtlNextThumbnail = this.thumbnails[ rtlNextThumbnailIndex ];

                if ( rtlNextThumbnail.getPosition().left < - this.thumbnailsPosition ) {
                    newThumbnailsPosition = - rtlNextThumbnail.getPosition().left;
                }
            } else if ( this.selectedThumbnailIndex < previousIndex ) {
                const rtlPreviousThumbnailIndex = this.selectedThumbnailIndex === 0 ? this.selectedThumbnailIndex : this.selectedThumbnailIndex - 1,
                    rtlPreviousThumbnail = this.thumbnails[ rtlPreviousThumbnailIndex ],
                    rtlThumbnailsRightPosition = - this.thumbnailsPosition + this.thumbnailsContainerSize;

                if ( rtlPreviousThumbnail.getPosition().right > rtlThumbnailsRightPosition ) {
                    newThumbnailsPosition = this.thumbnailsPosition - ( rtlPreviousThumbnail.getPosition().right - rtlThumbnailsRightPosition );
                }
            }
        } else {
            if ( this.selectedThumbnailIndex >= previousIndex ) {
                const nextThumbnailIndex = this.selectedThumbnailIndex === this.thumbnails.length - 1 ? this.selectedThumbnailIndex : this.selectedThumbnailIndex + 1,
                    nextThumbnail = this.thumbnails[ nextThumbnailIndex ],
                    nextThumbnailPosition = this.thumbnailsOrientation === 'horizontal' ? nextThumbnail.getPosition().right : nextThumbnail.getPosition().bottom,
                    thumbnailsRightPosition = - this.thumbnailsPosition + this.thumbnailsContainerSize;

                if ( nextThumbnailPosition > thumbnailsRightPosition ) {
                    newThumbnailsPosition = this.thumbnailsPosition - ( nextThumbnailPosition - thumbnailsRightPosition );
                }
            } else if ( this.selectedThumbnailIndex < previousIndex ) {
                const previousThumbnailIndex = this.selectedThumbnailIndex === 0 ? this.selectedThumbnailIndex : this.selectedThumbnailIndex - 1,
                    previousThumbnail = this.thumbnails[ previousThumbnailIndex ],
                    previousThumbnailPosition = this.thumbnailsOrientation === 'horizontal' ? previousThumbnail.getPosition().left : previousThumbnail.getPosition().top;

                if ( previousThumbnailPosition < - this.thumbnailsPosition ) {
                    newThumbnailsPosition = - previousThumbnailPosition;
                }
            }
        }

        // Move the thumbnail scroller to the calculated position
        this.moveTo( newThumbnailsPosition );

        // Fire the 'gotoThumbnail' event
        this.dispatchEvent( 'gotoThumbnail' );
    }

    // Move the thumbnail scroller to the indicated position
    moveTo( position, instant, callback ) {
        const css = {};

        // Return if the position hasn't changed
        if ( position === this.thumbnailsPosition ) {
            return;
        }

        this.thumbnailsPosition = position;

        // Use CSS transitions if they are supported. If not, use JavaScript animation
        let transition,
            left = this.thumbnailsOrientation === 'horizontal' ? position : 0,
            top = this.thumbnailsOrientation === 'horizontal' ? 0 : position;

        css[ 'transform' ] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';

        if ( typeof instant !== 'undefined' && instant === true ) {
            transition = '';
        } else {
            this.thumbnailsEl.classList.add( 'sp-animated' );
            transition = 'transform ' + 700 / 1000 + 's';

            const transitionEndHandler = ( event ) => {
                if ( event.target !== event.currentTarget ) {
                    return;
                }

                this.thumbnailsEl.removeEventListener( 'transitionend', transitionEndHandler );
                this.thumbnailsEl.classList.remove( 'sp-animated' );

                if ( typeof callback === 'function' ) {
                    callback();
                }

                // Fire the 'thumbnailsMoveComplete' event
                this.dispatchEvent( 'thumbnailsMoveComplete' );
            };

            this.thumbnailsEl.addEventListener( 'transitionend', transitionEndHandler );
            this.eventHandlerReferences[ 'thumbnailsTransitionEnd' ] = transitionEndHandler;
        }

        css[ 'transition' ] = transition;

        for ( let property in css ) {
            this.thumbnailsEl.style[ property ] = css[ property ];
        }
    }

    // Stop the movement of the thumbnail scroller
    stopMovement() {
        const matrixString = window.getComputedStyle( this.thumbnailsEl ).transform,
            matrixType = matrixString.indexOf( 'matrix3d' ) !== -1 ? 'matrix3d' : 'matrix',
            matrixArray = matrixString.replace( matrixType, '' ).match( /-?[0-9.]+/g ),
            left = matrixType === 'matrix3d' ? parseInt( matrixArray[ 12 ], 10 ) : parseInt( matrixArray[ 4 ], 10 ),
            top = matrixType === 'matrix3d' ? parseInt( matrixArray[ 13 ], 10 ) : parseInt( matrixArray[ 5 ], 10 );

        this.thumbnailsEl.style.transform = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
        this.thumbnailsEl.style.removeProperty( 'transition' );
		
        this.thumbnailsEl.removeEventListener( 'transitionend', this.eventHandlerReferences['thumbnailsTransitionEnd'] );
        this.thumbnailsPosition = this.thumbnailsOrientation === 'horizontal' ? parseInt( matrixArray[ 4 ] , 10 ) : parseInt( matrixArray[ 5 ] , 10 );

        this.thumbnailsEl.classList.remove( 'sp-animated' );
    }

    // Destroy the module
    destroy() {
        // Remove event listeners
        this.slider.removeEventListener( 'update.' + this.namespace );

        if ( this.isThumbnailScroller === false ) {
            return;
        }
		
        this.slider.removeEventListener( 'resize.' + this.namespace );
        this.slider.removeEventListener( 'gotoSlide.' + this.namespace );

        // Destroy the individual thumbnails
        Array.from( this.thumbnailsEl.getElementsByClassName( 'sp-thumbnail' ) ).forEach( ( thumbnailEl ) => {
            const index = parseInt( thumbnailEl.getAttribute( 'data-index' ), 10 ),
                thumbnail = this.thumbnails[ index ];

            thumbnail.removeEventListener( 'thumbnailClick', this.eventHandlerReferences[ 'thumbnailClick' + index ] );
            thumbnail.destroy();
        });

        this.thumbnails.length = 0;

        // Add the thumbnail scroller directly in the slider and
        // remove the thumbnail scroller container
        this.slider.sliderEl.appendChild( this.thumbnailsEl );
        this.thumbnailsContainerEl.remove();
		
        // Remove any created padding
        this.slider.sliderEl.style.removeProperty( 'paddin-top' );
        this.slider.sliderEl.style.removeProperty( 'padding-left' );
        this.slider.sliderEl.style.removeProperty( 'padding-right' );
    }
}

export default Thumbnails;