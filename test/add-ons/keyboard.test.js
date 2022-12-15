import SliderPro from '../../src/core/slider-pro.js';
import Keyboard from '../../src/add-ons/keyboard/keyboard.js';
import { keyboardSlider } from '../assets/html/html.js';

let slider;

beforeAll( ()=> {
    document.body.innerHTML = keyboardSlider;
});

describe( 'keyboard add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ Keyboard ]
        });
    });

    test( 'should navigate to the next slide upon right key press', () => {
        const initialSlideIndex = slider.getSelectedSlide();

        document.dispatchEvent( new KeyboardEvent( 'keydown', { which: 39 } ) );

        const finalSlideIndex = slider.getSelectedSlide();

        expect( finalSlideIndex ).not.toBe( initialSlideIndex );
        expect( [ initialSlideIndex + 1, 0 ] ).toContain( finalSlideIndex );
    });

    test( 'should navigate to the previous slide upon left key press', () => {
        const initialSlideIndex = slider.getSelectedSlide();

        document.dispatchEvent( new KeyboardEvent( 'keydown', { which: 37 } ) );

        const finalSlideIndex = slider.getSelectedSlide();

        expect( finalSlideIndex ).not.toBe( initialSlideIndex );
        expect( [ initialSlideIndex - 1, slider.getTotalSlides() - 1 ] ).toContain( finalSlideIndex );
    });

    test( 'should open existing link upon enter key press', () => {
        const linkClickHandler = jest.fn();

        Array.from( slider.sliderEl.querySelectorAll( '.sp-image-container > a' ) ).forEach( linkEl => {
            linkEl.addEventListener( 'click', linkClickHandler );
        });

        document.dispatchEvent( new KeyboardEvent( 'keydown', { which: 13 } ) );

        expect( linkClickHandler ).toHaveBeenCalled();
    });
});