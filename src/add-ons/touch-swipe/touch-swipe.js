class TouchSwipe {

    // The namespace to be used when adding event listeners
    namespace = 'touchswipe';

    // Reference to the base slider instance
    slider;

    // Stores the current settings of the slider
    settings;

    // Indicates whether the touch swipe is enabled for slides
    isTouchSwipeEnabled = false;

    // The x and y coordinates of the pointer/finger's starting position
    touchStartPoint = { x: 0, y: 0 };

    // The x and y coordinates of the pointer/finger's end position
    touchEndPoint = { x: 0, y: 0 };

    // The distance from the starting to the end position on the x and y axis
    touchDistance = { x: 0, y: 0 };

    // The position of the slides when the touch swipe starts
    touchStartPosition = 0;

    // Indicates if the slides are being swiped
    isTouchMoving = false;

    // Stores the names of the events
    touchSwipeEvents = {
        startEvent: [ 'touchstart', 'mousedown' ],
        moveEvent: [ 'touchmove', 'mousemove' ],
        endEvent: [ 'touchend', 'mouseup' ]
    };

    // Indicates if scrolling (the page) in the opposite direction of the
    // slides' layout is allowed. This is used to block vertical (or horizontal)
    // scrolling when the user is scrolling through the slides.
    allowOppositeScrolling = true;

    // Indicates whether the previous 'start' event was a 'touchstart' or 'mousedown'
    previousStartEvent = '';

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {
		
        // Indicates whether the touch swipe will be enabled
        touchSwipe: true,

        // Sets the minimum amount that the slides should move
        touchSwipeThreshold: 50
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

        // check if touch swipe is enabled
        if ( this.settings.touchSwipe === true && this.isTouchSwipeEnabled === false ) {
            this.add();
        } else if ( this.settings.touchSwipe === false && this.isTouchSwipeEnabled === true ) {
            this.destroy();
        }
    }

    add() {
        this.isTouchSwipeEnabled = true;

        // Listen for touch swipe/mouse move events
        Array.from( this.touchSwipeEvents.startEvent ).forEach( ( eventType ) => {
            const eventHandler = ( event ) => {
                this.touchStartHandler( event );
            };

            this.eventHandlerReferences[ eventType ] = eventHandler;

            this.slider.slidesMaskEl.addEventListener( eventType, eventHandler );
        });

        const dragStartHandler = ( event ) => {
            event.preventDefault();
        };

        this.eventHandlerReferences[ 'dragstart' ] = dragStartHandler;
		
        this.slider.slidesMaskEl.addEventListener( 'dragstart', dragStartHandler );

        // Prevent 'click' events unless there is intention for a 'click'
        const linkClickHandler = ( event ) => {
            if ( this.slider.sliderEl.classList.contains( 'sp-swiping' ) ) {
                event.preventDefault();
            }
        };

        Array.from( this.slider.slidesMaskEl.getElementsByTagName( 'a' ) ).forEach( ( element ) => {
            element.addEventListener( 'click', linkClickHandler );
        } );

        this.eventHandlerReferences[ 'linkclick' ] = linkClickHandler;

        // Add the grabbing icon
        this.slider.slidesMaskEl.classList.add( 'sp-grab' );
    }

    // Called when the slides starts being dragged
    touchStartHandler( event ) {

        // Return if a 'mousedown' event follows a 'touchstart' event
        if ( event.type === 'mousedown' && this.previousStartEvent === 'touchstart' ) {
            this.previousStartEvent = event.type;
            return;
        }

        // Assign the new 'start' event
        this.previousStartEvent = event.type;

        // Disable dragging if the element is set to allow selections
        if ( event.target.classList.contains( 'sp-selectable' ) ) {
            return;
        }

        const eventObject = typeof event.touches !== 'undefined' ? event.touches[0] : event;
        const { left, top } = this.slider.getSlidesPosition();
        const slidesPosition = this.settings.orientation === 'horizontal' ? left : top;

        // Get the initial position of the mouse pointer and the initial position
        // of the slides' container
        this.touchStartPoint.x = eventObject.pageX || eventObject.clientX;
        this.touchStartPoint.y = eventObject.pageY || eventObject.clientY;
        this.touchStartPosition = slidesPosition;

        // Clear the previous distance values
        this.touchDistance.x = this.touchDistance.y = 0;

        // If the slides are being grabbed while they're still animating, stop the
        // current movement
        if ( this.slider.slidesEl.classList.contains( 'sp-animated' ) ) {
            this.isTouchMoving = true;
            this.slider.stopMovement();
            this.touchStartPosition = slidesPosition;
        }

        // Listen for move and end events
        Array.from( this.touchSwipeEvents.moveEvent ).forEach( ( eventType ) => {
            const eventHandler = ( event ) => {
                this.touchMoveHandler( event );
            };

            this.eventHandlerReferences[ eventType ] = eventHandler;

            this.slider.slidesMaskEl.addEventListener( eventType, eventHandler );
        });

        Array.from( this.touchSwipeEvents.endEvent ).forEach( ( eventType ) => {
            const eventHandler = ( event ) => {
                this.touchEndHandler( event );
            };

            this.eventHandlerReferences[ eventType ] = eventHandler;

            document.addEventListener( eventType, eventHandler );
        });

        // Swap grabbing icons
        this.slider.slidesMaskEl.classList.remove( 'sp-grab' );
        this.slider.slidesMaskEl.classList.add( 'sp-grabbing' );
    }

    // Called during the slides' dragging
    touchMoveHandler( event ) {
        const eventObject = typeof event.touches !== 'undefined' ? event.touches[0] : event;

        // Indicate that the move event is being fired
        this.isTouchMoving = true;

        // Add 'sp-swiping' class to indicate that the slides are being swiped
        if ( this.slider.sliderEl.classList.contains( 'sp-swiping' ) === false ) {
            this.slider.sliderEl.classList.add( 'sp-swiping' );
        }

        // Get the current position of the mouse pointer
        this.touchEndPoint.x = eventObject.pageX || eventObject.clientX;
        this.touchEndPoint.y = eventObject.pageY || eventObject.clientY;

        // Calculate the distance of the movement on both axis
        this.touchDistance.x = this.touchEndPoint.x - this.touchStartPoint.x;
        this.touchDistance.y = this.touchEndPoint.y - this.touchStartPoint.y;

        // Calculate the distance of the swipe that takes place in the same direction as the orientation of the slides
        // and calculate the distance from the opposite direction.
        // 
        // For a swipe to be valid there should more distance in the same direction as the orientation of the slides.
        let distance = this.settings.orientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y;
        const oppositeDistance = this.settings.orientation === 'horizontal' ? this.touchDistance.y : this.touchDistance.x;

        // If the movement is in the same direction as the orientation of the slides, the swipe is valid
        // and opposite scrolling will not be allowed.
        if ( Math.abs( distance ) > Math.abs( oppositeDistance ) ) {
            this.allowOppositeScrolling = false;
        }

        // If opposite scrolling is still allowed, the swipe wasn't valid, so return.
        if ( this.allowOppositeScrolling === true ) {
            return;
        }
		
        // Don't allow opposite scrolling
        event.preventDefault();

        if ( this.settings.loop === false ) {
            // Make the slides move slower if they're dragged outside its bounds
            if ( ( this.slider.slidesPosition > this.touchStartPosition && this.slider.selectedSlideIndex === 0 ) ||
				( this.slider.slidesPosition < this.touchStartPosition && this.slider.selectedSlideIndex === this.slider.getTotalSlides() - 1 )
            ) {
                distance = distance * 0.2;
            }
        }

        this.slider.moveTo( this.touchStartPosition + distance, true );
    }

    // Called when the slides are released
    touchEndHandler() {
        let touchDistance = this.settings.orientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y;

        // Remove the 'move' and 'end' listeners
        Array.from( this.touchSwipeEvents.moveEvent ).forEach( ( eventType ) => {
            const eventHandler = this.eventHandlerReferences[ eventType ];

            this.slider.slidesMaskEl.removeEventListener( eventType, eventHandler );
        });

        Array.from( this.touchSwipeEvents.endEvent ).forEach( ( eventType ) => {
            const eventHandler =  this.eventHandlerReferences[ eventType ];

            document.removeEventListener( eventType, eventHandler );
        });

        this.allowOppositeScrolling = true;

        // Swap grabbing icons
        this.slider.slidesMaskEl.classList.remove( 'sp-grabbing' );
        this.slider.slidesMaskEl.classList.add( 'sp-grab' );

        // Remove the 'sp-swiping' class with a delay, to allow
        // other event listeners (i.e. click) to check the existance
        // of the swipe event.
        if ( this.slider.sliderEl.classList.contains( 'sp-swiping' ) ) {
            setTimeout(() => {
                this.slider.sliderEl.classList.remove( 'sp-swiping' );
            }, 100 );
        }

        // Return if the slides didn't move
        if ( this.isTouchMoving === false ) {
            return;
        }

        this.isTouchMoving = false;

        // Calculate the old position of the slides in order to return to it if the swipe
        // is below the threshold
        const sizeProperty = this.settings.orientation === 'horizontal' ? 'width' : 'height';
        const positionProperty = this.settings.orientation === 'horizontal' ? 'left' : 'top';
        const selectedSlideOffset = this.settings.centerSelectedSlide === true && this.settings.visibleSize !== 'auto' ? Math.round( ( parseInt( this.slider.slidesMaskEl.style[ sizeProperty ], 10 ) - this.slider.getSlideAt( this.slider.selectedSlideIndex ).getSize()[ sizeProperty ] ) / 2 ) : 0;
        const oldSlidesPosition = - parseInt( this.slider.slidesEl.getElementsByClassName( 'sp-slide' )[ this.slider.selectedSlideIndex ].style[ positionProperty ], 10 ) + selectedSlideOffset;

        if ( Math.abs( touchDistance ) < this.settings.touchSwipeThreshold ) {
            this.slider.moveTo( oldSlidesPosition );
        } else {
            let slidesSize = 0,
                averageSlideSize = 0;

            if ( this.settings.autoSlideSize === true ) {
                const firstSlide = this.slider.slidesEl.getElementsByClassName( 'sp-slide' )[ this.slider.slidesOrder[ 0 ] ],
                    firstSlidePosition = parseInt( firstSlide.style[ positionProperty ], 10 ),
                    lastSlide = this.slider.slidesEl.getElementsByClassName( 'sp-slide' )[ this.slider.slidesOrder[ this.slider.slidesOrder.length - 1 ] ],
                    lastSlidePosition = parseInt( lastSlide.style[ positionProperty ], 10 ) + ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ? -1 : 1 ) * parseInt( window.getComputedStyle( lastSlide )[ sizeProperty ], 10 );
				
                slidesSize = Math.abs( lastSlidePosition - firstSlidePosition );
                averageSlideSize = Math.round( slidesSize / this.slider.slides.length );
            } else {
                slidesSize = ( ( this.settings.orientation === 'horizontal' ? this.slider.slideWidth : this.slider.slideHeight ) + this.settings.slideDistance ) * this.slider.slides.length - this.settings.slideDistance;
                averageSlideSize = this.settings.orientation === 'horizontal' ? this.slider.slideWidth : this.slider.slideHeight;
            }

            // Calculate by how many slides the slides container has moved
            let	slideArrayDistance = ( this.settings.rightToLeft === true && this.settings.orientation === 'horizontal' ? -1 : 1 ) * touchDistance / ( averageSlideSize + this.settings.slideDistance );

            // Floor the obtained value and add or subtract 1, depending on the direction of the swipe
            slideArrayDistance = parseInt( slideArrayDistance, 10 ) + ( slideArrayDistance > 0 ? 1 : - 1 );

            // Get the index of the currently selected slide and subtract the position index in order to obtain
            // the new index of the selected slide. 
            const nextSlideIndex = this.slider.slidesOrder[ this.slider.slidesOrder.findIndex( slideIndex => slideIndex === this.slider.selectedSlideIndex ) - slideArrayDistance ];

            if ( this.settings.loop === true ) {
                this.slider.gotoSlide( nextSlideIndex );
            } else {
                if ( typeof nextSlideIndex !== 'undefined' ) {
                    this.slider.gotoSlide( nextSlideIndex );
                } else {
                    this.slider.moveTo( oldSlidesPosition );
                }
            }
        }
    }

    // Destroy the module
    destroy() {
        this.isTouchSwipeEnabled = false;

        this.slider.removeEventListener( 'update.' + this.namespace );

        const dragStartHandler = this.eventHandlerReferences[ 'dragstart' ];
        this.slider.slidesMaskEl.removeEventListener( 'dragstart', dragStartHandler );

        Array.from( this.slider.slidesMaskEl.getElementsByTagName( 'a' ) ).forEach( ( element ) => {
            element.removeEventListener( 'click', this.eventHandlerReferences[ 'linkclick' ] );
        });

        Array.from( [ ...this.touchSwipeEvents.startEvent , ...this.touchSwipeEvents.moveEvent ] ).forEach( ( eventType ) => {
            const eventHandler = this.eventHandlerReferences[ eventType ];

            this.slider.slidesMaskEl.removeEventListener( eventType, eventHandler );
        });

        Array.from( this.touchSwipeEvents.endEvent ).forEach( ( eventType ) => {
            const eventHandler =  this.eventHandlerReferences[ eventType ];

            document.removeEventListener( eventType, eventHandler );
        });
		
        this.slider.slidesMaskEl.classList.remove( 'sp-grab' );
    }
}

export default TouchSwipe;