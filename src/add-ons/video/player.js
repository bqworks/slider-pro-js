import CustomEventTarget from '../../helpers/custom-event-target.js';

class Player extends CustomEventTarget {
    videoEl = null;
	
    ready = false;
	
    started = false;
	
    state = '';

    constructor( videoEl ) {
        super();

        this.videoEl = videoEl;

        this.init();
    }
	
    init() {}

    play() {}

    pause() {}

    stop() {}

    replay() {}

    isType() {}

    isReady() {
        return this.ready;
    }

    isStarted() {
        return this.started;
    }

    getState() {
        return this.state;
    }
}

export default Player;