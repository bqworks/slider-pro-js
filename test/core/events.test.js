import SliderPro from '../../src/core/slider-pro.js';
import WindowResizeHandler from '../../src/helpers/window-resize-handler.js';
import { basicSlider } from '../assets/html/html.js';

let slider;

beforeAll( ()=> {
    document.body.innerHTML = basicSlider;
});

describe( 'slider navigation', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro' );
    });

    afterAll( () => {
        slider.destroy();
    });

    test( 'should dispatch the `gotoSlide` event type when `gotoSlide` is called', ( done ) => {
        expect.assertions( 2 );

        slider.addEventListener( 'gotoSlide', ( event ) => {
            expect( event.type ).toBe( 'gotoSlide' );
            expect( event.detail.index ).toBe( 1 );
            done();
        });

        slider.gotoSlide( 1 );
    });
});

describe( 'window resize', () => {
    test( 'should dispatch `resize` events at a frequency based on the specified delay allowance', ( done ) => {
        expect.assertions( 1 );

        const resizeDelay = 200;
        const windowResizeHandler = new WindowResizeHandler( resizeDelay );
        
        const timerLimit = 30;
        const timerSpeed = 15;

        let dispatchCounter = 0;
        let timerCounter = 0;

        windowResizeHandler.addEventListener( 'resize', () => {
            dispatchCounter++;
        });

        const timer = setInterval( () => {
            if ( timerCounter >= timerLimit ) {
                clearInterval( timer );

                if ( resizeDelay <= timerSpeed ) {
                    expect( dispatchCounter ).toBe( timerCounter );
                } else {
                    expect( dispatchCounter ).toBe( Math.floor( timerCounter * timerSpeed / resizeDelay ) );
                }

                done();
            }

            timerCounter++;

            window.resizeTo( 500 + timerCounter, 500 + timerCounter );
        }, timerSpeed );
    });
});
