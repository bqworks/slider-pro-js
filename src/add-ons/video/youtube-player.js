import Player from './player.js';

class YoutubePlayer extends Player {

    static youtubeAPIAdded = false;

    static youtubeVideos = [];

    constructor( videoEl ) {
        super( videoEl );
    }

    static isType( videoEl ) {
        if ( videoEl.tagName === 'IFRAME' ) {
            const src = videoEl.getAttribute( 'src' );

            if ( src.indexOf( 'youtube.com' ) !== -1 || src.indexOf( 'youtu.be' ) !== -1 ) {
                return true;
            }
        }

        return false;
    }

    init() {
        this.isInit = false;

        const youtubeAPILoaded = window.YT && window.YT.Player;

        if ( typeof youtubeAPILoaded !== 'undefined' ) {
            this.setup();
        } else {
            YoutubePlayer.youtubeVideos.push( this );
			
            if ( YoutubePlayer.youtubeAPIAdded === false ) {
                YoutubePlayer.youtubeAPIAdded = true;

                const tag = document.createElement( 'script' );
                tag.src = '//www.youtube.com/player_api';

                const firstScriptTag = document.getElementsByTagName( 'script' )[0];
                firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );

                window.onYouTubePlayerAPIReady = () => {
                    YoutubePlayer.youtubeVideos.forEach( ( video ) => {
                        video.setup();
                    });
                };
            }
        }
    }

    setup() {
        this.isInit = true;

        // Get a reference to the player
        this.player = new window.YT.Player( this.videoEl, {
            events: {
                'onReady': () => {
                    this.dispatchEvent( 'ready' );
                    this.ready = true;
                },
				
                'onStateChange': ( event ) => {
                    switch ( event.data ) {
                    case window.YT.PlayerState.PLAYING:
                        if (this.started === false) {
                            this.started = true;
                            this.dispatchEvent( 'start' );
                        }

                        this.state = 'playing';
                        this.dispatchEvent( 'play' );
                        break;
                        
                    case window.YT.PlayerState.PAUSED:
                        this.state = 'paused';
                        this.dispatchEvent( 'pause' );
                        break;
                        
                    case window.YT.PlayerState.ENDED:
                        this.state = 'ended';
                        this.dispatchEvent( 'ended' );
                        break;
                    }
                }
            }
        });
    }

    play() {
        if ( this.ready === true ) {
            this.player.playVideo();
        } else {
            const timer = setInterval(() => {
                if ( this.ready === true ) {
                    clearInterval( timer );
                    this.player.playVideo();
                }
            }, 100 );
        }
    }

    pause() {
        // On iOS, simply pausing the video can make other videos unresponsive
        // so we stop the video instead.
        const isIOS = window.navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ? true : false;

        if ( isIOS === true ) {
            this.stop();
        } else {
            this.player.pauseVideo();
        }
    }

    stop() {
        this.player.seekTo( 1 );
        this.player.stopVideo();
        this.state = 'stopped';
    }

    replay() {
        this.player.seekTo( 1 );
        this.player.playVideo();
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

export default YoutubePlayer;
