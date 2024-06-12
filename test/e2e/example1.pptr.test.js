describe( 'example 1', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1200, height: 900 } );
        await page.goto( global.E2E_BASE_URL + 'example1.html' );
        await page.addStyleTag( { content: 'body { margin: 0 } .slider-pro { margin-left: 0 }' } );
    });

    test( 'should have the correct initial slider width', async () => {
        let sliderWidth = await page.$eval( '.slider-pro', sliderEl => sliderEl.clientWidth );

        expect( sliderWidth ).toBe( 960 );
    });

    test( 'should have the correct initial thumbnail size', async () => {
        const thumbnailSize = await page.$eval( '.sp-thumbnail-container', ( thumbnailEl ) => {
            return { width: thumbnailEl.clientWidth, height: thumbnailEl.clientHeight };
        });

        expect( thumbnailSize ).toEqual( { width: 200, height: 100 } );
    });

    test( 'should navigate through all the slides upon thumbnail click', async () => {
        const totalSlides = await page.$eval( '.slider-pro', sliderEl => sliderEl.getElementsByClassName( 'sp-slide' ).length );

        for ( let i = 0; i < totalSlides; i++ ) {
            await page.click( `.sp-thumbnail-container:nth-child(${ i + 1 })` );
            await new Promise((resolve) => { 
        setTimeout(resolve, 2000);
    });
        }

        const isLastSlideSelected = await page.$eval( `.sp-slide:nth-child(${ totalSlides })`, slideEl => slideEl.classList.contains( 'sp-selected' ) );

        expect( isLastSlideSelected ).toBe( true );
    });

    test( 'should resize the slider when the viewport size is smaller than the slider size', async () => {
        await page.setViewport( { width: 400, height: 300 } );
        await new Promise((resolve) => { 
        setTimeout(resolve, 500);
    });

        let sliderWidth = await page.$eval( '.slider-pro', sliderEl => sliderEl.clientWidth );

        expect( sliderWidth ).toBe( 400 );
    });

    test( 'should apply the breakpoint settings for the thumbnails', async () => {
        const thumbnailSize = await page.$eval( '.sp-thumbnail-container', ( thumbnailEl ) => {
            return { width: thumbnailEl.clientWidth, height: thumbnailEl.clientHeight };
        });

        expect( thumbnailSize ).toEqual( { width: 120, height: 50 } );
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