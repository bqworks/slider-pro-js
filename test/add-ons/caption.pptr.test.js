async function getCaptionForSlide( index ) {
    const slideCaption = await page.$eval( `.sp-slide:nth-child(${ index + 1 })`, ( slideEl ) => {
        let caption = '';
        
        if ( slideEl.getElementsByClassName( 'sp-caption' )[ 0 ] !== undefined ) {
            caption = slideEl.getElementsByClassName( 'sp-caption' )[ 0 ].textContent;
        }

        return caption;
    });

    return slideCaption;
}

async function gotoSlide( index ) {
    await page.click( `.sp-button:nth-child(${ index + 1 })` );

    await page.waitForTimeout( 1000 );

    return;
}

describe( 'caption add-on (puppeteer)', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1024, height: 768 } );
        await page.goto( global.BASE_URL + 'caption.html');
    });

    test( 'should display the caption corresponding to the selected slide when the captions are faded', async () => {
        let index = 1;

        await gotoSlide( index );

        let slideCaption = await getCaptionForSlide( index );

        let currentCaption = await page.$eval( '.sp-caption-container', captionEl => captionEl.textContent );

        expect( currentCaption ).toBe( slideCaption );


        index = 2;

        await gotoSlide( index );

        slideCaption = await getCaptionForSlide( index );

        currentCaption = await page.$eval( '.sp-caption-container', captionEl => captionEl.textContent );

        expect( currentCaption ).toBe( slideCaption );


        index = 3;

        await gotoSlide( index );

        slideCaption = await getCaptionForSlide( index );

        currentCaption = await page.$eval( '.sp-caption-container', captionEl => captionEl.textContent );

        expect( currentCaption ).toBe( slideCaption );
    });

    test( 'should not immediately display the next caption until the current caption is faded out', async () => {
        let index = 4;
        let slideCaption = await getCaptionForSlide( index );

        await page.click( `.sp-button:nth-child(${ index + 1 })` );

        let currentCaption = await page.$eval( '.sp-caption-container', captionEl => captionEl.textContent );

        expect( currentCaption ).not.toBe( slideCaption );

        await page.waitForTimeout( 1000 );

        currentCaption = await page.$eval( '.sp-caption-container', captionEl => captionEl.textContent );

        expect( currentCaption ).toBe( slideCaption );
    });
});