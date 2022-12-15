import SliderPro from '../../src/core/slider-pro.js';
import Autoplay from '../../src/add-ons/autoplay/autoplay.js';
import { basicSlider } from '../assets/html/html.js';

let slider;

beforeAll( ()=> {
    document.body.innerHTML = basicSlider;
    jest.useFakeTimers();
});

afterAll( () => {
    jest.useRealTimers();
});

describe( 'autoplay add-on setup', () => {
    test( 'should automatically navigate to the next slide', () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ Autoplay ],
            autoplay: true
        });

        const initialSlideIndex = slider.getSelectedSlide();
        
        jest.runAllTimers();

        const finalSlideIndex = slider.getSelectedSlide();

        expect( finalSlideIndex ).not.toBe( initialSlideIndex );
        expect( [ initialSlideIndex + 1, 0 ] ).toContain( finalSlideIndex );

        slider.destroy();
    });

    test( 'should automatically navigate to the previous slide', () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ Autoplay ],
            autoplay: true,
            autoplayDirection: 'backwards'
        });

        const initialSlideIndex = slider.getSelectedSlide();

        jest.runAllTimers();

        const finalSlideIndex = slider.getSelectedSlide();

        expect( finalSlideIndex ).not.toBe( initialSlideIndex );
        expect( [ initialSlideIndex - 1, slider.getTotalSlides() - 1 ] ).toContain( finalSlideIndex );

        slider.destroy();
    });
});

describe( 'autoplay on mouse interaction', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ Autoplay ],
            autoplay: true
        });
    });

    afterAll( () => {
        slider.destroy();
    });

    test( 'should pause autoplay on hover', () => {
        const initialSlideIndex = slider.getSelectedSlide();

        slider.sliderEl.dispatchEvent( new MouseEvent( 'mouseenter' ) );
        jest.runAllTimers();

        const finalSlideIndex = slider.getSelectedSlide();

        expect( finalSlideIndex ).toBe( initialSlideIndex );
    });

    test( 'should play autoplay on mouse leave', () => {
        const initialSlideIndex = slider.getSelectedSlide();

        slider.sliderEl.dispatchEvent( new MouseEvent( 'mouseleave' ) );
        jest.runAllTimers();

        const finalSlideIndex = slider.getSelectedSlide();

        expect( finalSlideIndex ).not.toBe( initialSlideIndex );
    });
});