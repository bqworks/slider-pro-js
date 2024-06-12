describe( 'touch swipe add-on (puppeteer)', () => {
    beforeAll( async () => {
        await page.goto( global.BASE_URL + 'touch-swipe.html');
        await page.setViewport( { width: 1024, height: 768 } );
    });

    test( 'should navigate to the correct slide on mouse drag', async () => {
        let initialSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        await page.mouse.move( 300, 300 );
        await page.mouse.down();
        await page.mouse.move( 200, 300 );
        await page.mouse.up();

        let finalSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        expect( finalSelectedIndex ).toBe( initialSelectedIndex + 1 );

        await new Promise((resolve) => { 
        setTimeout(resolve, 1100);
    });

        initialSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        await page.mouse.move( 300, 300 );
        await page.mouse.down();
        await page.mouse.move( 400, 300 );
        await page.mouse.up();

        finalSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        expect( finalSelectedIndex ).toBe( initialSelectedIndex - 1 );
    });

    test( 'should not navigate to another slide if the mouse drag is below the threshold', async () => {
        let initialSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        await page.mouse.move( 300, 300 );
        await page.mouse.down();
        await page.mouse.move( 295, 300 );
        await page.mouse.up();

        let finalSelectedIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        expect( finalSelectedIndex ).toBe( initialSelectedIndex );
    });
});