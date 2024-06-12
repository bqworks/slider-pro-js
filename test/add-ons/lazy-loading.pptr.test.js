describe( 'lazy-loading add-on', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1024, height: 768 } );
        await page.goto( global.BASE_URL + 'lazy-loading.html');
    });

    test( 'should have the images loaded only in the selected slide and the nearby slides', async () => {
        const imagesSources = await page.$$eval( '.sp-image', imagesEl => imagesEl.map( imageEl => imageEl.getAttribute( 'src' ) ) );

        imagesSources.forEach( ( imageSource, index ) => {
            if ( index === 0 || index === 1 || index === imagesSources.length - 1 ) {
                expect( imageSource.indexOf( 'default' ) ).not.toBe( -1 );
            } else {
                expect( imageSource.indexOf( 'blank' ) ).not.toBe( -1 );
            }
        });
    });

    test( 'should load the images in the selected slide and nearby slides after navigating to a slide', async () => {
        await page.click( '.sp-button:nth-child(5)' );

        await new Promise((resolve) => { 
        setTimeout(resolve, 2000);
    });

        const imagesSources = await page.$$eval( '.sp-image', imagesEl => imagesEl.map( imageEl => imageEl.getAttribute( 'src' ) ) );

        imagesSources.forEach( ( imageSource, index ) => {
            if ( index === 4 || index === 3 || index === 5 ) {
                expect( imageSource.indexOf( 'default' ) ).not.toBe( -1 );
            }
        });
    });
});