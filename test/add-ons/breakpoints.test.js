import SliderPro from '../../src/core/slider-pro.js';
import Breakpoints from '../../src/add-ons/breakpoints/breakpoints.js';
import { basicSlider } from '../assets/html/html.js';

let slider;

beforeAll( ()=> {
    document.body.innerHTML = basicSlider;
});

describe( 'breakpoints add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            width: 800,
            height: 500,
            addOns: [ Breakpoints ],
            breakpoints: {
                700: {
                    orientation: 'vertical',
                    width: 500,
                    height: 300,
                    loop: false
                },
                500: {
                    orientation: 'horizontal',
                    width: 300,
                    height: 200,
                    loop: true
                }
            }
        });

        jest.useFakeTimers();
    });

    afterAll( () => {
        jest.useRealTimers();
    });

    test( 'should apply the corresponding breakpoint when the window resizes', () => {
        window.resizeTo( 600, 500 );

        jest.runAllTimers();

        expect( slider.settings.width ).toBe( 500 );
        expect( slider.settings.height ).toBe( 300 );
        expect( slider.settings.orientation ).toBe( 'vertical' );
        expect( slider.settings.loop ).toBe( false );

        expect( slider.slidesOrder ).toEqual( [ 0, 1, 2, 3, 4 ] );

        window.resizeTo( 400, 300 );

        jest.runAllTimers();

        expect( slider.settings.width ).toBe( 300 );
        expect( slider.settings.height ).toBe( 200 );
        expect( slider.settings.orientation ).toBe( 'horizontal' );
        expect( slider.settings.loop ).toBe( true );

        expect( slider.slidesOrder ).toEqual( [ 3, 4, 0, 1, 2 ] );
    });
});