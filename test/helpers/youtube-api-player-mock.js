class YouTubeAPIPlayerMock {

    videoEl = null;

    playerState = null;

    position = 1;

    options = {
        events: {
            onReady: null,
            onStateChange: null
        }
    };

    constructor( videoEl, options = null ) {
        this.videoEl = videoEl;

        if ( options !== null ) {
            this.options = options;
        }

        this.videoEl.addEventListener( 'play', () => {
            this.playVideo();
        });

        this.videoEl.addEventListener( 'pause', () => {
            this.pauseVideo();
        });

        this.videoEl.addEventListener( 'ended', () => {
            this.end();
        });

        if ( this.options.events.onReady !== null ) {
            this.options.events.onReady();
        }
    }

    playVideo() {
        this.playerState = window.YT.PlayerState.PLAYING;

        if ( this.options.events.onStateChange !== null ) {
            this.options.events.onStateChange( { data: this.playerState } );
        }
    }

    pauseVideo() {
        this.playerState = window.YT.PlayerState.PAUSED;
        
        if ( this.options.events.onStateChange !== null ) {
            this.options.events.onStateChange( { data: this.playerState } );
        }
    }

    stopVideo() {

    }

    seekTo( value ) {
        this.position = value;
    }

    end() {
        this.playerState = window.YT.PlayerState.ENDED;
        
        if ( this.options.events.onStateChange !== null ) {
            this.options.events.onStateChange( { data: this.playerState } );
        }
    }
}

export default YouTubeAPIPlayerMock;
