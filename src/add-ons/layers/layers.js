import Layer from './layer.js';

class Layers {

    // The namespace to be used when adding event listeners
    namespace = 'layers';

    // Reference to the base slider instance
    slider;

    // Stores the current settings of the slider
    settings;

    // Stores the Layer instances
    layers = [];

    // Stores layers that are animated
    animatedLayers = [];

    // Reference to the original 'gotoSlide' method
    layersGotoSlideReference = null;

    // Reference to the timer that will delay the overriding
    // of the 'gotoSlide' method
    waitForLayersTimer = null;

    // Default add-on settings
    defaults = {

        // Indicates whether the slider will wait for the layers to disappear before
        // going to a new slide
        waitForLayers: false,

        // Indicates whether the layers will be scaled automatically
        autoScaleLayers: true,

        // Sets a reference width which will be compared to the current slider width
        // in order to determine how much the layers need to scale down. By default,
        // the reference width will be equal to the slide width. However, if the slide width
        // is set to a percentage value, then it's necessary to set a specific value for 'autoScaleReference'.
        autoScaleReference: -1
    };

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
        this.slider.addEventListener( 'resize.' + this.namespace, this.resizeHandler.bind( this ) );
        this.slider.addEventListener( 'gotoSlide.' + this.namespace, this.gotoSlideHandler.bind( this ) );
    }

    // Loop through the slides and initialize all layers
    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        this.slider.slides.forEach( ( slide, slideIndex ) => {
            let slideEl = slide.slideEl;

            // Initialize the layers
            Array.from( slideEl.querySelectorAll( '.sp-layer:not([data-layer-init])' ) ).forEach( ( layerEl ) => {
                let layer = new Layer( layerEl );

                this.layers.push( { layer: layer, slideIndex: slideIndex } );

                if ( layerEl.classList.contains( 'sp-static' ) === false ) {
                    this.animatedLayers.push( { layer: layer, slideIndex: slideIndex } );
                }
            });
        });

        // If the 'waitForLayers' option is enabled, the slider will not move to another slide
        // until all the layers from the previous slide will be hidden. To achieve this,
        // replace the current 'gotoSlide' function with another function that will include the 
        // required functionality.
        // 
        // Since the 'gotoSlide' method might be overridden by other modules as well, delay this
        // override to make sure it's the last override.
        if ( this.settings.waitForLayers === true && this.layersGotoSlideReference === null ) {
            clearTimeout( this.waitForLayersTimer );

            this.waitForLayersTimer = setTimeout( () => {
                this.layersGotoSlideReference = this.slider.gotoSlide.bind( this.slider );
                this.slider.gotoSlide = this.layersGotoSlide.bind( this );
            }, 1 );
        }

        // Show the layers for the initial slide
        // Delay the call in order to make sure the layers
        // are scaled properly before displaying them
        setTimeout(() => {
            this.showLayersForSlide( this.slider.selectedSlideIndex );
        }, 1);
    }

    // When the slider resizes, try to scale down the layers proportionally. The automatic scaling
    // will make use of an option, 'autoScaleReference', by comparing the current width of the slider
    // with the reference width. So, if the reference width is 1000 pixels and the current width is
    // 500 pixels, it means that the layers will be scaled down to 50% of their size.
    resizeHandler() {
        let autoScaleReference,
            useAutoScale = this.settings.autoScaleLayers,
            scaleRatio;

        if ( this.settings.autoScaleLayers === false ) {
            return;
        }

        // If there isn't a reference for how the layers should scale down automatically, use the 'width'
        // option as a reference, unless the width was set to a percentage. If there isn't a set reference and
        // the width was set to a percentage, auto scaling will not be used because it's not possible to
        // calculate how much should the layers scale.
        if ( this.settings.autoScaleReference === -1 ) {
            if ( typeof this.settings.width === 'string' && this.settings.width.indexOf( '%' ) !== -1 ) {
                useAutoScale = false;
            } else {
                autoScaleReference = parseInt( this.settings.width, 10 );
            }
        } else {
            autoScaleReference = this.settings.autoScaleReference;
        }

        if ( useAutoScale === true && this.slider.slideWidth < autoScaleReference ) {
            scaleRatio = this.slider.slideWidth / autoScaleReference;
        } else {
            scaleRatio = 1;
        }

        this.layers.forEach( ( layerData ) => {
            layerData.layer.scale( scaleRatio );
        });
    }

    // Replace the 'gotoSlide' method with this one, which makes it possible to 
    // change the slide only after the layers from the previous slide are hidden.
    layersGotoSlide( index ) {
        let animatedLayers = this.animatedLayers.filter( ( layerData ) => layerData.slideIndex === this.slider.selectedSlideIndex );

        // If the slider is dragged, don't wait for the layer to hide
        if ( this.slider.sliderEl.classList.contains( 'sp-swiping' ) || animatedLayers.length === 0  ) {
            this.layersGotoSlideReference( index );
        } else {
            const hideLayersForSlideCompleteHandler = () => {
                this.slider.removeEventListener( 'hideLayersForSlideComplete', hideLayersForSlideCompleteHandler );
                this.layersGotoSlideReference( index );
            };

            this.slider.addEventListener( 'hideLayersForSlideComplete', hideLayersForSlideCompleteHandler);

            this.hideLayersForSlide( this.slider.selectedSlideIndex );
        }
    }

    // When a new slide is selected, hide the layers from the previous slide
    // and show the layers from the current slide.
    gotoSlideHandler() {
        if ( this.slider.previousSlideIndex !== this.slider.selectedSlideIndex ) {
            this.hideLayersForSlide( this.slider.previousSlideIndex );
        }

        this.showLayersForSlide( this.slider.selectedSlideIndex );
    }

    // Show the animated layers from the slide at the specified index,
    // and fire an event when all the layers from the slide become visible.
    showLayersForSlide( index ) {
        let animatedLayers = this.animatedLayers.filter( ( layerData ) => layerData.slideIndex === index ),
            layerCounter = 0;

        if ( animatedLayers.length === 0 ) {
            return;
        }

        animatedLayers.forEach( ( layerData, index ) => {
            const layer = layerData.layer;

            // If the layer is already visible, increment the counter directly, else wait 
            // for the layer's showing animation to complete.
            if ( layer.isVisible() === true ) {
                layerCounter++;

                if ( layerCounter === animatedLayers.length ) {
                    this.slider.dispatchEvent( 'showLayersForSlideComplete', { index: index } );
                }
            } else {
                layer.show(() => {
                    layerCounter++;

                    if ( layerCounter === animatedLayers.length ) {
                        this.slider.dispatchEvent( 'showLayersForSlideComplete', { index: index } );
                    }
                });
            }
        });
    }

    // Hide the animated layers from the slide at the specified index,
    // and fire an event when all the layers from the slide become invisible.
    hideLayersForSlide( index ) {
        let animatedLayers = this.animatedLayers.filter( ( layerData ) => layerData.slideIndex === index ),
            layerCounter = 0;

        if ( typeof animatedLayers === 'undefined' ) {
            return;
        }

        animatedLayers.forEach( ( layerData, index ) => {
            const layer = layerData.layer;

            // If the layer is already invisible, increment the counter directly, else wait 
            // for the layer's hiding animation to complete.
            if ( layer.isVisible() === false ) {
                layerCounter++;

                if ( layerCounter === animatedLayers.length ) {
                    this.slider.dispatchEvent( 'hideLayersForSlideComplete', { index: index } );
                }
            } else {
                layer.hide(() => {
                    layerCounter++;

                    if ( layerCounter === animatedLayers.length ) {
                        this.slider.dispatchEvent( 'hideLayersForSlideComplete', { index: index } );
                    }
                });
            }
        });
    }

    // Destroy the module
    destroy() {
        this.slider.removeEventListener( 'update.' + this.namespace );
        this.slider.removeEventListener( 'sliderResize.' + this.namespace );
        this.slider.removeEventListener( 'gotoSlide.' + this.namespace );
        this.slider.removeEventListener( 'hideLayersForSlideComplete' );

        this.layers.forEach( ( layer ) => {
            layer.destroy();
        });
    }
}

export default Layers;