import SliderPro from '../../src/core/slider-pro.js';
import { basicSlider } from '../assets/html/html.js';

let slider, sliderEl;

beforeAll( ()=> {
    document.body.innerHTML = basicSlider;
    sliderEl = document.getElementsByClassName( 'slider-pro' )[0];
});

describe( 'slider setup', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro' );
    });

    afterAll( () => {
        slider.destroy();
    });

    test( 'should have the sp-no-js class removed', () => {
        expect( sliderEl.classList.contains( 'sp-no-js' ) ).toBe( false );
    });

    test( 'should have the correct number of slides', () => {
        expect( slider.getTotalSlides() ).toBe( 5 );
    });

    test( 'should have the correct slide order', () => {
        const expectedSlideOrder = ['1', '2', '3', '4', '5'];
        const actualSlideOrder = [];

        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            actualSlideOrder.push( slider.getSlideAt( i ).slideEl.textContent );
        }

        expect( actualSlideOrder ).toEqual( expectedSlideOrder );
    });

    test( 'should return the correct initial selected slide index', () => {
        expect( slider.getSelectedSlide() ).toBe( 0 );
    });

    test( 'should return the correct slide when retireving by index', () => {
        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            expect( slider.getSlideAt( i ).index ).toBe( i );
        }
    });
});

describe( 'slider shuffle', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', { shuffle: true } );
    });

    afterAll( () => {
        slider.destroy();
    });

    test( 'should have random slide order when `shuffle` is used', () => {
        const notExpectedSlideOrder = ['1', '2', '3', '4', '5'];
        const randomSlideOrder = [];

        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            randomSlideOrder.push( slider.getSlideAt( i ).slideEl.textContent );
        }

        expect( randomSlideOrder ).not.toEqual( notExpectedSlideOrder );
    });

    test( 'should have the correct number of slides when `shuffle` is used', () => {
        expect( slider.getTotalSlides() ).toBe( 5 );
    });

    test( 'should have unique slides when `shuffle` is used', () => {
        const slides = ['1', '2', '3', '4', '5'];

        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            const index = slides.indexOf( slider.getSlideAt( i ).slideEl.textContent );
            slides.splice( index, 1 );
        }

        expect( slides.length ).toBe( 0 );
    });
});

describe( 'update the slider content', () => {
    beforeAll( () => {
        document.body.innerHTML = basicSlider;
        sliderEl = document.getElementsByClassName( 'slider-pro' )[0];
        slider = new SliderPro( '.slider-pro' );
    });

    afterAll( () => {
        slider.destroy();
    });

    test( 'should add a slide at the correct position', () => {
        const newSlideEl = document.createElement( 'div' );
        newSlideEl.classList.add( 'sp-slide' );
        newSlideEl.textContent = 'new slide';

        sliderEl.getElementsByClassName( 'sp-slide' )[2].after( newSlideEl );

        slider.update();

        const slidesContent = [];

        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            slidesContent.push( slider.getSlideAt( i ).slideEl.textContent );
        }

        expect( slidesContent ).toEqual( ['1', '2', '3', 'new slide', '4', '5'] );
    });

    test( 'should add multiple slides at the correct position', () => {
        const secondSlideEl = document.createElement( 'div' );
        secondSlideEl.classList.add( 'sp-slide' );
        secondSlideEl.textContent = 'second slide';

        const thirdSlideEl = document.createElement( 'div' );
        thirdSlideEl.classList.add( 'sp-slide' );
        thirdSlideEl.textContent = 'third slide';

        sliderEl.getElementsByClassName( 'sp-slide' )[1].after( secondSlideEl );
        sliderEl.getElementsByClassName( 'sp-slide' )[5].after( thirdSlideEl );

        slider.update();

        const slidesContent = [];

        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            slidesContent.push( slider.getSlideAt( i ).slideEl.textContent );
        }

        expect( slidesContent ).toEqual( ['1', '2', 'second slide', '3', 'new slide', '4', 'third slide', '5'] );
    });

    test( 'should remove a slide', () => {
        const toRemoveSlideEl = sliderEl.getElementsByClassName( 'sp-slide' )[4];
        toRemoveSlideEl.remove();

        slider.update();

        const slidesContent = [];

        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            slidesContent.push( slider.getSlideAt( i ).slideEl.textContent );
        }

        expect( slidesContent ).toEqual( ['1', '2', 'second slide', '3', '4', 'third slide', '5'] );
    });

    test( 'should remove multiple slides', () => {
        let toRemoveSlideEl = sliderEl.getElementsByClassName( 'sp-slide' )[4];
        toRemoveSlideEl.remove();

        toRemoveSlideEl = sliderEl.getElementsByClassName( 'sp-slide' )[2];
        toRemoveSlideEl.remove();

        toRemoveSlideEl = sliderEl.getElementsByClassName( 'sp-slide' )[4];
        toRemoveSlideEl.remove();

        slider.update();

        const slidesContent = [];

        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            slidesContent.push( slider.getSlideAt( i ).slideEl.textContent );
        }

        expect( slidesContent ).toEqual( ['1', '2', '3', 'third slide'] );
    });

    test( 'should add and remove multiple slides', () => {
        let newSlideEl = document.createElement( 'div' );
        newSlideEl.classList.add( 'sp-slide' );
        newSlideEl.textContent = '4';
        sliderEl.getElementsByClassName( 'sp-slide' )[2].after( newSlideEl );

        newSlideEl = document.createElement( 'div' );
        newSlideEl.classList.add( 'sp-slide' );
        newSlideEl.textContent = '5';
        sliderEl.getElementsByClassName( 'sp-slide' )[3].after( newSlideEl );

        let toRemoveSlideEl = sliderEl.getElementsByClassName( 'sp-slide' )[5];
        toRemoveSlideEl.remove();

        toRemoveSlideEl = sliderEl.getElementsByClassName( 'sp-slide' )[0];
        toRemoveSlideEl.remove();

        slider.update();

        const slidesContent = [];

        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            slidesContent.push( slider.getSlideAt( i ).slideEl.textContent );
        }

        expect( slidesContent ).toEqual( ['2', '3', '4', '5'] );
    });
});

describe( 'slide order with loop enabled', () => {
    beforeAll( () => {
        document.body.innerHTML = basicSlider;
        sliderEl = document.getElementsByClassName( 'slider-pro' )[0];
        slider = new SliderPro( '.slider-pro' );
    });

    afterAll( () => {
        slider.destroy();
    });

    test( 'should have the correct initial order when the number of slides is odd', () => {
        expect( slider.slidesOrder ).toEqual( [ 3, 4, 0, 1, 2 ] );
    });

    test( 'should have the correct initial order when the number of slides is even', () => {
        const newSlideEl = document.createElement( 'div' );
        newSlideEl.classList.add( 'sp-slide' );
        newSlideEl.textContent = '6';
        sliderEl.getElementsByClassName( 'sp-slides' )[0].appendChild( newSlideEl );
        slider.update();

        expect( slider.slidesOrder ).toEqual( [ 4, 5, 0, 1, 2, 3 ] );
    });
});