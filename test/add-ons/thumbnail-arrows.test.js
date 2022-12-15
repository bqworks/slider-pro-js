import SliderPro from '../../src/core/slider-pro.js';
import Thumbnails from '../../src/add-ons/thumbnails/thumbnails.js';
import ThumbnailArrows from '../../src/add-ons/thumbnail-arrows/thumbnail-arrows.js';
import { thumbnailSlider } from '../assets/html/html.js';

let slider, sliderEl, thumbnails;

beforeAll( ()=> {
    document.body.innerHTML = thumbnailSlider;
});

describe( 'thumbnail arrows add-on', () => {
    beforeAll( () => {
        slider = new SliderPro( '.slider-pro', {
            addOns: [ Thumbnails, ThumbnailArrows ],
            thumbnailArrows: true,
        });

        sliderEl = document.getElementsByClassName( 'slider-pro' )[0];
        thumbnails = slider.thumbnails;
    });

    test( 'should setup the thumbnail arrows', () => {
        const arrowsEl = sliderEl.getElementsByClassName( 'sp-thumbnail-arrows' );
        const nextArrowEl = sliderEl.getElementsByClassName( 'sp-next-thumbnail-arrow' );
        const previousArrowEl = sliderEl.getElementsByClassName( 'sp-previous-thumbnail-arrow' );

        expect( arrowsEl.length ).toBe( 1 );
        expect( nextArrowEl.length ).toBe( 1 );
        expect( previousArrowEl.length ).toBe( 1 );
    });

    test( 'should move the thumbnails upon next arrow click', () => {
        const arrowEl = sliderEl.getElementsByClassName( 'sp-next-thumbnail-arrow' )[0];
        const moveToSpy = jest.spyOn( thumbnails, 'moveTo' );

        arrowEl.dispatchEvent( new MouseEvent( 'click' ) );
        
        expect( moveToSpy ).toHaveBeenCalled();
    });

    test( 'should move the thumbnails upon previous arrow click', () => {
        const arrowEl = sliderEl.getElementsByClassName( 'sp-previous-thumbnail-arrow' )[0];
        const moveToSpy = jest.spyOn( thumbnails, 'moveTo' );

        arrowEl.dispatchEvent( new MouseEvent( 'click' ) );
        
        expect( moveToSpy ).toHaveBeenCalled();
    });

    test( 'should remove the arrows when the slider is destroyed', () => {
        slider.destroy();

        const arrowsEl = sliderEl.getElementsByClassName( 'sp-thumbnail-arrows' );

        expect( arrowsEl.length ).toBe( 0 );
    });
});