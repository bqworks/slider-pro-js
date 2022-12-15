import { getParent } from '../../helpers/util.js';

class ThumbnailTouchSwipe {

    // The namespace to be used when adding event listeners
    namespace = 'thumbnailtouchswipe';

    // Reference to the base slider instance
    slider;

    // Reference to the base thumbnails instance
    thumbnails;

    // Stores the current settings of the slider
    settings;

    // Indicates whether the touch swipe is enabled for the thumbnails
    isTouchSwipeEnabled = false;

    // The x and y coordinates of the pointer/finger's starting position
    touchStartPoint = { x: 0, y: 0 };

    // The x and y coordinates of the pointer/finger's end position
    touchEndPoint = { x: 0, y: 0 };

    // The distance from the starting to the end position on the x and y axis
    touchDistance = { x: 0, y: 0 };

    // The position of the slides when the touch swipe starts
    touchStartPosition = 0;

    // Stores the names of the events
    touchSwipeEvents = {
        startEvent: [ 'touchstart', 'mousedown' ],
        moveEvent: [ 'touchmove', 'mousemove' ],
        endEvent: [ 'touchend', 'mouseup' ]
    };

    // Indicates if the thumbnail scroller is being swiped
    isTouchMoving = false;

    // Indicates whether the previous 'start' event was a 'touchstart' or 'mousedown'
    previousStartEvent = '';

    // Stores references the event handlers in pairs containing the event identifier and the event handler
    // in order to be able to retrieve them when they need to be removed
    eventHandlerReferences = {};

    // Default add-on settings
    defaults = {
		
        // Indicates whether the touch swipe will be enabled
        thumbnailTouchSwipe: true,

        // Sets the minimum amount that the slides should move
        thumbnailTouchSwipeThreshold: 50
    };

    constructor( slider ) {
        this.slider = slider;
        this.thumbnails = this.slider.thumbnails;

        this.init();
    }

    init() {
        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
    }

    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        if ( this.thumbnails.isThumbnailScroller === false ) {
            return;
        }

        // check if touch swipe is enabled
        if ( this.settings.thumbnailTouchSwipe === true && this.isTouchSwipeEnabled === false ) {
            this.add();
        } else if ( this.settings.thumbnailTouchSwipe === false && this.isTouchSwipeEnabled === true ) {
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

            this.thumbnails.thumbnailsEl.addEventListener( eventType, eventHandler );
        });

        const dragStartHandler = ( event ) => {
            event.preventDefault();
        };

        this.eventHandlerReferences[ 'dragstart' ] = dragStartHandler;
		
        this.thumbnails.thumbnailsEl.addEventListener( 'dragstart', dragStartHandler );

        // Add the grabbing icon
        this.thumbnails.thumbnailsEl.classList.add( 'sp-grab' );

        // Remove the default thumbnailClick
        this.thumbnails.thumbnails.forEach( ( thumbnail ) => {
            thumbnail.removeEventListener( 'thumbnailClick' );
        });
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

        // Prevent default behavior for mouse events
        if ( typeof event.touches === 'undefined' ) {
            event.preventDefault();
        }

        if ( getParent( event.target, 'sp-thumbnail-container' ) !== null && getParent( event.target, 'sp-thumbnail-container' ).getElementsByTagName( 'a' ).length !== 0 ) {
            const links = getParent( event.target, 'sp-thumbnail-container' ).getElementsByTagName( 'a' );

            // Disable click events on links
            const linkClickHandler = ( event ) => {
                event.preventDefault();

                Array.from( links ).forEach( ( link ) => {
                    link.removeEventListener( 'click', linkClickHandler );
                });
            };

            Array.from( links ).forEach( ( link ) => {
                link.addEventListener( 'click', linkClickHandler );
            });

            this.eventHandlerReferences['click.link'] = linkClickHandler;
        }

        // Get the initial position of the mouse pointer and the initial position
        // of the slides' container
        this.touchStartPoint.x = eventObject.pageX || eventObject.clientX;
        this.touchStartPoint.y = eventObject.pageY || eventObject.clientY;
        this.touchStartPosition = this.thumbnails.thumbnailsPosition;

        // Clear the previous distance values
        this.touchDistance.x = this.touchDistance.y = 0;

        // If the slides are being grabbed while they're still animating, stop the
        // current movement
        if ( this.thumbnails.thumbnailsEl.classList.contains( 'sp-animated' ) ) {
            this.isTouchMoving = true;
            this.thumbnails.stopMovement();
            this.touchStartPosition = this.thumbnails.thumbnailsPosition;
        }

        // Listen for move and end events
        Array.from( this.touchSwipeEvents.moveEvent ).forEach( ( eventType ) => {
            const eventHandler = ( event ) => {
                this.touchMoveHandler( event );
            };

            this.eventHandlerReferences[ eventType ] = eventHandler;

            this.thumbnails.thumbnailsEl.addEventListener( eventType, eventHandler );
        });

        Array.from( this.touchSwipeEvents.endEvent ).forEach( ( eventType ) => {
            const eventHandler = ( event ) => {
                this.touchEndHandler( event );
            };

            this.eventHandlerReferences[ eventType ] = eventHandler;

            document.addEventListener( eventType, eventHandler );
        });

        // Swap grabbing icons
        this.thumbnails.thumbnailsEl.classList.remove( 'sp-grab' );
        this.thumbnails.thumbnailsEl.classList.add( 'sp-grabbing' );

        this.thumbnails.thumbnailsContainerEl.classList.add( 'sp-swiping' );
    }

    // Called during the thumbnail scroller's dragging
    touchMoveHandler( event ) {
        const eventObject = typeof event.touches !== 'undefined' ? event.touches[0] : event;

        // Indicate that the move event is being fired
        this.isTouchMoving = true;

        // Get the current position of the mouse pointer
        this.touchEndPoint.x = eventObject.pageX || eventObject.clientX;
        this.touchEndPoint.y = eventObject.pageY || eventObject.clientY;

        // Calculate the distance of the movement on both axis
        this.touchDistance.x = this.touchEndPoint.x - this.touchStartPoint.x;
        this.touchDistance.y = this.touchEndPoint.y - this.touchStartPoint.y;

        // Calculate the distance of the swipe that takes place in the same direction as the orientation of the thumbnails
        // and calculate the distance from the opposite direction.
        // 
        // For a swipe to be valid there should more distance in the same direction as the orientation of the thumbnails.
        let distance = this.thumbnails.thumbnailsOrientation === 'horizontal' ? this.touchDistance.x : this.touchDistance.y,
            oppositeDistance = this.thumbnails.thumbnailsOrientation === 'horizontal' ? this.touchDistance.y : this.touchDistance.x;

        // If the movement is in the same direction as the orientation of the thumbnails, the swipe is valid
        if ( Math.abs( distance ) > Math.abs( oppositeDistance ) ) {
            event.preventDefault();
        } else {
            return;
        }

        // Make the thumbnail scroller move slower if it's dragged outside its bounds
        if ( this.thumbnails.thumbnailsPosition >= 0 ) {
            const infOffset = - this.touchStartPosition;
            distance = infOffset + ( distance - infOffset ) * 0.2;
        } else if ( this.thumbnails.thumbnailsPosition <= - this.thumbnails.thumbnailsSize + this.thumbnails.thumbnailsContainerSize ) {
            const supOffset = this.thumbnails.thumbnailsSize - this.thumbnails.thumbnailsContainerSize + this.touchStartPosition;
            distance = - supOffset + ( distance + supOffset ) * 0.2;
        }

        this.thumbnails.moveTo( this.touchStartPosition + distance, true );
    }

    // Called when the thumbnail scroller is released
    touchEndHandler( event ) {

        // Remove the 'move' and 'end' listeners
        Array.from( this.touchSwipeEvents.moveEvent ).forEach( ( eventType ) => {
            const eventHandler = this.eventHandlerReferences[ eventType ];

            this.thumbnails.thumbnailsEl.removeEventListener( eventType, eventHandler );
        });

        Array.from( this.touchSwipeEvents.endEvent ).forEach( ( eventType ) => {
            const eventHandler =  this.eventHandlerReferences[ eventType ];
			
            document.removeEventListener( eventType, eventHandler );
        });

        // Swap grabbing icons
        this.thumbnails.thumbnailsEl.classList.remove( 'sp-grabbing' );
        this.thumbnails.thumbnailsEl.classList.add( 'sp-grab' );
        
        // Check if there is intention for a tap/click
        if ( this.isTouchMoving === false ||
			this.isTouchMoving === true &&
			Math.abs( this.touchDistance.x ) < 10 &&
			Math.abs( this.touchDistance.y ) < 10
        ) {
            let targetThumbnail = getParent( event.target, 'sp-thumbnail-container' );

            if ( targetThumbnail === null ) {
                return;
            }

            const index = parseInt( targetThumbnail.getElementsByClassName( 'sp-thumbnail' )[0].getAttribute( 'data-index' ), 10 );

            // If a link is cliked, navigate to that link, else navigate to the slide that corresponds to the thumbnail
            const parentLink = getParent( event.target, 'a' );

            if ( parentLink !== null ) {
                const linkClickHandler = this.eventHandlerReferences['click.link'];

                parentLink.removeEventListener( 'click', linkClickHandler );

                this.thumbnails.thumbnailsContainerEl.classList.remove( 'sp-swiping' );
            } else if ( index !== this.thumbnails.selectedThumbnailIndex ) {
                this.slider.gotoSlide( index );
            }

            return;
        }

        this.isTouchMoving = false;

        const clickedThumbnail = getParent( event.target, 'sp-thumbnail' );

        if ( clickedThumbnail !== null ) {
            const thumbnailClickHandler = ( event ) => {
                event.preventDefault();
                clickedThumbnail.removeEventListener( 'click', thumbnailClickHandler );
            };
	
            clickedThumbnail.addEventListener( 'click', thumbnailClickHandler );
        }

        // Remove the 'sp-swiping' class but with a delay
        // because there might be other event listeners that check
        // the existence of this class, and this class should still be 
        // applied for those listeners, since there was a swipe event
        setTimeout(() => {
            this.thumbnails.thumbnailsContainerEl.classList.remove( 'sp-swiping' );
        }, 1 );

        // Keep the thumbnail scroller inside the bounds
        if ( this.thumbnails.thumbnailsPosition > 0 ) {
            this.thumbnails.moveTo( 0 );
        } else if ( this.thumbnails.thumbnailsPosition < this.thumbnails.thumbnailsContainerSize - this.thumbnails.thumbnailsSize ) {
            this.thumbnails.moveTo( this.thumbnails.thumbnailsContainerSize - this.thumbnails.thumbnailsSize );
        }

        // Fire the 'thumbnailsMoveComplete' event
        this.thumbnails.dispatchEvent( 'thumbnailsMoveComplete' );
    }

    // Destroy the module
    destroy() {
        this.isTouchSwipeEnabled = false;

        if ( this.thumbnails.isThumbnailScroller === false ) {
            return;
        }

        const dragStartHandler = this.eventHandlerReferences[ 'dragstart' ];
        this.thumbnails.thumbnailsEl.removeEventListener( 'dragstart', dragStartHandler );
		
        Array.from( [ ...this.touchSwipeEvents.startEvent , ...this.touchSwipeEvents.moveEvent ] ).forEach( ( eventType ) => {
            const eventHandler = this.eventHandlerReferences[ eventType ];

            this.thumbnails.thumbnailsEl.removeEventListener( eventType, eventHandler );
        });

        Array.from( this.touchSwipeEvents.endEvent ).forEach( ( eventType ) => {
            const eventHandler =  this.eventHandlerReferences[ eventType ];

            document.removeEventListener( eventType, eventHandler );
        });
		
        this.thumbnails.thumbnailsEl.classList.remove( 'sp-grab' );


        this.slider.removeEventListener( 'update.' + this.namespace );
    }
}

export default ThumbnailTouchSwipe;