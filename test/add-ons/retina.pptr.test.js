describe( 'retina add-on', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1024, height: 768, deviceScaleFactor: 2 } );
        await page.goto( global.BASE_URL + 'retina.html');
    });

    afterAll( async () => {
        await page.setViewport( { width: 1024, height: 768, deviceScaleFactor: 1 } );
    });

    test( 'should have the initial images set correctly', async () => {
        const imagesSources = await page.$$eval( '.sp-image', imagesEl => imagesEl.map( imageEl => imageEl.getAttribute( 'src' ) ) );

        imagesSources.forEach( ( imageSource ) => {
            expect( imageSource.indexOf( 'large' ) ).not.toBe( -1 );
        });
    });
});