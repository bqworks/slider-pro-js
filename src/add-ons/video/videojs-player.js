import Player from './player.js';

class VideoJSPlayer extends Player {

    constructor( videoEl ) {
        super( videoEl );
    }

    static isType( videoEl ) {
        if ( ( videoEl.getAttribute( 'data-videojs-id' ) !== null || videoEl.classList.contains( 'video-js' ) ) && typeof window.videojs !== 'undefined' ) {
            return true;
        }

        return false;
    }

    init() {
        const videoID = this.videoEl.classList.contains( 'video-js' ) ? this.videoEl.getAttribute( 'id' ) : this.videoEl.getAttribute( 'data-videojs-id' );

        this.player = window.videojs( videoID );

        this.player.ready(() => {
            this.ready = true;
            this.dispatchEvent( 'ready' );

            this.player.on( 'play', () => {
                if ( this.started === false ) {
                    this.started = true;
                    this.dispatchEvent( 'start' );
                }

                this.state = 'playing';
                this.dispatchEvent( 'play' );
            });
			
            this.player.on( 'pause', () => {
                this.state = 'paused';
                this.dispatchEvent( 'pause' );
            });
			
            this.player.on( 'ended', () => {
                this.state = 'ended';
                this.dispatchEvent( 'ended' );
            });
        });
    }

    play() {
        this.player.play();
    }

    pause() {
        this.player.pause();
    }

    stop() {
        this.player.currentTime( 0 );
        this.player.pause();
        this.state = 'stopped';
    }

    replay() {
        this.player.currentTime( 0 );
        this.player.play();
    }
}

export default VideoJSPlayer;