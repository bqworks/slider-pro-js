import VideoController from './video-controller.js';

class Video {

    // The namespace to be used when adding event listeners
    namespace = 'video';

    // Reference to the base slider instance
    slider = null;

    // Stores the current settings of the slider
    settings = null;

    firstInit = false;

    videoReferences = {};

    preinitVideoClickHandler = null;

    // Default add-on settings
    defaults = {

        // Sets the action that the video will perform when its slide container is selected
        // ( 'playVideo' and 'none' )
        reachVideoAction: 'none',

        // Sets the action that the video will perform when another slide is selected
        // ( 'stopVideo', 'pauseVideo', 'removeVideo' and 'none' )
        leaveVideoAction: 'pauseVideo',

        // Sets the action that the slider will perform when the video starts playing
        // ( 'stopAutoplay' and 'none' )
        playVideoAction: 'stopAutoplay',

        // Sets the action that the slider will perform when the video is paused
        // ( 'startAutoplay' and 'none' )
        pauseVideoAction: 'none',

        // Sets the action that the slider will perform when the video ends
        // ( 'startAutoplay', 'nextSlide', 'replayVideo' and 'none' )
        endVideoAction: 'none'
    };

    constructor( slider ) {
        this.slider = slider;

        this.init();
    }

    init() {
        this.slider.addEventListener( 'update.' + this.namespace, this.updateHandler.bind( this ) );
        this.slider.addEventListener( 'gotoSlide.' + this.namespace, this.gotoSlideHandler.bind( this ) );
        this.slider.addEventListener( 'gotoSlideComplete.' + this.namespace, this.gotoSlideCompleteHandler.bind( this ) );
    }

    updateHandler() {
        this.settings = { ...this.defaults, ...this.slider.settings };

        // Find all the inline videos and initialize them
        Array.from( this.slider.sliderEl.querySelectorAll( '.sp-video:not(a):not([data-video-init])' ) ).forEach(( videoEl ) => {
            this.initVideo( videoEl );
        });

        // Find all the lazy-loaded videos and preinitialize them. They will be initialized
        // only when their play button is clicked.
        Array.from( this.slider.sliderEl.querySelectorAll( 'a.sp-video:not([data-video-preinit])' ) ).forEach(( videoEl ) => {
            this.preinitVideo( videoEl );
        });

        // call the 'gotoSlideComplete' method in case the first slide contains a video that
        // needs to play automatically
        if ( this.firstInit === false ) {
            this.firstInit = true;
            this.gotoSlideCompleteHandler( { index: this.slider.selectedSlideIndex, previousIndex: -1 } );
        }
    }

    // Initialize the target video
    initVideo( videoEl ) {
        videoEl.setAttribute( 'data-video-init', true );

        const video = new VideoController( videoEl );
        const videoReference = ( parseInt( new Date().valueOf(), 10 ) * Math.floor( Math.random() * 1000 ) ).toString();

        videoEl.setAttribute( 'data-video-ref', videoReference );
        this.videoReferences[ videoReference ] = video;

        // When the video starts playing, pause the autoplay if it's running
        video.addEventListener( 'videoPlay', () => {
            if ( this.settings.playVideoAction === 'stopAutoplay' && typeof this.slider.autoplay !== 'undefined' ) {
                this.slider.autoplay.stop();
                this.settings.autoplay = false;
                this.slider.autoplay.settings.autoplay = false;
            }
        });

        // When the video is paused, restart the autoplay
        video.addEventListener( 'videoPause', () => {
            if ( this.settings.pauseVideoAction === 'startAutoplay' && typeof this.slider.autoplay !== 'undefined' ) {
                this.settings.autoplay = true;
                this.slider.autoplay.settings.autoplay = true;
                this.slider.autoplay.stop();
                this.slider.autoplay.start();
            }
        });

        // When the video ends, restart the autoplay (which was paused during the playback), or
        // go to the next slide, or replay the video
        video.addEventListener( 'videoEnded', () => {
            if ( this.settings.endVideoAction === 'startAutoplay' && typeof this.slider.autoplay !== 'undefined' ) {
                this.settings.autoplay = true;
                this.slider.autoplay.settings.autoplay = true;
                this.slider.autoplay.stop();
                this.slider.autoplay.start();
            } else if ( this.settings.endVideoAction === 'nextSlide' ) {
                this.slider.nextSlide();
            } else if ( this.settings.endVideoAction === 'replayVideo' ) {
                video.replay();
            }
        });
    }

    // Pre-initialize the video. This is for lazy loaded videos.
    preinitVideo( videoEl ) {
        videoEl.setAttribute( 'data-video-preinit', true );

        // When the video poster is clicked, remove the poster and create
        // the inline video
        this.preinitVideoClickHandler = ( event ) => {
            let videoEl = event.target;

            // If the video is being dragged, don't start the video
            if ( this.slider.sliderEl.classList.contains( 'sp-swiping' ) || 
                videoEl.parentElement.querySelector( '.sp-video[data-video-init]' ) !== null ) {
                return;
            }

            event.preventDefault();

            let href = videoEl.getAttribute( 'href' ),
                iframe,
                provider,
                regExp,
                match,
                id,
                src,
                videoAttributes,
                videoPoster = videoEl.getElementsByTagName( 'img' )[0],
                videoWidth = videoPoster.getAttribute( 'width' ) || videoPoster.clientWidth,
                videoHeight = videoPoster.getAttribute( 'height') || videoPoster.clientHeight;

            // Check if it's a youtube or vimeo video
            if ( href.indexOf( 'youtube' ) !== -1 || href.indexOf( 'youtu.be' ) !== -1 ) {
                provider = 'youtube';
            } else if ( href.indexOf( 'vimeo' ) !== -1 ) {
                provider = 'vimeo';
            }

            // Get the id of the video
            regExp = provider === 'youtube' ? /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/ : /(www\.)?vimeo.com\/(\d+)/;
            match = href.match( regExp );
            id = match[2];

            // Get the source of the iframe that will be created
            src = provider === 'youtube' ? '//www.youtube.com/embed/' + id + '?enablejsapi=1&wmode=opaque' : '//player.vimeo.com/video/'+ id;
            
            // Get the attributes passed to the video link and then pass them to the iframe's src
            videoAttributes = href.split( '?' )[ 1 ];

            if ( typeof videoAttributes !== 'undefined' ) {
                videoAttributes = videoAttributes.split( '&' );

                videoAttributes.forEach( ( value ) => {
                    if ( value.indexOf( id ) === -1 ) {
                        src += '&' + value;
                    }
                });
            }

            // Create the iframe
            iframe = document.createElement( 'iframe' );
            iframe.setAttribute( 'src', src );
            iframe.setAttribute( 'width', videoWidth );
            iframe.setAttribute( 'height', videoHeight );
            iframe.setAttribute( 'class', videoEl.getAttribute( 'class' ) );
            iframe.setAttribute( 'frameborder', 0 );
            iframe.setAttribute( 'allowfullscreen', 'allowfullscreen' );
            videoEl.parentElement.insertBefore( iframe, videoEl );

            // Initialize the video and play it
            this.initVideo( iframe );

            const player = this.videoReferences[ iframe.getAttribute( 'data-video-ref' ) ];
            player.play();

            // Hide the video poster
            videoEl.style.display = 'none';
        };

        videoEl.addEventListener( 'click', this.preinitVideoClickHandler );
    }

    // Called when a new slide is selected
    gotoSlideHandler( event ) {
        if ( event.detail.previousIndex === -1 ) {
            return;
        }

        // Get the video from the previous slide
        const previousVideoEl = this.slider.slidesEl.getElementsByClassName( 'sp-slide' )[ event.detail.previousIndex ].querySelector( '.sp-video[data-video-init]' );
		
        if ( previousVideoEl === null ) {
            return;
        }

        const previousVideo = this.videoReferences[ previousVideoEl.getAttribute( 'data-video-ref' ) ];
        
        // Handle the video from the previous slide by stopping it, or pausing it,
        // or remove it, depending on the value of the 'leaveVideoAction' option.
        if ( previousVideo !== null ) {
            if ( this.settings.leaveVideoAction === 'stopVideo' ) {
                previousVideo.stop();
            } else if ( this.settings.leaveVideoAction === 'pauseVideo' ) {
                previousVideo.pause();
            } else if ( this.settings.leaveVideoAction === 'removeVideo' ) {
                // If the video was lazy-loaded, remove it and show the poster again. If the video
                // was not lazy-loaded, but inline, stop the video.
                if ( previousVideoEl.parentElement.querySelector( 'a.sp-video' ) !== null ) {

                    previousVideoEl.parentElement.querySelector( 'a.sp-video' ).style.removeProperty( 'display' );
                    previousVideo.destroy();
                    previousVideoEl.remove();
                } else {
                    previousVideo.stop();
                }
            }
        }
    }

    // Called when a new slide is selected, 
    // after the transition animation is complete.
    gotoSlideCompleteHandler( event ) {

        // Handle the video from the selected slide
        if ( this.settings.reachVideoAction === 'playVideo' && event.detail.index === this.slider.selectedSlideIndex ) {
            const loadedVideoEl = this.slider.slidesEl.getElementsByClassName( 'sp-slide' )[ event.detail.index ].querySelector( '.sp-video[data-video-init]' ),
                unloadedVideoEl = this.slider.slidesEl.getElementsByClassName( 'sp-slide' )[ event.detail.index ].querySelector( '.sp-video[data-video-preinit]' );

            // If the video was already initialized, play it. If it's not initialized (because
            // it's lazy loaded) initialize it and play it.
            if ( loadedVideoEl !== null ) {
                const loadedVideo = this.videoReferences[ loadedVideo.getAttribute( 'data-video-ref' ) ];
                loadedVideo.play();
            } else if ( unloadedVideoEl !== null) {
                unloadedVideoEl.dispatchEvent( 'click' );
            }

            // Autoplay is stopped when the video starts playing
            // and the video's 'play' event is fired, but on slower connections,
            // the video's playing will be delayed and the 'play' event
            // will not fire in time to stop the autoplay, so we'll
            // stop it here as well.
            if ( this.settings.playVideoAction === 'stopAutoplay' && typeof this.slider.autoplay !== 'undefined' ) {
                this.slider.autoplay.stop();
                this.settings.autoplay = false;
                this.slider.autoplay.settings.autoplay = false;
            }
        }
    }

    // Destroy the module
    destroy() {
        Array.from( this.slider.sliderEl.querySelectorAll( '.sp-video[ data-video-preinit ]' ) ).forEach( ( videoEl ) => {
            videoEl.removeAttribute( 'data-video-preinit' );
            videoEl.removeEventListener( 'click', this.preinitVideoClickHandler );
        });

        // Loop through all the videos and destroy them
        Array.from( this.slider.sliderEl.querySelectorAll( '.sp-video[ data-video-init ]' ) ).forEach( ( videoEl ) => {
            videoEl.removeAttribute( 'data-video-init' );
			
            const video = this.videoReferences[ videoEl.getAttribute( 'data-video-ref' ) ];
            video.removeEventListener( 'videoPlay' );
            video.removeEventListener( 'videoPause' );
            video.removeEventListener( 'videoEnded' );
            video.destroy();

            videoEl.removeAttribute( 'data-video-ref' );

            if ( videoEl.parentElement.querySelector( '.sp-video[ data-video-preinit ]' ) !== null ) {
                videoEl.remove();
            }
        });

        this.videoReferences.length = 0;

        this.slider.removeEventListener( 'update.' + this.namespace );
        this.slider.removeEventListener( 'gotoSlide.' + this.namespace );
        this.slider.removeEventListener( 'gotoSlideComplete.' + this.namespace );
    }
}

export default Video;
