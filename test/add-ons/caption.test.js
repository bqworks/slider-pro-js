import SliderPro from '../../src/core/slider-pro.js';
import Caption from '../../src/add-ons/caption/caption.js';
import { captionSlider } from '../assets/html/html.js';

let slider, sliderEl;

beforeAll( ()=> {
    document.body.innerHTML = captionSlider;
    sliderEl = document.getElementsByClassName( 'slider-pro' )[0];
});

describe( 'caption add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ Caption ],
            fadeCaption: false
        });
    });

    test( 'should setup the caption element', () => {
        const caption = sliderEl.getElementsByClassName( 'sp-caption-container' );

        expect( caption.length ).toBe( 1 );
        expect( caption[0].textContent ).toBe( 'Caption 1' );
    });

    test( 'should display the caption corresponding to the selected slide', () => {
        slider.gotoSlide( 3 );
        
        const captionContent = sliderEl.getElementsByClassName( 'sp-caption-container' )[0].textContent;

        expect( captionContent ).toBe( 'Caption 4' );
    });
});