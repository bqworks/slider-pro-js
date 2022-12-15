class LazyLoading {

    // The namespace to be used when adding event listeners
    namespace = 'lazyloading';

    // Reference to the base slider instance
    slider;

    // Indicates whether 
    allowLazyLoadingCheck = true;

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        // The 'resize' event is fired after every update, so it's possible to use it for checking
        // if the update made new slides become visible
        // 
        // Also, resizing the slider might make new slides or thumbnails visible
        this.slider.addEventListener( 'resize.' + this.namespace, this.resizeHandler.bind( this ) );

        // Check visible images when a new slide is selected
        this.slider.addEventListener( 'gotoSlide.' + this.namespace, this.checkAndLoadVisibleImages.bind( this ) );

        // Check visible thumbnail images when the thumbnails are updated because new thumbnail
        // might have been added or the settings might have been changed so that more thumbnail
        // images become visible
        // 
        // Also, check visible thumbnail images after the thumbnails have moved because new thumbnails might
        // have become visible
        if ( typeof this.slider.thumbnails !== 'undefined' ) {
            this.slider.thumbnails.addEventListener( 'thumbnailsUpdate.' + this.namespace, this.checkAndLoadVisibleThumbnailImages.bind( this ) );
            this.slider.thumbnails.addEventListener( 'thumbnailsMoveComplete.' + this.namespace, this.checkAndLoadVisibleThumbnailImages.bind( this ) );
        }
    }

    resizeHandler() {
        if ( this.allowLazyLoadingCheck === false ) {
            return;
        }

        this.allowLazyLoadingCheck = false;
		
        this.checkAndLoadVisibleImages();

        if ( this.slider.sliderEl.getElementsByClassName( 'sp-thumbnail' ).length !== 0 ) {
            this.checkAndLoadVisibleThumbnailImages();
        }

        // Use a timer to deffer the loading of images in order to prevent too many
        // checking attempts
        setTimeout(() => {
            this.allowLazyLoadingCheck = true;
        }, 500 );
    }

    // Check visible slides and load their images
    checkAndLoadVisibleImages() {
        if ( this.slider.sliderEl.querySelectorAll( '.sp-slide:not([ data-loaded ])' ).length === 0 ) {
            return;
        }

        const sizeProperty = this.slider.settings.orientation === 'horizontal' ? 'width' : 'height';
        const positionProperty = this.slider.settings.orientation === 'horizontal' ? 'left' : 'top';
        const middleSlidePosition = parseInt( ( this.slider.slidesOrder.length - 1 ) / 2, 10 );

        let slidesSize = 0,
            averageSlideSize = 0;

        if ( this.slider.settings.autoSlideSize === true ) {
            const firstSlide = this.slider.slidesEl.getElementsByClassName( 'sp-slide' )[ this.slider.slidesOrder[ 0 ] ],
                firstSlidePosition = parseInt( firstSlide.style[ positionProperty ], 10 ),
                lastSlide = this.slider.slidesEl.getElementsByClassName( 'sp-slide' )[ this.slider.slidesOrder[ this.slider.slidesOrder.length - 1 ] ],
                lastSlidePosition = parseInt( lastSlide.style[ positionProperty ], 10 ) + ( this.slider.settings.rightToLeft === true && this.slider.settings.orientation === 'horizontal' ? -1 : 1 ) * parseInt( window.getComputedStyle( lastSlide )[ sizeProperty ], 10 );
			
            slidesSize = Math.abs( lastSlidePosition - firstSlidePosition );
            averageSlideSize = Math.round( slidesSize / this.slider.slides.length );
        } else {
            slidesSize = ( ( this.slider.settings.orientation === 'horizontal' ? this.slider.slideWidth : this.slider.slideHeight ) + this.slider.settings.slideDistance ) * this.slider.slides.length - this.slider.settings.slideDistance;
            averageSlideSize = this.slider.settings.orientation === 'horizontal' ? this.slider.slideWidth : this.slider.slideHeight;
        }

        // Use either the middle position or the index of the selected slide as a reference, depending on
        // whether the slider is loopable
        const referencePosition = this.slider.settings.loop === true ? middleSlidePosition : this.slider.selectedSlideIndex,

            // Calculate how many slides are visible at the sides of the selected slide
            visibleOnSides = Math.ceil( ( parseInt( this.slider.slidesMaskEl.style[ sizeProperty ], 10) - averageSlideSize ) / 2 / averageSlideSize ),

            // Calculate the indexes of the first and last slide that will be checked
            from = this.slider.settings.centerSelectedSlide === true ? Math.max( referencePosition - visibleOnSides - 1, 0 ) : Math.max( referencePosition - 1, 0 ),
            to = this.slider.settings.centerSelectedSlide === true ? Math.min( referencePosition + visibleOnSides + 1, this.slider.getTotalSlides() - 1 ) : Math.min( referencePosition + visibleOnSides * 2 + 1, this.slider.getTotalSlides() - 1  ),
			
            // Get all the slides that need to be checked
            slidesToCheck = this.slider.slidesOrder.slice( from, to + 1 );

        // Loop through the selected slides and if the slide is not marked as having
        // been loaded yet, loop through its images and load them.
        slidesToCheck.forEach( ( slideIndex ) => {
            const slide = this.slider.slides[ slideIndex ],
                slideEl = slide.slideEl;

            if ( slideEl.getAttribute( 'data-loaded' ) === null ) {
                slideEl.setAttribute( 'data-loaded', true );

                Array.from( slideEl.querySelectorAll( 'img[ data-src ]' ) ).forEach(( imgEl ) => {
                    this.loadImage( imgEl, ( newImageEl ) => {
                        if ( newImageEl.classList.contains( 'sp-image' ) ) {
                            slide.mainImageEl = newImageEl;
                            slide.resizeMainImage( true );
                        }
                    });
                });
            }
        });
    }

    // Check visible thumbnails and load their images
    checkAndLoadVisibleThumbnailImages() {
        if ( this.slider.sliderEl.querySelectorAll( '.sp-thumbnail-container:not([ data-loaded ])' ).length === 0 ) {
            return;
        }

        const thumbnailSize = this.slider.thumbnails.thumbnailsSize / this.slider.thumbnails.thumbnails.length,

            // Calculate the indexes of the first and last thumbnail that will be checked
            from = Math.floor( Math.abs( this.slider.thumbnails.thumbnailsPosition / thumbnailSize ) ),
            to = Math.floor( ( - this.slider.thumbnails.thumbnailsPosition + this.slider.thumbnails.thumbnailsContainerSize ) / thumbnailSize ),

            // Get all the thumbnails that need to be checked
            thumbnailsToCheck = this.slider.thumbnails.thumbnails.slice( from, to + 1 );

        // Loop through the selected thumbnails and if the thumbnail is not marked as having
        // been loaded yet, load its image.
        thumbnailsToCheck.forEach( ( thumbnail ) => {
            const thumbnailContainerEl = thumbnail.thumbnailContainerEl;

            if ( thumbnailContainerEl.getAttribute( 'data-loaded' ) === null ) {
                thumbnailContainerEl.setAttribute( 'data-loaded', true );

                Array.from( thumbnailContainerEl.querySelectorAll( 'img[ data-src ]' ) ).forEach( ( imageEl) => {
                    this.loadImage( imageEl, () => {
                        thumbnail.resizeImage();
                    });
                });
            }
        });
    }

    // Load an image
    loadImage( imageEl, callback ) {
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

        // Assign the source of the image
        newImageEl.setAttribute( 'src', imageEl.getAttribute( 'data-src' ) );
        newImageEl.removeAttribute( 'data-src' );

        if ( imageEl.getAttribute( 'data-srcset' ) !== null ) {
            newImageEl.setAttribute( 'srcset', imageEl.getAttribute( 'data-srcset' ) );
            newImageEl.removeAttribute( 'data-srcset' );
        }

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
        this.slider.removeEventListener( 'gotoSlide.' + this.namespace );
        this.slider.removeEventListener( 'resize.' + this.namespace );
        this.slider.thumbnails.removeEventListener( 'thumbnailsUpdate.' + this.namespace );
        this.slider.thumbnails.removeEventListener( 'thumbnailsMoveComplete.' + this.namespace );
    }
}

export default LazyLoading;