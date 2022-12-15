import VideoJSAPIPlayerMock from './videojs-api-player-mock.js';

window.videojs = ( videoID ) => {
    const videoEl = document.getElementById( videoID );
    return new VideoJSAPIPlayerMock( videoEl );
};
