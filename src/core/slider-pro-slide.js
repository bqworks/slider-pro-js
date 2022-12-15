import { checkImagesComplete, checkImagesStatus, resolveUnit } from '../helpers/util.js';
import CustomEventTarget from '../helpers/custom-event-target.js';

class SliderProSlide extends CustomEventTarget {

    // Index of the slide
    #index;

    // Reference to the slide element
    slideEl;

    // Reference to the main slide image
    mainImageEl;

    // Reference to the container that will hold the main image
    imageContainerEl;

    // Indicates whether the slide has a main image
    hasMainImage = false;

    // Indicates whether the main image is loaded
    isMainImageLoaded = false;

    // Indicates whether the main image is in the process of being loaded
    isMainImageLoading = false;

    // Indicates whether the slide has any image. There could be other images (i.e., in layers)
    // besides the main slide image.
    hasImages = false;

    // Indicates if all the images in the slide are loaded
    areImagesLoaded = false;

    // Indicates if the images inside the slide are in the process of being loaded
    areImagesLoading = false;

    // The width and height of the slide
    width = 0;
    height = 0;

    // Reference to the global settings of the slider
    // Stores the current settings of the slider
    settings;

    constructor( slide, settings ) {
        super();

        this.slideEl = slide;
        this.settings = settings;

        // Initialize the slide
        this.init();
    }

    // The starting point for the slide
    init() {
        // Mark the slide as initialized
        this.slideEl.setAttribute( 'data-init', true );

        // Get the main slide image if there is one
        this.mainImageEl = this.slideEl.getElementsByClassName( 'sp-image' )[0] || null;

        // If there is a main slide image, create a container for it and add the image to this container.
        // The container will allow the isolation of the image from the rest of the slide's content. This is
        // helpful when you want to show some content below the image and not cover it.
        if ( this.mainImageEl !== null ) {
            this.hasMainImage = true;

            this.imageContainerEl = document.createElement( 'div' );
            this.imageContainerEl.classList.add( 'sp-image-container' );
            this.slideEl.insertBefore( this.imageContainerEl, this.slideEl.firstChild );

            if ( this.mainImageEl.parentElement.tagName === 'A' ) {
                this.imageContainerEl.appendChild( this.mainImageEl.parentElement );
            } else {
                this.imageContainerEl.appendChild( this.mainImageEl );
            }
        }

        this.hasImages = this.slideEl.getElementsByTagName( 'img' ).length !== 0 ? true : false;
    }

    // Set the size of the slide
    setSize( width, height ) {
        this.width = width;
        this.height = height;

        this.slideEl.style.width = resolveUnit( this.width );
        this.slideEl.style.height = resolveUnit( this.height );

        if ( this.hasMainImage === true ) {

            // Initially set the width and height of the container to the width and height
            // specified in the settings. This will prevent content overflowing if the width or height
            // are 'auto'. The 'auto' value will be passed only after the image is loaded.
            this.imageContainerEl.style.width = resolveUnit( this.settings.width );
            this.imageContainerEl.style.height = resolveUnit( this.settings.height );

            // Resize the main image if it's loaded. If the 'data-src' attribute is present it means
            // that the image will be lazy-loaded
            if ( this.mainImageEl.hasAttribute( 'data-src' ) === false ) {
                this.resizeMainImage();
            }
        }
    }

    // Get the size (width and height) of the slide
    getSize() {
        // Check if all images have loaded, and if they have, return the size, else, return
        // the original width and height of the slide
        if ( this.hasImages === true && this.areImagesLoaded === false && this.areImagesLoading === false ) {
            this.areImagesLoading = true;
            
            let status = checkImagesStatus( this.slideEl );

            if ( status !== 'complete' ) {
                checkImagesComplete( this.slideEl ).then(() => {
                    this.areImagesLoaded = true;
                    this.areImagesLoading = false;
                    this.dispatchEvent( 'imagesLoaded', { index: this.index } );
                });

                // if the image is not loaded yet, return the original width and height of the slider
                return {
                    width: this.settings.width,
                    height: this.settings.height
                };
            }
        }

        const { width, height } = this.calculateSize();

        return {
            width,
            height
        };
    }

    // Calculate the width and height of the slide by going
    // through all the child elements and measuring their 'bottom'
    // and 'right' properties. The element with the biggest
    // 'right'/'bottom' property will determine the slide's
    // width/height.
    calculateSize() {
        let width = this.slideEl.clientWidth,
            height = this.slideEl.clientHeight;
        
        Array.from( this.slideEl.children ).forEach( ( childEl ) => {
            if ( childEl.style.visibility === 'hidden' || childEl.style.display === 'none' ) {
                return;
            }

            const { left, right, top, bottom } = childEl.getBoundingClientRect();
            const bottomEdge = childEl.offsetTop + ( bottom - top );
            const rightEdge = childEl.offsetLeft + ( right - left );

            if ( bottomEdge > height ) {
                height = bottomEdge;
            }

            if ( rightEdge > width ) {
                width = rightEdge;
            }
        });

        return {
            width,
            height
        };
    }

    // Resize the main image.
    // 
    // Call this when the slide resizes or when the main image has changed to a different image.
    resizeMainImage( isNewImage ) {
        // If the main image has changed, reset the 'flags'
        if ( isNewImage === true ) {
            this.isMainImageLoaded = false;
            this.isMainImageLoading = false;
        }

        // If the image was not loaded yet and it's not in the process of being loaded, load it
        if ( this.isMainImageLoaded === false && this.isMainImageLoading === false ) {
            this.isMainImageLoading = true;

            checkImagesComplete( this.mainImageEl ).then( () => {
                this.isMainImageLoaded = true;
                this.isMainImageLoading = false;
                this.resizeMainImage();
                this.dispatchEvent( 'imagesLoaded', { index: this.index } );
            });

            return;
        }

        // Set the size of the image container element to the proper 'width' and 'height'
        // values, as they were calculated. Previous values were the 'width' and 'height'
        // from the settings.
        this.imageContainerEl.style.width = resolveUnit( this.width );
        this.imageContainerEl.style.height = resolveUnit( this.height );

        if ( this.settings.allowScaleUp === false ) {
            // reset the image to its natural size
            this.mainImageEl.style.removeProperty( 'width' );
            this.mainImageEl.style.removeProperty( 'height' );
            this.mainImageEl.style.removeProperty( 'max-width' );
            this.mainImageEl.style.removeProperty( 'max-height' );

            // set the boundaries
            this.mainImageEl.style.maxWidth = resolveUnit( this.mainImageEl.clientWidth );
            this.mainImageEl.style.maxHeight = resolveUnit( this.mainImageEl.clientHeight );
        }

        // After the main image has loaded, resize it
        if ( this.settings.autoSlideSize === true ) {
            this.mainImageEl.style.removeProperty( 'margin-left' );
            this.mainImageEl.style.removeProperty( 'margin-top' );

            if ( this.settings.orientation === 'horizontal' ) {
                this.mainImageEl.style.width = 'auto';
                this.mainImageEl.style.height = '100%';

                // resize the slide's width to a fixed value instead of 'auto', to
                // prevent incorrect sizing caused by links added to the main image
                this.slideEl.style.width = resolveUnit( this.mainImageEl.clientWidth );
            } else if ( this.settings.orientation === 'vertical' ) {
                this.mainImageEl.style.width = '100%';
                this.mainImageEl.style.height = 'auto';

                // resize the slide's height to a fixed value instead of 'auto', to
                // prevent incorrect sizing caused by links added to the main image
                this.slideEl.style.height = this.mainImageEl.height;
            }
        } else if ( this.settings.autoHeight === true ) {
            this.mainImageEl.style.width = '100%';
            this.mainImageEl.style.height = 'auto';

            if ( this.settings.centerImage === true ) {
                this.mainImageEl.style.marginLeft = resolveUnit( ( this.imageContainerEl.clientWidth - this.mainImageEl.clientWidth ) * 0.5 );
            }
        } else {
            if ( this.settings.imageScaleMode === 'cover' ) {
                if ( this.mainImageEl.clientWidth / this.mainImageEl.clientHeight <= this.slideEl.clientWidth / this.slideEl.clientHeight ) {
                    this.mainImageEl.style.width = '100%';
                    this.mainImageEl.style.height = 'auto';
                } else {
                    this.mainImageEl.style.width = 'auto';
                    this.mainImageEl.style.height = '100%';
                }
            } else if ( this.settings.imageScaleMode === 'contain' ) {
                if ( this.mainImageEl.clientWidth / this.mainImageEl.clientHeight >= this.slideEl.clientWidth / this.slideEl.clientHeight ) {
                    this.mainImageEl.style.width = '100%';
                    this.mainImageEl.style.height = 'auto';
                } else {
                    this.mainImageEl.style.width = 'auto';
                    this.mainImageEl.style.height = '100%';
                }
            } else if ( this.settings.imageScaleMode === 'exact' ) {
                this.mainImageEl.style.width = '100%';
                this.mainImageEl.style.height = 'auto';
            }

            if ( this.settings.centerImage === true ) {
                this.mainImageEl.style.marginLeft = resolveUnit( ( this.imageContainerEl.clientWidth - this.mainImageEl.clientWidth ) * 0.5 );
                this.mainImageEl.style.marginTop = resolveUnit( ( this.imageContainerEl.clientHeight - this.mainImageEl.clientHeight ) * 0.5 );
            }
        }
    }

    // Destroy the slide
    destroy() {
        // Clean the slide element from attached styles and data
        this.slideEl.removeAttribute( 'style' );
        this.slideEl.removeAttribute( 'data-init' );
        this.slideEl.removeAttribute( 'data-index' );
        this.slideEl.removeAttribute( 'data-loaded' );

        // If there is a main image, remove its container
        if ( this.hasMainImage === true ) {
            this.mainImageEl.removeAttribute( 'style' );
            this.slideEl.appendChild( this.mainImageEl );

            this.imageContainerEl.remove();
        }
    }

    // Return the index of the slide
    get index() {
        return this.#index;
    }

    // Set the index of the slide
    set index( index ) {
        this.#index = index;
        this.slideEl.setAttribute( 'data-index', this.#index );
    }
}

export default SliderProSlide;