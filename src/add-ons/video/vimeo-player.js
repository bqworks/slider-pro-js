import Player from './player.js';

class VimeoPlayer extends Player {

    static vimeoAPIAdded = false;

    static vimeoVideos = [];

    constructor( videoEl ) {
        super( videoEl );
    }

    static isType( videoEl ) {
        if ( videoEl.tagName === 'IFRAME' ) {
            const src = videoEl.getAttribute('src');

            if ( src.indexOf( 'vimeo.com' ) !== -1 ) {
                return true;
            }
        }

        return false;
    }

    init() {
        this.isInit = false;

        if ( typeof window.Vimeo !== 'undefined' ) {
            this.setup();
        } else {
            VimeoPlayer.vimeoVideos.push( this );

            if ( VimeoPlayer.vimeoAPIAdded === false ) {
                VimeoPlayer.vimeoAPIAdded = true;

                const tag = document.createElement('script');
                tag.src = '//player.vimeo.com/api/player.js';
				
                const firstScriptTag = document.getElementsByTagName( 'script' )[0];
                firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
			
                let checkVimeoAPITimer = setInterval(() => {
                    if ( typeof window.Vimeo !== 'undefined' ) {
                        clearInterval( checkVimeoAPITimer );
						
                        VimeoPlayer.vimeoVideos.forEach( ( video ) => {
                            video.setup();
                        });
                    }
                }, 100 );
            }
        }
    }

    setup() {
        this.isInit = true;
		
        // Get a reference to the player
        this.player = new window.Vimeo.Player( this.videoEl );
		
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
        this.player.setCurrentTime( 0 ).then( () => {
            this.player.pause();
            this.state = 'stopped';
        } );
    }

    replay() {
        this.player.setCurrentTime( 0 ).then( () => {
            this.player.play();
        } );
    }

    addEventListener( type, callback ) {
        if ( this.isInit === true ) {
            super.addEventListener( type, callback );
        } else {
            const timer = setInterval(() => {
                if ( this.isInit === true ) {
                    clearInterval( timer );
                    super.addEventListener( type, callback );
                }
            }, 100 );
        }
    }
}

export default VimeoPlayer;