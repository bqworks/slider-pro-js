import SliderPro from '../../src/core/slider-pro.js';
import Fullscreen from '../../src/add-ons/fullscreen/fullscreen.js';
import { basicSlider } from '../assets/html/html.js';

let slider, sliderEl;

beforeAll( ()=> {
    document.body.innerHTML = basicSlider;
});

describe( 'fullscreen add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ Fullscreen ],
            fullscreen: true
        });

        sliderEl = slider.sliderEl;
    });

    test( 'should create a fullscreen button', () => {
        const fullscreenButtonEl = sliderEl.getElementsByClassName( 'sp-fullscreen-button' );

        expect( fullscreenButtonEl.length ).toBe( 1 );
    });
});