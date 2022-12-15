class VideoElementMock {

    videoEl = null;

    currentTime = 0;

    tagName = null;

    classList = null;

    constructor( videoEl ) {
        this.videoEl = videoEl;
        this.tagName = this.videoEl.tagName;
        this.classList = this.videoEl.classList;
    }

    getAttribute( attributeName ) {
        return this.videoEl.getAttribute( attributeName );
    }

    addEventListener( type, handler ) {
        this.videoEl.addEventListener( type, handler );
    }

    removeEventListener( type, handler ) {
        this.videoEl.removeEventListener( type, handler );
    }

    dispatchEvent( type ) {
        this.videoEl.dispatchEvent( type );
    }

    play() {
        this.videoEl.dispatchEvent( new Event( 'play' ) );
    }

    pause() {
        this.videoEl.dispatchEvent( new Event( 'pause' ) );
    }

    end() {
        this.videoEl.dispatchEvent( new Event( 'ended' ) );
    }
}

export default VideoElementMock;