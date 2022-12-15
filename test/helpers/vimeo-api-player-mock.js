class VimeoAPIPlayerMock {

    videoEl = null;

    eventReferences = {};

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

    on( type, handler ) {
        this.eventReferences[ type ] = handler;
    }
}

export default VimeoAPIPlayerMock;
