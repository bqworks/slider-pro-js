class ConditionalImages {

    // The namespace to be used when adding event listeners
    namespace = 'conditionalimages';

    // Reference to the base slider instance
    slider;

    // Reference to the previous size
    previousImageSize = null;

    // Reference to the current size
    currentImageSize = null;

    // Indicates if the current display supports high PPI
    isRetinaScreen = false;

    // Default add-on settings
    defaults = {

        // If the slider size is below this size, the small version of the images will be used
        smallSize: 480,

        // If the slider size is below this size, the medium version of the images will be used
        mediumSize: 768,

        // If the slider size is below this size, the large version of the images will be used
        largeSize: 1024
    };

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        this.currentImageSize = this.previousImageSize = 'default';
        this.isRetinaScreen = window.devicePixelRatio >= 2;

        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
        this.slider.addEventListener( 'resize.' + this.namespace, this.resizeHandler.bind( this ) );
    }

    // Loop through all the existing images and specify the original path of the image
    // inside the 'data-default' attribute.
    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        this.slider.slides.forEach( ( slide ) => {
            const slideEl = slide.slideEl;

            Array.from( slideEl.querySelectorAll( 'img:not([ data-default ])' ) ).forEach( ( imageEl ) => {
                if ( imageEl.getAttribute( 'data-src' ) !== null ) {
                    imageEl.setAttribute( 'data-default', imageEl.getAttribute( 'data-src' ) );
                } else {
                    imageEl.setAttribute( 'data-default', imageEl.getAttribute( 'src' ) );
                }
            });
        });
    }

    // When the window resizes, identify the applyable image size based on the current size of the slider
    // and apply it to all images that have a version of the image specified for this size.
    resizeHandler() {
        if ( this.slider.slideWidth <= this.settings.smallSize ) {
            this.currentImageSize = 'small';
        } else if ( this.slider.slideWidth <= this.settings.mediumSize ) {
            this.currentImageSize = 'medium';
        } else if ( this.slider.slideWidth <= this.settings.largeSize ) {
            this.currentImageSize = 'large';
        } else {
            this.currentImageSize = 'default';
        }
        
        if ( this.previousImageSize !== this.currentImageSize ) {
            this.slider.slides.forEach( ( slide ) => {
                const slideEl = slide.slideEl;

                Array.from( slideEl.getElementsByTagName( 'img' ) ).forEach( ( imageEl ) => {
                    let imageSource = '';

                    // Check if the current display supports high PPI and if a retina version of the current size was specified
                    if ( this.isRetinaScreen === true && imageEl.getAttribute( 'data-retina' + this.currentImageSize ) !== null ) {
                        imageSource = imageEl.getAttribute( 'data-retina' + this.currentImageSize );

                        // If the retina image was not loaded yet, replace the default image source with the one
                        // that corresponds to the current slider size
                        if ( imageEl.getAttribute( 'data-retina' ) !== null && imageEl.getAttribute( 'data-retina' ) !== imageSource ) {
                            imageEl.setAttribute( 'data-retina', imageSource );
                        }
                    } else if ( ( this.isRetinaScreen === false || this.isRetinaScreen === true && imageEl.getAttribute( 'data-retina' ) === null ) && imageEl.getAttribute( 'data-' + this.currentImageSize ) !== null ) {
                        imageSource = imageEl.getAttribute( 'data-' + this.currentImageSize );

                        // If the image is set to lazy load, replace the image source with the one
                        // that corresponds to the current slider size
                        if ( imageEl.getAttribute( 'data-src' ) !== null && imageEl.getAttribute( 'data-src' ) !== imageSource ) {
                            imageEl.setAttribute( 'data-src', imageSource );
                        }
                    }

                    // If a new image was found
                    if ( imageSource !== '' ) {

                        // The existence of the 'data-src' attribute indicates that the image
                        // will be lazy loaded, so don't load the new image yet
                        if ( imageEl.getAttribute( 'data-src' ) === null && imageEl.getAttribute( 'src' ) !== imageSource  ) {
                            this.loadImage( imageEl, imageSource, ( newImageEl ) => {
                                if ( newImageEl.classList.contains( 'sp-image' ) ) {
                                    slide.mainImageEl = newImageEl;
                                    slide.resizeMainImage( true );
                                }
                            });
                        }
                    }
                });
            });

            this.previousImageSize = this.currentImageSize;
        }
    }

    // Replace the target image with a new image
    loadImage( imageEl, source, callback ) {

        // Create a new image element
        const newImageEl = new Image();

        // Copy the class(es) and inline style
        newImageEl.setAttribute( 'class', imageEl.getAttribute( 'class' ) );
        newImageEl.setAttribute( 'style', imageEl.getAttribute( 'style' ) );

        // Copy the data attributes
        for ( let keyname in imageEl.dataset ) {
            newImageEl.setAttribute( 'data-' + keyname, imageEl.dataset[ keyname ] );
        }

        // Copy the width and height attributes if they exist
        if ( imageEl.getAttribute( 'width' ) !== null ) {
            newImageEl.setAttribute( 'width', imageEl.getAttribute( 'width' ) );
        }

        if ( imageEl.getAttribute( 'height' ) !== null ) {
            newImageEl.setAttribute( 'height', imageEl.getAttribute( 'height' ) );
        }

        if ( imageEl.getAttribute( 'alt' ) !== null ) {
            newImageEl.setAttribute( 'alt', imageEl.getAttribute( 'alt' ) );
        }

        if ( imageEl.getAttribute( 'title' ) !== null ) {
            newImageEl.setAttribute( 'title', imageEl.getAttribute( 'title' ) );
        }

        if ( imageEl.getAttribute( 'data-srcset' ) !== null ) {
            newImageEl.setAttribute( 'srcset', imageEl.getAttribute( 'data-srcset' ) );
            newImageEl.removeAttribute( 'data-srcset' );
        }

        newImageEl.setAttribute( 'src', source );

        // Add the new image in the same container and remove the older image
        imageEl.after( newImageEl );
        imageEl.remove();
        imageEl = null;
			
        if ( typeof callback === 'function' ) {
            callback( newImageEl );
        }
    }

    // Destroy the module
    destroy() {
        this.slider.removeEventListener( 'update.' + this.namespace );
        this.slider.removeEventListener( 'resize.' + this.namespace );
    }	
}

export default ConditionalImages;