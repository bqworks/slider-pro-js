async function gotoSlide( index ) {
    await page.click( `.sp-button:nth-child(${ index + 1 })` );

    await page.waitForTimeout( 1000 );

    return;
}

describe( 'fade add-on (puppeteer)', () => {
    beforeAll( async () => {
        await page.setViewport( { width: 1024, height: 768 } );
        await page.goto( global.BASE_URL + 'fade.html');
    });

    test( 'should navigate to a new slide with fade', async () => {
        let index = 1;

        await gotoSlide( index );

        let isSelected = await page.$eval( `.sp-slide:nth-child(${ index + 1 })`, slideEl => slideEl.classList.contains( 'sp-selected' ) );

        expect( isSelected ).toBe( true );


        index = 2;

        await gotoSlide( index );

        isSelected = await page.$eval( `.sp-slide:nth-child(${ index + 1 })`, slideEl => slideEl.classList.contains( 'sp-selected' ) );

        expect( isSelected ).toBe( true );


        index = 5;

        await gotoSlide( index );

        isSelected = await page.$eval( `.sp-slide:nth-child(${ index + 1 })`, slideEl => slideEl.classList.contains( 'sp-selected' ) );

        expect( isSelected ).toBe( true );
    });
});