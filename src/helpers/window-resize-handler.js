import CustomEventTarget from './custom-event-target.js';

class WindowResizeHandler extends CustomEventTarget {

    // Reference to the old window width, used to check if the window width has changed
    previousWidth = 0;
    
    // Reference to the old window height, used to check if the window height has changed
    previousHeight = 0;

    // Property used for deferring the resizing of the slider
    allowResize = true;

    delay = 200;

    handlerReference;

    timeoutReference;

    constructor( delay = null ) {
        super();

        if ( delay !== null ) {
            this.delay = delay;
        }
    }

    addEventListener( type, handler ) {
        super.addEventListener( type, handler );

        this.handlerReference = this.handler.bind( this );

        window.addEventListener( 'resize', this.handlerReference );
    }

    removeEventListener( type ) {
        super.removeEventListener( type );

        window.removeEventListener( 'resize', this.handlerReference );
    }

    handler() {
        // If the resize is not allowed yet or if the window size hasn't changed return early.
        if ( this.allowResize === false ||
            ( this.previousWidth === window.innerWidth && this.previousHeight === window.innerHeight ) ) {
            return;
        }

        // Assign the new values for the window width and height
        this.previousWidth = window.innerWidth;
        this.previousHeight = window.innerHeight;
    
        this.allowResize = false;

        this.timeoutReference = setTimeout(() => {
            this.dispatchEvent( 'resize' );
            this.allowResize = true;
        }, this.delay );
    }

    destroy() {
        clearTimeout( this.timeoutReference );
    }
}

export default WindowResizeHandler;