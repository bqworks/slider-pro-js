import YouTubeAPIPlayerMock from './youtube-api-player-mock.js';

window.YT = {};

window.YT.Player = YouTubeAPIPlayerMock;

window.YT.PlayerState = {
    PLAYING: 'playing',
    PAUSED: 'paused',
    ENDED: 'ended'
};

if ( typeof window.onYouTubePlayerAPIReady !== 'undefined' ) {
    window.onYouTubePlayerAPIReady();
}
