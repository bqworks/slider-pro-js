describe( 'layers add-on', () => {
    beforeAll( async () => {
        await page.goto( global.BASE_URL + 'layers.html');
        await page.setViewport( { width: 1024, height: 768 } );
    });

    test( 'should have the layers visible for the initial slide', async () => {
        await page.waitForTimeout( 500 );

        const layersVisibility = await page.$$eval( '.sp-selected .sp-layer', layersEl => layersEl.map( layerEl => layerEl.style.visibility !== undefined && layerEl.style.visibility !== 'hidden' ? true : false ) );

        expect( layersVisibility ).not.toContain( false );
    });

    test( 'should not have the layers visible for a slide that is not selected', async () => {
        const layersVisibility = await page.$$eval( '.sp-slide:nth-child(2) .sp-layer', ( layersEl ) => {
            return layersEl.map( ( layerEl ) => {
                return layerEl.style.visibility !== undefined && layerEl.style.visibility !== 'hidden' ? true : false;
            });
        });

        expect( layersVisibility ).not.toContain( true );
    });

    test( 'should not have the static layers set to be invisible', async () => {
        const layersVisibility = await page.$$eval( '.sp-static', layersEl => layersEl.map( layerEl => layerEl.style.visibility !== undefined && layerEl.style.visibility !== 'hidden' ? true : false ) );

        expect( layersVisibility ).not.toContain( false );
    });

    test( 'should not navigate to another slide until the layers in the selected slide are hidden', async () => {
        const index = 1;

        await page.click( `.sp-button:nth-child(${ index + 1 })` );
        
        let selectedSlideIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        expect( selectedSlideIndex ).not.toBe( index );

        await page.waitForTimeout( 2000 );

        selectedSlideIndex = await page.$eval( '.sp-slide.sp-selected', slideEl => parseInt( slideEl.getAttribute( 'data-index' ) ) );

        expect( selectedSlideIndex ).toBe( index );
    });

    test( 'should set the position of the layers correctly', async () => {
        const layersPosition = await page.$$eval( '.sp-slide.sp-selected .sp-layer', ( layersEl ) => {
            return layersEl.map( ( layerEl ) => {
                return { x: parseInt( layerEl.style.left ), y: parseInt( layerEl.style.top ) };
            });
        });

        expect( layersPosition[ 0 ] ).toEqual( { x: 100, y: 100 } );
        expect( layersPosition[ 1 ] ).toEqual( { x: 200, y: 200 } );
        expect( layersPosition[ 2 ] ).toEqual( { x: 300, y: 300 } );
        expect( layersPosition[ 3 ] ).toEqual( { x: 400, y: 400 } );
    });
});