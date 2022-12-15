import SliderPro from '../../src/core/slider-pro.js';
import DeepLinking from '../../src/add-ons/deep-linking/deep-linking.js';
import { basicSlider } from '../assets/html/html.js';

let slider;

beforeAll( ()=> {
    document.body.innerHTML = basicSlider;
});

describe( 'deep-linking add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ DeepLinking ],
            updateHash: true
        });
    });

    test( 'should update the url hash when the slider navigates to a slide', () => {
        slider.gotoSlide( 2 );

        expect( window.location.hash ).toBe( '#slider/2' );
    });

    test( 'should navigate to the corresponding slide based on url location', () => {
        window.location.href = window.location.origin + '/#slider/3';
        window.dispatchEvent( new Event( 'hashchange' ) );

        expect( slider.getSelectedSlide() ).toBe( 3 );
    });
});