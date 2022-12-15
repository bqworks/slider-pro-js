describe( 'thumbnail touch swipe add-on (puppeteer)', () => {
    beforeAll( async () => {
        await page.goto( global.BASE_URL + 'thumbnail-touch-swipe.html');
        await page.setViewport( { width: 1024, height: 768 } );
        await page.waitForTimeout( 500 );
    });

    test( 'should move the thumbnails on mouse drag', async () => {
        let initialPosition = await page.$eval( '.sp-thumbnails', thumbnailsEl => thumbnailsEl.style.transform );

        await page.mouse.move( 850, 300 );
        await page.mouse.down();
        await page.mouse.move( 850, 200, { steps: 10 } );
        await page.mouse.up();

        let finalPosition = await page.$eval( '.sp-thumbnails', thumbnailsEl => thumbnailsEl.style.transform );

        expect( initialPosition ).not.toBe( finalPosition );
    });

    test( 'should not move the thumbnails outside the boundaries on mouse drag', async () => {
        let initialPosition = await page.$eval( '.sp-thumbnails', thumbnailsEl => thumbnailsEl.style.transform );

        await page.mouse.move( 850, 100 );
        await page.mouse.down();
        await page.mouse.move( 850, 400, { steps: 10 } );
        await page.mouse.up();

        let finalPosition = await page.$eval( '.sp-thumbnails', thumbnailsEl => thumbnailsEl.style.transform );

        expect( initialPosition ).not.toBe( finalPosition );
        expect( finalPosition ).toBe( 'translate3d(0px, 0px, 0px)' );
    });

    test( 'should navigate to the corresponding slide on thumbnail click', async () => {
        let index = 2;
        await page.click( `.sp-thumbnail-container:nth-child(${ index + 1 })` );
        
        let selectedSlideIndex = await page.$eval( '.sp-selected.sp-slide', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        expect( selectedSlideIndex ).toBe( index );

        index = 7;
        await page.click( `.sp-thumbnail-container:nth-child(${ index + 1 })` );
        
        selectedSlideIndex = await page.$eval( '.sp-selected.sp-slide', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        expect( selectedSlideIndex ).toBe( index );
    });
});