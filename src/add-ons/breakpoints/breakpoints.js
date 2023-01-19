class Breakpoints {

    // The namespace to be used when adding event listeners
    namespace = 'breakpoints';

    // Reference to the base slider instance
    slider;

    // Stores the breakpoints
    breakpoints;

    // Another reference to the settings which will not be altered by breakpoints or by other means
    originalSettings = {};

    // Stores size breakpoints
    orderedBreakpoints = [];

    // Indicates the current size breakpoint
    currentBreakpoint = -1;

    constructor( slider ) {
        this.slider = slider;
        
        if ( this.slider.settings.breakpoints === null ) {
            return;
        }

        this.slider.addEventListener( 'beforeInit.' + this.namespace, () => {
            this.init();
        });
    }

    init() {
        this.breakpoints = { ...this.slider.settings.breakpoints };

        // Keep a reference of the original settings and use it
        // to restore the settings when the breakpoints are used.
        this.originalSettings = { ...this.slider.settings };

        // Parse the breakpoints object and store the values into an array,
        // sorting them in ascending order based on the specified size.
        for ( let sizes in this.breakpoints ) {
            this.orderedBreakpoints.push({ 
                size: parseInt( sizes, 10 ),
                properties: this.breakpoints[ sizes ]
            });
        }

        this.orderedBreakpoints = this.orderedBreakpoints.sort( ( a, b ) => a.size >= b.size ? 1: -1 );

        this.slider.addEventListener( 'beforeResize.' + this.namespace, () => {
            const newBreakpointSettings = this.getCurrentSettings();

            if ( newBreakpointSettings !== false ) {
                this.slider.settings = { ...newBreakpointSettings };
                this.slider.update();
            }
        } );
    }

    getCurrentSettings() {
        // Check if the current window width is bigger than the biggest breakpoint
        // and if necessary reset the properties to the original settings.
        // 
        // If the window width is smaller than a certain breakpoint, apply the settings specified
        // for that breakpoint but only after merging them with the original settings
        // in order to make sure that only the specified settings for the breakpoint are applied
        if ( this.breakpoints !== null && this.orderedBreakpoints.length > 0 ) {
            if ( window.innerWidth > this.orderedBreakpoints[ this.orderedBreakpoints.length - 1 ].size && this.currentBreakpoint !== -1 ) {
                this.currentBreakpoint = -1;
                return this.originalSettings;
            } else {
                for ( let i = 0, n = this.orderedBreakpoints.length; i < n; i++ ) {
                    if ( window.innerWidth <= this.orderedBreakpoints[ i ].size ) {
                        if ( this.currentBreakpoint !== this.orderedBreakpoints[ i ].size ) {
                            const settings = { ...this.originalSettings, ...this.orderedBreakpoints[ i ].properties };

                            this.currentBreakpoint = this.orderedBreakpoints[ i ].size;
                            
                            return settings;
                        }

                        break;
                    }
                }
            }
        }

        return false;
    }

    destroy() {
        this.slider.removeEventListener( 'beforeInit.' + this.namespace );
        this.slider.removeEventListener( 'beforeResize.' + this.namespace );
    }
}

export default Breakpoints;