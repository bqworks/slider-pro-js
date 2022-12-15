describe( 'conditional images add-on', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1024, height: 768 } );
        await page.goto( global.BASE_URL + 'conditional-images.html');
    });

    afterAll( async () => {
        await page.setViewport( { width: 1024, height: 768 } );
    });

    test( 'should have the initial images set correctly', async () => {
        const imagesSources = await page.$$eval( '.sp-image', imagesEl => imagesEl.map( imageEl => imageEl.getAttribute( 'src' ) ) );

        imagesSources.forEach( ( imageSource ) => {
            expect( imageSource.indexOf( 'medium' ) ).not.toBe( -1 );
        });
    });

    test( 'should use the small version of the images when the browser is scaled down', async () => {
        await page.setViewport( { width: 400, height: 300 } );

        // wait for the 'resize' event to be dispatched after the delay (default: 200ms)
        await page.waitForTimeout( 500 );

        const imagesSources = await page.$$eval( '.sp-image', imagesEl => imagesEl.map( imageEl => imageEl.getAttribute( 'src' ) ) );

        imagesSources.forEach( ( imageSource ) => {
            expect( imageSource.indexOf( 'small' ) ).not.toBe( -1 );
        });
    });

    test( 'should use the large version of the images when the browser is scaled up', async () => {
        await page.setViewport( { width: 1400, height: 700 } );

        // wait for the 'resize' event to be dispatched after the delay (default: 200ms)
        await page.waitForTimeout( 500 );

        const imagesSources = await page.$$eval( '.sp-image', imagesEl => imagesEl.map( imageEl => imageEl.getAttribute( 'src' ) ) );

        imagesSources.forEach( ( imageSource ) => {
            expect( imageSource.indexOf( 'large' ) ).not.toBe( -1 );
        });
    });
});