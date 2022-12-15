describe( 'example 4', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1200, height: 900 } );
        await page.goto( global.E2E_BASE_URL + 'example4.html' );
        await page.addStyleTag( { content: 'body { margin: 0 } .slider-pro { margin-left: 0 }' } );
    });

    test( 'should navigate through all the slides upon button click', async () => {
        const totalSlides = await page.$eval( '.slider-pro', sliderEl => sliderEl.getElementsByClassName( 'sp-slide' ).length );

        for ( let i = 0; i < totalSlides; i++ ) {
            await page.click( `.sp-button:nth-child(${ i + 1 })` );
            await page.waitForTimeout( 1000 );
        }

        const isLastSlideSelected = await page.$eval( `.sp-slide:nth-child(${ totalSlides })`, slideEl => slideEl.classList.contains( 'sp-selected' ) );

        expect( isLastSlideSelected ).toBe( true );
    });

    test( 'should resize the slider when the viewport size is smaller than the slider size', async () => {
        await page.setViewport( { width: 500, height: 400 } );
        await page.waitForTimeout( 500 );

        let sliderWidth = await page.$eval( '.slider-pro', sliderEl => sliderEl.clientWidth );

        expect( sliderWidth ).toBe( 500 );
    });

    test( 'should navigate backwards using mouse drag', async () => {
        const totalSlides = await page.$eval( '.slider-pro', sliderEl => sliderEl.getElementsByClassName( 'sp-slide' ).length );

        for ( let i = 0; i < totalSlides - 1; i++ ) {
            let initialSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

            await page.mouse.move( 100, 100 );
            await page.mouse.down();
            await page.mouse.move( 200, 100, { steps: 20 } );
            await page.mouse.up();
            await page.waitForTimeout( 1500 );

            let finalSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

            expect( finalSelectedIndex ).toBe( initialSelectedIndex - 1 );
        }
    });
});