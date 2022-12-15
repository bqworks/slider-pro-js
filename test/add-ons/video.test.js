import SliderPro from '../../src/core/slider-pro.js';
import Autoplay from '../../src/add-ons/autoplay/autoplay.js';
import Video from '../../src/add-ons/video/video.js';
import VideoController from '../../src/add-ons/video/video-controller.js';
import VideoPlayerMock from '../helpers/video-player-mock.js';
import VideoElementMock from '../helpers/video-element-mock.js';
import { videoSlider } from '../assets/html/html.js';
import '../helpers/youtube-api-mock.js';
import '../helpers/vimeo-api-mock.js';

VideoController.addPlayer( VideoPlayerMock );

let slider, sliderEl, videoEl, videoMock;

describe( 'video add-on', () => {
    describe( 'inline videos', () => {
        beforeAll( () => {
            document.body.innerHTML = videoSlider;
            slider = new SliderPro( '.slider-pro', {
                addOns: [ Autoplay, Video ]
            });
            sliderEl = slider.sliderEl;
            videoEl = sliderEl.getElementsByClassName( 'sp-video' )[ 0 ];
            videoMock = new VideoElementMock( videoEl );
        });
    
        test( 'should initialize inline videos that have the `sp-video` class', () => {
            Array.from( sliderEl.querySelectorAll( '.sp-video:not(a)' ) ).forEach( videoEl => {
                expect( videoEl.getAttribute( 'data-video-init' ) ).not.toBe( null );
            });
        });
    
        test( 'should pre-initialize lazy-loaded videos that have the `sp-video` class', () => {
            Array.from( sliderEl.querySelectorAll( 'a.sp-video' ) ).forEach( videoEl => {
                expect( videoEl.getAttribute( 'data-video-preinit' ) ).not.toBe( null );
            });
        });
    
        test( 'should stop autoplay when the video starts playing', () => {
            slider.settings.autoplay = true;
            slider.settings.playVideoAction = 'stopAutoplay';
            slider.update();
            slider.gotoSlide( 0 );
    
            videoMock.play();
    
            expect( slider.autoplay.settings.autoplay ).toBe( false );
        });
    
        test( 'should resume autoplay when the video is paused', () => {
            slider.settings.autoplay = true;
            slider.settings.pauseVideoAction = 'startAutoplay';
            slider.autoplay.settings.autoplay = false;
            slider.update();
            slider.gotoSlide( 0 );
    
            videoMock.pause();
    
            expect( slider.autoplay.settings.autoplay ).toBe( true );
        });
    
        test( 'should resume autoplay when the video ends', () => {
            slider.settings.endVideoAction = 'startAutoplay';
            slider.autoplay.settings.autoplay = false;
            slider.update();
            slider.gotoSlide( 0 );
    
            videoMock.end();
    
            expect( slider.autoplay.settings.autoplay ).toBe( true );
        });
    
        test( 'should navigate to the next slide when the video ends', () => {
            slider.settings.endVideoAction = 'nextSlide';
            slider.update();
            slider.gotoSlide( 0 );
    
            videoMock.end();
    
            expect( slider.getSelectedSlide() ).toBe( 1 );
        });
    
        test( 'should replay the video when the video ends', () => {
            slider.settings.endVideoAction = 'replayVideo';
            slider.update();
            slider.gotoSlide( 0 );
    
            const mockPlayHandler = jest.fn();
            videoMock.addEventListener( 'play', mockPlayHandler );
    
            videoMock.end();
    
            expect( mockPlayHandler ).toHaveBeenCalled();
        });
    
        test( 'should stop the video when the slider navigates to a new slide', () => {
            slider.settings.leaveVideoAction = 'stopVideo';
            slider.update();
            slider.gotoSlide( 0 );
    
            const mockStopHandler = jest.fn();
            videoMock.addEventListener( 'pause', mockStopHandler );
    
            slider.nextSlide();
    
            expect( mockStopHandler ).toHaveBeenCalled();
        });
    
        test( 'should pause the video when the slider navigates to a new slide', () => {
            slider.settings.leaveVideoAction = 'pauseVideo';
            slider.update();
            slider.gotoSlide( 0 );
    
            const mockPauseHandler = jest.fn();
            videoMock.addEventListener( 'pause', mockPauseHandler );
    
            slider.nextSlide();
    
            expect( mockPauseHandler ).toHaveBeenCalled();
        });
    
        test( 'should stop the inline video when the slider navigates to a new slide', () => {
            slider.gotoSlide( 0 );
            slider.settings.leaveVideoAction = 'removeVideo';
            slider.update();
    
            const mockStopHandler = jest.fn();
            videoMock.addEventListener( 'pause', mockStopHandler );
    
            slider.nextSlide();
    
            expect( mockStopHandler ).toHaveBeenCalled();
        });

        test( 'should destroy videos when the slider is destroyed', () => {
            slider.destroy();

            expect( slider.sliderEl.querySelectorAll( '.sp-video[data-video-init]' ).length ).toBe( 0 );
            expect( slider.sliderEl.querySelectorAll( '.sp-video[data-video-preinit]' ).length ).toBe( 0 );
        });
    });

    describe( 'lazy loaded videos', () => {
        beforeAll( () => {
            document.body.innerHTML = videoSlider;
            slider = new SliderPro( '.slider-pro', {
                addOns: [ Video ]
            });
            sliderEl = slider.sliderEl;
        });

        test( 'should initialize lazy loaded youtube videos on video click', () => {
            slider.gotoSlide( 2 );

            const slideEl = slider.getSlideAt( slider.getSelectedSlide() ).slideEl;
            const lazyVideoEl = slideEl.getElementsByClassName( 'sp-video' )[ 0 ];
            lazyVideoEl.dispatchEvent( new MouseEvent( 'click' ) );

            expect( slideEl.innerHTML.indexOf( 'iframe' ) !== 0 ).toBe( true );
        });

        test( 'should initialize lazy loaded vimeo videos on video click', () => {
            slider.gotoSlide( 3 );

            const slideEl = slider.getSlideAt( slider.getSelectedSlide() ).slideEl;
            const lazyVideoEl = slideEl.getElementsByClassName( 'sp-video' )[ 0 ];
            lazyVideoEl.dispatchEvent( new MouseEvent( 'click' ) );

            expect( slideEl.innerHTML.indexOf( 'iframe' ) !== 0 ).toBe( true );
        });

        test( 'should remove the lazy loaded video when the slider navigates to a new slide', () => {
            slider.gotoSlide( 3 );

            slider.settings.leaveVideoAction = 'removeVideo';
            slider.update();

            let videoEl = slider.getSlideAt( 3 ).slideEl.querySelector( '.sp-video[data-video-init]' );

            expect( videoEl ).not.toBe( null );

            slider.nextSlide();

            videoEl = slider.getSlideAt( 3 ).slideEl.querySelector( '.sp-video[data-video-init]' );

            expect( videoEl ).toBe( null );
        });

        test( 'should destroy videos when the slider is destroyed', () => {
            slider.destroy();

            expect( slider.sliderEl.querySelectorAll( '.sp-video[data-video-init]' ).length ).toBe( 0 );
            expect( slider.sliderEl.querySelectorAll( '.sp-video[data-video-preinit]' ).length ).toBe( 0 );
        });
    });
});
