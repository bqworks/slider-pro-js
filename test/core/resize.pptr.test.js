describe( 'slider resizing', () => {
    beforeAll( async () => {
        await page.goto( global.BASE_URL + 'resize.html');
    });

    test( 'should resize the slider when the viewport scales down', async () => {
        await page.setViewport( { width: 900, height: 700 } );
        await page.waitForTimeout( 500 );

        let sliderWidth = await page.$eval( '#responsive-slider', sliderEl => sliderEl.clientWidth );

        expect( sliderWidth ).toBe( 800 );

        await page.setViewport( { width: 500, height: 300 } );
        await page.waitForTimeout( 500 );

        sliderWidth = await page.$eval( '#responsive-slider', sliderEl => sliderEl.clientWidth );

        expect( sliderWidth ).toBe( 500 );
    });

    test( 'should not resize the non-responsive slider when the viewport scales down', async () => {
        await page.setViewport( { width: 400, height: 300 } );
        await page.waitForTimeout( 500 );

        const sliderWidth = await page.$eval( '#non-responsive-slider', sliderEl => sliderEl.clientWidth );

        expect( sliderWidth ).toBe( 800 );
    });

    test( 'should resize the full width slider to the same width as the viewport', async () => {
        await page.setViewport( { width: 1000, height: 600 } );
        await page.waitForTimeout( 500 );

        let sliderWidth = await page.$eval( '#full-width-slider', sliderEl => sliderEl.clientWidth );

        expect( sliderWidth ).toBe( 1000 );

        await page.setViewport( { width: 900, height: 600 } );
        await page.waitForTimeout( 500 );

        sliderWidth = await page.$eval( '#full-width-slider', sliderEl => sliderEl.clientWidth );

        expect( sliderWidth ).toBe( 900 );
    });

    test( 'should resize the full window slider to the same width and height as the viewport', async () => {
        await page.setViewport( { width: 1200, height: 800 } );
        await page.waitForTimeout( 500 );

        let sliderSize = await page.$eval( '#full-window-slider', ( sliderEl ) => {
            return { width: sliderEl.clientWidth, height: sliderEl.clientHeight };
        });

        expect( sliderSize ).toEqual( { width: 1200, height: 800 } );

        await page.setViewport( { width: 700, height: 500 } );
        await page.waitForTimeout( 500 );

        sliderSize = await page.$eval( '#full-window-slider', ( sliderEl ) => {
            return { width: sliderEl.clientWidth, height: sliderEl.clientHeight };
        });

        expect( sliderSize ).toEqual( { width: 700, height: 500 } );
    });
});