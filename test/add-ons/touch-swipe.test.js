import SliderPro from '../../src/core/slider-pro.js';
import TouchSwipe from '../../src/add-ons/touch-swipe/touch-swipe.js';
import { basicSlider } from '../assets/html/html.js';

let slider;

beforeAll( ()=> {
    document.body.innerHTML = basicSlider;
});

describe( 'touch swipe add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ TouchSwipe ]
        });
    });

    test( 'should add the `sp-grab` class name to the slides', () => {
        expect( slider.slidesMaskEl.classList.contains( 'sp-grab' ) ).toBe( true );
    });

    test( 'should add the `sp-grabbing` class name to the slides on mouse down', () => {
        slider.slidesMaskEl.dispatchEvent( new MouseEvent( 'mousedown' ) );

        expect( slider.slidesMaskEl.classList.contains( 'sp-grabbing' ) ).toBe( true );
    });

    test( 'should add the `sp-swiping` class name to the slider on mouse move', () => {
        slider.slidesMaskEl.dispatchEvent( new MouseEvent( 'mousemove' ) );

        expect( slider.sliderEl.classList.contains( 'sp-swiping' ) ).toBe( true );
    });

    test( 'should remove the `sp-swiping` class on mouse up', () => {
        jest.useFakeTimers();
        document.dispatchEvent( new MouseEvent( 'mouseup' ) );
        jest.runAllTimers();

        expect( slider.sliderEl.classList.contains( 'sp-swiping' ) ).toBe( false );

        jest.useRealTimers();
    });
});