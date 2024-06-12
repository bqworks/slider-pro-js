describe( 'example 2', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 800, height: 500, deviceScaleFactor: 2 } );
        await page.goto( global.E2E_BASE_URL + 'example2.html' );
        await page.addStyleTag( { content: 'body { margin: 0 }' } );
    });

    test( 'should have the size of the full width slider set to the size of the viewport', async () => {
        let sliderWidth = await page.$eval( '.slider-pro', sliderEl => sliderEl.clientWidth );

        expect( sliderWidth ).toBe( 800 );
    });

    test( 'should navigate through all the slides upon button click', async () => {
        const totalSlides = await page.$eval( '.slider-pro', sliderEl => sliderEl.getElementsByClassName( 'sp-slide' ).length );

        for ( let i = 0; i < totalSlides; i++ ) {
            await page.click( `.sp-button:nth-child(${ i + 1 })` );
            await new Promise((resolve) => { 
        setTimeout(resolve, 1000);
    });
        }

        const isLastSlideSelected = await page.$eval( `.sp-slide:nth-child(${ totalSlides })`, slideEl => slideEl.classList.contains( 'sp-selected' ) );

        expect( isLastSlideSelected ).toBe( true );
    });

    test( 'should load the large version of the images', async () => {
        const imagesSources = await page.$$eval( '.sp-image', imagesEl => imagesEl.map( imageEl => imageEl.currentSrc ) );

        imagesSources.forEach( ( imageSource ) => {
            expect( imageSource.indexOf( 'large' ) ).not.toBe( -1 );
        });
    });

    test( 'should navigate backwards using mouse drag', async () => {
        const totalSlides = await page.$eval( '.slider-pro', sliderEl => sliderEl.getElementsByClassName( 'sp-slide' ).length );

        for ( let i = 0; i < totalSlides - 1; i++ ) {
            let initialSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

            await page.mouse.move( 100, 100 );
            await page.mouse.down();
            await page.mouse.move( 200, 100, { steps: 20 } );
            await page.mouse.up();
            await new Promise((resolve) => { 
        setTimeout(resolve, 2000);
    });

            let finalSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

            expect( finalSelectedIndex ).toBe( initialSelectedIndex - 1 );
        }
    });
});