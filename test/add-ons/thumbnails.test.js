import SliderPro from '../../src/core/slider-pro.js';
import Thumbnails from '../../src/add-ons/thumbnails/thumbnails.js';
import { thumbnailSlider } from '../assets/html/html.js';

let slider, sliderEl, thumbnails;

beforeAll( ()=> {
    document.body.innerHTML = thumbnailSlider;
    sliderEl = document.getElementsByClassName( 'slider-pro' )[0];
});

describe( 'thumbnails add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ Thumbnails ]
        });

        thumbnails = slider.thumbnails;
    });

    test( 'should setup the thumbnails', () => {
        expect( sliderEl.getElementsByClassName( 'sp-thumbnails-container' ).length ).toBe( 1 );
    });

    test( 'should have the correct amount of thumbnails', () => {
        expect( thumbnails.thumbnails.length ).toBe( slider.getTotalSlides() );
    });

    test( 'should have the same order as the slides', () => {
        const slidesContent = [];
        const thumbnailsContent = [];

        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            slidesContent.push( slider.getSlideAt( i ).slideEl.textContent );
        }

        for ( let i = 0; i < thumbnails.thumbnails.length; i++ ) {
            thumbnailsContent.push( thumbnails.thumbnails[ i ].thumbnailEl.textContent );
        }

        expect( slidesContent ).toEqual( thumbnailsContent );
    });

    test( 'should remove the added markup when the slider is destroyed', () => {
        slider.destroy();
        const sliderEl = document.getElementsByClassName( 'slider-pro' )[0];

        expect( sliderEl.getElementsByClassName( 'sp-thumbnails-container' ).length ).toBe( 0 );
        expect( sliderEl.getElementsByClassName( 'sp-thumbnail-container' ).length ).toBe( 0 );
    });

    test( 'should have the same order as the slides when `shuffle` is enabled', () => {
        
        slider = new SliderPro( '.slider-pro', {
            addOns: [ Thumbnails ],
            shuffle: true
        });
        sliderEl = slider.sliderEl;
        thumbnails = slider.thumbnails;

        const slidesContent = [];
        const thumbnailsContent = [];

        for ( let i = 0; i < slider.getTotalSlides(); i++ ) {
            slidesContent.push( slider.getSlideAt( i ).slideEl.textContent );
        }

        for ( let i = 0; i < thumbnails.thumbnails.length; i++ ) {
            thumbnailsContent.push( thumbnails.thumbnails[ i ].thumbnailEl.textContent );
        }

        expect( slidesContent ).toEqual( thumbnailsContent );
    });

    test( 'should navigate to the corresponding slide upon thumbnail click', () => {
        let index = 1;
        let thumbnail = thumbnails.thumbnailsEl.getElementsByClassName( 'sp-thumbnail-container' )[ index ];

        thumbnail.dispatchEvent( new MouseEvent( 'click' ) );

        expect( slider.getSelectedSlide() ).toBe( index );

        index = 3;
        thumbnail = thumbnails.thumbnailsEl.getElementsByClassName( 'sp-thumbnail-container' )[ index ];

        thumbnail.dispatchEvent( new MouseEvent( 'click' ) );

        expect( slider.getSelectedSlide() ).toBe( index );
    });

    test( 'should select the corresponding thumbnail when the selected slide changes', () => {
        let index = 2;
        let thumbnail = thumbnails.thumbnailsEl.getElementsByClassName( 'sp-thumbnail-container' )[ index ];

        slider.gotoSlide( index );

        expect( thumbnail.classList.contains( 'sp-selected-thumbnail' ) ).toBe( true );

        index = 4;
        thumbnail = thumbnails.thumbnailsEl.getElementsByClassName( 'sp-thumbnail-container' )[ index ];

        slider.gotoSlide( index );

        expect( thumbnail.classList.contains( 'sp-selected-thumbnail' ) ).toBe( true );
    });
});