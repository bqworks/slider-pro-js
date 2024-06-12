describe( 'example 5', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1200, height: 900 } );
        await page.goto( global.E2E_BASE_URL + 'example5.html' );
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

    test( 'should resize the slider and apply the breakpoint', async () => {
        await page.setViewport( { width: 700, height: 700 } );
        await new Promise((resolve) => { 
        setTimeout(resolve, 500);
    });

        const thumbnailSize = await page.$eval( '.sp-thumbnail-container', ( thumbnailEl ) => {
            return { width: thumbnailEl.clientWidth, height: thumbnailEl.clientHeight };
        });

        expect( thumbnailSize ).toEqual( { width: 270, height: 100 } );
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

    test( 'should resize the slider and apply the breakpoint', async () => {
        await page.setViewport( { width: 400, height: 400 } );
        await new Promise((resolve) => { 
        setTimeout(resolve, 500);
    });

        const thumbnailSize = await page.$eval( '.sp-thumbnail-container', ( thumbnailEl ) => {
            return { width: thumbnailEl.clientWidth, height: thumbnailEl.clientHeight };
        });

        expect( thumbnailSize ).toEqual( { width: 120, height: 50 } );
    });

    test( 'should navigate to the correct slide on mouse drag', async () => {
        let initialSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        await page.mouse.move( 100, 100 );
        await page.mouse.down();
        await page.mouse.move( 100, 50, { steps: 20 } );
        await page.mouse.up();

        let finalSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        expect( finalSelectedIndex ).toBe( initialSelectedIndex + 1 );

        await new Promise((resolve) => { 
        setTimeout(resolve, 1100);
    });

        initialSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        await page.mouse.move( 100, 100 );
        await page.mouse.down();
        await page.mouse.move( 100, 150, { steps: 20 } );
        await page.mouse.up();

        finalSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        await new Promise((resolve) => { 
        setTimeout(resolve, 1100);
    });

        expect( finalSelectedIndex ).toBe( initialSelectedIndex - 1 );
    });
});