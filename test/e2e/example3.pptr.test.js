describe( 'example 3', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1200, height: 900 } );
        await page.goto( global.E2E_BASE_URL + 'example3.html' );
        await page.addStyleTag( { content: 'body { margin: 0 }' } );
    });

    test( 'should navigate through all the slides upon thumbnail click', async () => {
        const totalSlides = await page.$eval( '.slider-pro', sliderEl => sliderEl.getElementsByClassName( 'sp-slide' ).length );

        for ( let i = 0; i < totalSlides; i++ ) {
            await page.click( `.sp-thumbnail-container:nth-child(${ i + 1 })` );
            await new Promise((resolve) => { 
        setTimeout(resolve, 1000);
    });
        }

        const isLastSlideSelected = await page.$eval( `.sp-slide:nth-child(${ totalSlides })`, slideEl => slideEl.classList.contains( 'sp-selected' ) );

        expect( isLastSlideSelected ).toBe( true );
    });

    test( 'should navigate backwards through all the slides upon arrow click', async () => {
        const totalSlides = await page.$eval( '.slider-pro', sliderEl => sliderEl.getElementsByClassName( 'sp-slide' ).length );

        for ( let i = totalSlides - 1; i >= 1; i-- ) {
            await page.click( '.sp-previous-arrow' );
            await new Promise((resolve) => { 
        setTimeout(resolve, 1000);
    });
        }

        const isFirstSlideSelected = await page.$eval( '.sp-slide:nth-child(1)', slideEl => slideEl.classList.contains( 'sp-selected' ) );

        expect( isFirstSlideSelected ).toBe( true );
    });
});