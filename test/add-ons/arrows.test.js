import SliderPro from '../../src/core/slider-pro.js';
import Arrows from '../../src/add-ons/arrows/arrows.js';
import { basicSlider } from '../assets/html/html.js';

let slider, sliderEl;

beforeAll( ()=> {
    document.body.innerHTML = basicSlider;
    sliderEl = document.getElementsByClassName( 'slider-pro' )[0];
});

describe( 'arrows add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [Arrows],
            arrows: true 
        });
    });

    test( 'should setup the arrows', () => {
        const arrowsEl = sliderEl.getElementsByClassName( 'sp-arrows' );
        const nextArrowEl = sliderEl.getElementsByClassName( 'sp-next-arrow' );
        const previousArrowEl = sliderEl.getElementsByClassName( 'sp-previous-arrow' );

        expect( arrowsEl.length ).toBe( 1 );
        expect( nextArrowEl.length ).toBe( 1 );
        expect( previousArrowEl.length ).toBe( 1 );
    });

    test( 'should navigate to the next slide on next arrow click', () => {
        const arrowEl = sliderEl.getElementsByClassName( 'sp-next-arrow' )[0];
        const initialSlideIndex = slider.getSelectedSlide();

        arrowEl.dispatchEvent( new MouseEvent( 'click' ) );
        
        const finalSlideIndex = slider.getSelectedSlide();

        expect( finalSlideIndex ).not.toBe( initialSlideIndex );
        expect( [ initialSlideIndex + 1, 0 ] ).toContain( finalSlideIndex );
    });

    test( 'should navigate to the previous slide on previous arrow click', () => {
        const arrowEl = sliderEl.getElementsByClassName( 'sp-previous-arrow' )[0];
        const initialSlideIndex = slider.getSelectedSlide();

        arrowEl.dispatchEvent( new MouseEvent( 'click' ) );
        
        const finalSlideIndex = slider.getSelectedSlide();

        expect( finalSlideIndex ).not.toBe( initialSlideIndex );
        expect( [ initialSlideIndex - 1, slider.getTotalSlides() - 1 ] ).toContain( finalSlideIndex );
    });

    test( 'should remove the arrows when the slider is destroyed', () => {
        slider.destroy();

        const arrowsEl = sliderEl.getElementsByClassName( 'sp-arrows' );

        expect( arrowsEl.length ).toBe( 0 );
    });
});