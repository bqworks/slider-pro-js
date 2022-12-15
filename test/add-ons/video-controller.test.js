import VideoController from '../../src/add-ons/video/video-controller.js';
import VideoElementMock from '../helpers/video-element-mock.js';
import { HTML5Video, YouTubeVideo, VimeoVideo, VideoJSVideo } from '../assets/html/html.js';
import '../helpers/youtube-api-mock.js';
import '../helpers/vimeo-api-mock.js';
import '../helpers/videojs-api-mock.js';

describe( 'Video Controller', () => {
    let videoEl, videoMock, videoController;

    describe( 'HTML5 video', () => {
        beforeAll( ()=> {
            document.body.innerHTML = HTML5Video;
            videoEl = document.getElementsByClassName( 'video' )[ 0 ];
            videoMock = new VideoElementMock( videoEl );
            videoController = new VideoController( videoMock );
        });
    
        test( 'should detect when the video starts playing', () => {
            const mockStartHandler = jest.fn();
    
            videoController.addEventListener( 'videoStart', mockStartHandler );
    
            videoMock.play();
    
            expect( mockStartHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video is paused', () => {
            const mockPauseHandler = jest.fn();
    
            videoController.addEventListener( 'videoPause', mockPauseHandler );
    
            videoMock.pause();
    
            expect( mockPauseHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video resumes playing', () => {
            const mockPlayHandler = jest.fn();
    
            videoController.addEventListener( 'videoPlay', mockPlayHandler );
    
            videoMock.play();
    
            expect( mockPlayHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video ends', () => {
            const mockEndedHandler = jest.fn();
            
            videoController.addEventListener( 'videoEnded', mockEndedHandler );
    
            videoMock.end();
    
            expect( mockEndedHandler ).toHaveBeenCalled();
        });
    });
    
    describe( 'YouTube video', () => {
        beforeAll( ()=> {
            document.body.innerHTML = YouTubeVideo;
            videoEl = document.getElementsByClassName( 'video' )[ 0 ];
            videoMock = new VideoElementMock( videoEl );
            videoController = new VideoController( videoMock );
        });
    
        test( 'should detect when the video starts playing', () => {
            const mockStartHandler = jest.fn();
    
            videoController.addEventListener( 'videoStart', mockStartHandler );
    
            videoMock.play();
    
            expect( mockStartHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video is paused', () => {
            const mockPauseHandler = jest.fn();
    
            videoController.addEventListener( 'videoPause', mockPauseHandler );
    
            videoMock.pause();
    
            expect( mockPauseHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video resumes playing', () => {
            const mockPlayHandler = jest.fn();
    
            videoController.addEventListener( 'videoPlay', mockPlayHandler );
    
            videoMock.play();
    
            expect( mockPlayHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video ends', () => {
            const mockEndedHandler = jest.fn();
            
            videoController.addEventListener( 'videoEnded', mockEndedHandler );
    
            videoMock.end();
    
            expect( mockEndedHandler ).toHaveBeenCalled();
        });
    });

    describe( 'Vimeo video', () => {
        beforeAll( ()=> {
            document.body.innerHTML = VimeoVideo;
            videoEl = document.getElementsByClassName( 'video' )[ 0 ];
            videoMock = new VideoElementMock( videoEl );
            videoController = new VideoController( videoMock );
        });
    
        test( 'should detect when the video starts playing', () => {
            const mockStartHandler = jest.fn();
    
            videoController.addEventListener( 'videoStart', mockStartHandler );
    
            videoMock.play();
    
            expect( mockStartHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video is paused', () => {
            const mockPauseHandler = jest.fn();
    
            videoController.addEventListener( 'videoPause', mockPauseHandler );
    
            videoMock.pause();
    
            expect( mockPauseHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video resumes playing', () => {
            const mockPlayHandler = jest.fn();
    
            videoController.addEventListener( 'videoPlay', mockPlayHandler );
    
            videoMock.play();
    
            expect( mockPlayHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video ends', () => {
            const mockEndedHandler = jest.fn();
            
            videoController.addEventListener( 'videoEnded', mockEndedHandler );
    
            videoMock.end();
    
            expect( mockEndedHandler ).toHaveBeenCalled();
        });
    });

    describe( 'VideoJS video', () => {
        beforeAll( ()=> {
            document.body.innerHTML = VideoJSVideo;
            videoEl = document.getElementsByClassName( 'video' )[ 0 ];
            videoMock = new VideoElementMock( videoEl );
            videoController = new VideoController( videoMock );
        });
    
        test( 'should detect when the video starts playing', () => {
            const mockStartHandler = jest.fn();
    
            videoController.addEventListener( 'videoStart', mockStartHandler );
    
            videoMock.play();
    
            expect( mockStartHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video is paused', () => {
            const mockPauseHandler = jest.fn();
    
            videoController.addEventListener( 'videoPause', mockPauseHandler );
    
            videoMock.pause();
    
            expect( mockPauseHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video resumes playing', () => {
            const mockPlayHandler = jest.fn();
    
            videoController.addEventListener( 'videoPlay', mockPlayHandler );
    
            videoMock.play();
    
            expect( mockPlayHandler ).toHaveBeenCalled();
        });
    
        test( 'should detect when the video ends', () => {
            const mockEndedHandler = jest.fn();
            
            videoController.addEventListener( 'videoEnded', mockEndedHandler );
    
            videoMock.end();
    
            expect( mockEndedHandler ).toHaveBeenCalled();
        });
    });
});
