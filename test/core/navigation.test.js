import SliderPro from '../../src/core/slider-pro.js';
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

    test( 'should increment the value of the selected slide index when calling `nextSlide', () => {
        let counter = slider.getTotalSlides() * 2;

        while ( counter-- > 0 ) {
            const initialSlideIndex = slider.getSelectedSlide();
            slider.nextSlide();
            const finalSlideIndex = slider.getSelectedSlide();

            expect( [ initialSlideIndex + 1, 0 ] ).toContain( finalSlideIndex );
        }
    });

    test( 'should decrement the value of the selected slide index when calling `previousSlide', () => {
        let counter = slider.getTotalSlides() * 2;

        while ( counter-- > 0 ) {
            const initialSlideIndex = slider.getSelectedSlide();
            slider.previousSlide();
            const finalSlideIndex = slider.getSelectedSlide();

            expect( [ initialSlideIndex - 1, slider.getTotalSlides() - 1 ] ).toContain( finalSlideIndex );
        }
    });
});

describe( 'slide reordering with loop enabled', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', { loop: true } );
    });

    afterAll( () => {
        slider.destroy();
    });

    test( 'should have the correct slide order after navigating to a slide', () => {
        slider.gotoSlide( 0 );
        expect( slider.slidesOrder ).toEqual( [ 3, 4, 0, 1, 2 ] );

        slider.gotoSlide( 2 );
        expect( slider.slidesOrder ).toEqual( [ 0, 1, 2, 3, 4 ] );

        slider.gotoSlide( 4 );
        expect( slider.slidesOrder ).toEqual( [ 2, 3, 4, 0, 1 ] );
    });
});