import Player from '../../src/add-ons/video/player.js';

class VideoPlayerMock extends Player {

    constructor( videoEl ) {
        super( videoEl );
    }

    static isType( videoEl ) {
        if ( videoEl.classList.contains( 'mock-video' ) ) {
            return true;
        }

        return false;
    }

    init() {
        // Get a reference to the player
        this.player = this.videoEl;

        this.ready = true;
        this.dispatchEvent( 'ready' );

        this.player.addEventListener( 'play', () => {
            if ( this.started === false ) {
                this.started = true;
                this.dispatchEvent( 'start' );
            }

            this.state = 'playing';
            this.dispatchEvent( 'play' );
        });

        this.player.addEventListener( 'pause', () => {
            this.state = 'paused';
            this.dispatchEvent( 'pause' );
        });

        this.player.addEventListener( 'ended', () => {
            this.state = 'ended';
            this.dispatchEvent( 'ended' );
        });
    }

    play() {
        this.player.dispatchEvent( new Event( 'play' ) );
    }

    pause() {
        this.player.dispatchEvent( new Event( 'pause' ) );
    }

    stop() {
        this.player.dispatchEvent( new Event( 'pause' ) );
        this.state = 'stopped';
    }

    replay() {
        this.player.dispatchEvent( new Event( 'play' ) );
    }
}

export default VideoPlayerMock;
