import CustomEventTarget from '../../helpers/custom-event-target.js';
import HTML5Player from './html5-player.js';
import VideoJSPlayer from './videojs-player.js';
import VimeoPlayer from './vimeo-player.js';
import YoutubePlayer from './youtube-player.js';

class VideoController extends CustomEventTarget {

    // Stores the available players
    static players = [];

    // Reference to the current player instance
    player = null;

    // Reference to the video element
    videoEl;

    // Check if an iOS device is used.
    // This information is important because a video can not be
    // controlled programmatically unless the user has started the video manually.
    isIOS = window.navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ? true : false;

    constructor( videoEl ) {
        super();

        this.videoEl = videoEl;

        this.init();
    }

    static addPlayer( player ) {
        if ( VideoController.players.indexOf( player ) === -1 ) {
            VideoController.players.unshift( player );
        }
    }

    init() {
        const videoID = this.videoEl.getAttribute( 'id' );

        // Loop through the available video players
        // and check if the targeted video element is supported by one of the players.
        // If a compatible type is found, store the video type.
        const playerConstructor = VideoController.players.find( ( player ) => player.isType( this.videoEl ) );
        this.player = new playerConstructor( this.videoEl );

        // Return if the player could not be instantiated
        if ( this.player === null ) {
            return;
        }

        // Add event listeners
        const playerEvents = [ 'ready', 'start', 'play', 'pause', 'ended' ];
		
        playerEvents.forEach( ( playerEvent ) => {
            const videoControllerEvent = 'video' + playerEvent.charAt( 0 ).toUpperCase() + playerEvent.slice( 1 );

            this.player.addEventListener( playerEvent, () => {
                this.dispatchEvent( videoControllerEvent, { video: videoID } );
            });
        });
    }
	
    play() {
        if ( this.isIOS === true && this.player.isStarted() === false || this.player.getState() === 'playing' ) {
            return;
        }

        this.player.play();
    }
	
    stop() {
        if ( this.isIOS === true && this.player.isStarted() === false || this.player.getState() === 'stopped' ) {
            return;
        }

        this.player.stop();
    }
	
    pause() {
        if ( this.isIOS === true && this.player.isStarted() === false || this.player.getState() === 'paused' ) {
            return;
        }

        this.player.pause();
    }

    replay() {
        if ( this.isIOS === true && this.player.isStarted() === false ) {
            return;
        }
		
        this.player.replay();
    }

    destroy() {
        if ( this.player.isStarted() === true ) {
            this.stop();
        }

        this.player.removeEventListener( 'ready' );
        this.player.removeEventListener( 'start' );
        this.player.removeEventListener( 'play' );
        this.player.removeEventListener( 'pause' );
        this.player.removeEventListener( 'ended' );
    }
}

VideoController.addPlayer( HTML5Player );
VideoController.addPlayer( VideoJSPlayer );
VideoController.addPlayer( YoutubePlayer );
VideoController.addPlayer( VimeoPlayer );

export default VideoController;
