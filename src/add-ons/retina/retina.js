class Retina {

    // The namespace to be used when adding event listeners
    namespace = 'retina';

    // Reference to the base slider instance
    slider;

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        // Return if it's not a retina screen
        if ( window.devicePixelRatio < 2 ) {
            return;
        }
		
        this.slider.addEventListener( 'resize.' + this.namespace, this.resizeHandler.bind( this ) );

        if ( typeof this.slider.thumbnails !== 'undefined' ) {
            this.slider.thumbnails.addEventListener( 'thumbnailsUpdate.' + this.namespace, this.thumbnailsUpdateHandler.bind( this ) );
        }
    }

    // Loop through the slides and replace the images with their retina version
    resizeHandler() {
        this.slider.slides.forEach( ( slide ) => {
            const slideEl = slide.slideEl;
			
            if ( slideEl.getAttribute( 'data-retina-loaded' ) === null ) {
                slideEl.setAttribute( 'data-retina-loaded', true );
				
                Array.from( slideEl.querySelectorAll( 'img[data-retina]' ) ).forEach( ( imageEl ) => {
                    if ( imageEl.getAttribute( 'data-src' ) !== null ) {
                        imageEl.setAttribute( 'data-src', imageEl.getAttribute( 'data-retina' ) );
                        imageEl.removeAttribute( 'data-retina' );
                    } else {
                        this.loadImage( imageEl, ( newImageEl ) => {
                            if ( newImageEl.classList.contains( 'sp-image' ) ) {
                                slide.mainImageEl = newImageEl;
                                slide.resizeMainImage( true );
                            }
                        });
                    }
                });
            }
        });
    }

    // Loop through the thumbnails and replace the images with their retina version
    thumbnailsUpdateHandler() {
        this.slider.thumbnails.thumbnails.forEach( ( thumbnail ) => {
            const thumbnailContainerEl = thumbnail.thumbnailContainerEl;

            if ( thumbnailContainerEl.getAttribute( 'data-retina-loaded' ) === null ) {
                thumbnailContainerEl.setAttribute( 'data-retina-loaded', true );

                Array.from( thumbnailContainerEl.querySelectorAll( 'img[data-retina]' ) ).forEach( ( imageEl ) => {
                    if ( imageEl.getAttribute( 'data-src' ) !== null ) {
                        imageEl.setAttribute( 'data-src', imageEl.getAttribute( 'data-retina' ) );
                    } else {
                        this.loadImage( imageEl, ( newImageEl ) => {
                            if ( newImageEl.classList.contains( 'sp-thumbnail' ) ) {
                                thumbnail.resizeImage();
                            }
                        });
                    }
                });
            }
        });
    }

    // Load the retina image
    loadImage( imageEl, callback ) {
        let retinaFound = false,
            newImagePath = '';

        // Check if there is a retina image specified
        if ( imageEl.getAttribute( 'data-retina' ) !== null ) {
            retinaFound = true;

            newImagePath = imageEl.getAttribute( 'data-retina' );
        }

        // Check if there is a lazy loaded, non-retina, image specified
        if ( imageEl.getAttribute( 'data-src' ) !== null ) {
            if ( retinaFound === false ) {
                newImagePath = imageEl.getAttribute( 'data-src') ;
            }

            imageEl.removeAttribute('data-src');
        }

        // Return if there isn't a retina or lazy loaded image
        if ( newImagePath === '' ) {
            return;
        }

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

        // Add the new image in the same container and remove the older image
        imageEl.after( newImageEl );
        imageEl.remove();
        imageEl = null;

        // Assign the source of the image
        newImageEl.setAttribute( 'src', newImagePath );

        if ( typeof callback === 'function' ) {
            callback( newImageEl );
        }
    }

    // Destroy the module
    destroy() {
        this.slider.removeEventListener( 'update.' + this.namespace );
        this.slider.removeEventListener( 'thumbnailsUpdate.' + this.namespace );
    }
}

export default Retina;