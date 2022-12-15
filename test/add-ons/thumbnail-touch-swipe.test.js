import SliderPro from '../../src/core/slider-pro.js';
import Thumbnails from '../../src/add-ons/thumbnails/thumbnails.js';
import ThumbnailTouchSwipe from '../../src/add-ons/thumbnail-touch-swipe/thumbnail-touch-swipe.js';
import { thumbnailSlider } from '../assets/html/html.js';

let slider, thumbnails;

beforeAll( ()=> {
    document.body.innerHTML = thumbnailSlider;
});

describe( 'thumbnails touch swipe add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ Thumbnails, ThumbnailTouchSwipe ]
        });

        thumbnails = slider.thumbnails;
    });

    test( 'should add the `sp-grab` class name to the slides', () => {
        expect( thumbnails.thumbnailsEl.classList.contains( 'sp-grab' ) ).toBe( true );
    });

    test( 'should add the `sp-swiping` class name to the slides on mouse down', () => {
        thumbnails.thumbnailsEl.dispatchEvent( new MouseEvent( 'mousedown' ) );

        expect( thumbnails.thumbnailsEl.classList.contains( 'sp-grab' ) ).toBe( false );
        expect( thumbnails.thumbnailsEl.classList.contains( 'sp-grabbing' ) ).toBe( true );
    });

    test( 'should remove the `sp-swiping` class on mouse up', () => {
        document.dispatchEvent( new MouseEvent( 'mouseup' ) );

        expect( thumbnails.thumbnailsEl.classList.contains( 'sp-grab' ) ).toBe( true );
    });
});