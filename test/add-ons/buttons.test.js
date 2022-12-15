import SliderPro from '../../src/core/slider-pro.js';
import Buttons from '../../src/add-ons/buttons/buttons.js';
import { basicSlider } from '../assets/html/html.js';

let slider, sliderEl;

beforeAll( ()=> {
    document.body.innerHTML = basicSlider;
    sliderEl = document.getElementsByClassName( 'slider-pro' )[0];
});

describe( 'buttons add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', { addOns: [ Buttons ] } );
    });

    test( 'should setup the buttons', () => {
        const buttonEl = sliderEl.getElementsByClassName( 'sp-button' );

        expect( buttonEl.length ).toBe( 5 );
    });

    test( 'should adjust the buttons when the number of slides modify', () => {
        let newSlideEl = document.createElement( 'div' );
        newSlideEl.classList.add( 'sp-slide' );
        sliderEl.getElementsByClassName( 'sp-slides' )[0].appendChild( newSlideEl );
        slider.update();

        const buttonEl = sliderEl.getElementsByClassName( 'sp-button' );

        expect( buttonEl.length ).toBe( 6 );
    });

    test( 'should navigate to the corresponding slide on button click', () => {
        let index = 2;

        const buttonsEl = sliderEl.getElementsByClassName( 'sp-buttons' )[0];
        const buttonEl = buttonsEl.getElementsByClassName( 'sp-button' )[ index ];
        
        buttonEl.dispatchEvent( new MouseEvent( 'click' ) );
        
        const finalSlideIndex = slider.getSelectedSlide();

        expect( finalSlideIndex ).toBe( index );
    });

    test( 'should select the corresponding button when a new slide is selected', () => {
        let index = 3;

        const buttonsEl = sliderEl.getElementsByClassName( 'sp-buttons' )[0];
        const buttonEl = buttonsEl.getElementsByClassName( 'sp-button' )[ index ];
        
        slider.gotoSlide( index );

        expect( buttonEl.classList.contains( 'sp-selected-button' ) ).toBe( true );
    });

    test( 'should remove the buttons when the slider is destroyed', () => {
        slider.destroy();

        const buttonEl = sliderEl.getElementsByClassName( 'sp-button' );

        expect( buttonEl.length ).toBe( 0 );
    });
});