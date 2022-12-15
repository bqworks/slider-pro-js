class VideoJSAPIPlayerMock {

    videoEl = null;

    #currentTime = 0;

    eventReferences = {};

    readyHandler = null;

    constructor( videoEl ) {
        this.videoEl = videoEl;

        this.videoEl.addEventListener( 'play', () => {
            this.play();
        });

        this.videoEl.addEventListener( 'pause', () => {
            this.pause();
        });

        this.videoEl.addEventListener( 'ended', () => {
            this.end();
        });
    }

    play() {
        const handler = this.eventReferences[ 'play' ];
        handler();
    }

    pause() {
        const handler = this.eventReferences[ 'pause' ];
        handler();
    }

    end() {
        const handler = this.eventReferences[ 'ended' ];
        handler();
    }

    currentTime( value ) {
        this.#currentTime = value;
    }

    on( type, handler ) {
        this.eventReferences[ type ] = handler;
    }

    ready( handler ) {
        this.readyHandler = handler;

        this.readyHandler();
    }
}

export default VideoJSAPIPlayerMock;
