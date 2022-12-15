import Player from './player.js';

class HTML5Player extends Player {
	
    constructor( videoEl ) {
        super( videoEl );
    }

    static isType( videoEl ) {
        if ( videoEl.tagName === 'VIDEO' ) {
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
        if ( this.ready === true ) {
            this.player.play();
        } else {
            const timer = setInterval(() => {
                if ( this.ready === true ) {
                    clearInterval( timer );
                    this.player.play();
                }
            }, 100 );
        }
    }

    pause() {
        this.player.pause();
    }

    stop() {
        this.player.currentTime = 0;
        this.player.pause();
        this.state = 'stopped';
    }

    replay() {
        this.player.currentTime = 0;
        this.player.play();
    }
}

export default HTML5Player;