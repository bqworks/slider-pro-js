import { getParent, resolveUnit, checkImagesStatus, checkImagesComplete } from '../../src/helpers/util.js';

document.body.innerHTML = `
    <div class="outer">
        <div class="inner">
            <p class="content">text</p>
        </div>
    </div>`;

describe( 'getParent functions', () => {

    test( 'should retrieve the parent element that contains the specified class name', () => {
        const childEl = document.getElementsByClassName( 'content' )[0];

        expect( getParent( childEl, 'outer' ).classList.contains( 'outer' ) ).toBe( true );
    });

    test( 'should return `null` if `getParent` does not find a parent element with the specified class name', () => {
        const childEl = document.getElementsByClassName( 'content' )[0];

        expect( getParent( childEl, 'something' ) ).toBe( null );
    });
});

describe( 'resolveUnit function', () => {
    test( 'should return a value with `px` appended when the input is a number', () => {
        expect( resolveUnit( 100 ) ).toBe( '100px' );
        expect( resolveUnit( '100' ) ).toBe( '100px' );
    });

    test( 'should not modify the input value when it is equal to `auto`', () => {
        expect( resolveUnit( 'auto' ) ).toBe( 'auto' );
    });

    test( 'should not modify the input value when it contains `px`', () => {
        expect( resolveUnit( '100px' ) ).toBe( '100px' );
    });

    test( 'should not modify the input value when it contains `%`', () => {
        expect( resolveUnit( '100%' ) ).toBe( '100%' );
    });

    test( 'should not modify the input value when it contains `vw`', () => {
        expect( resolveUnit( '100vw' ) ).toBe( '100vw' );
    });
});

describe( 'checkImagesStatus function', () => {
    beforeEach( () => {
        const html = `
            <div class="no-images-container"></div>
            <div class="loaded-images-container"><img src=""/></div>
            <div class="images-container">
                <div><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAAHAP8ALAAAAAABAAEAAAICRAEAOw=="/></div>
            </div>`;

        document.body.innerHTML = html;
    });

    afterEach( () => {
        document.body.innerHTML = '';
    });

    test( 'should initially return `loading` when targeting a container with images', () => {
        const imagesContainerEl = document.getElementsByClassName( 'images-container' )[0];

        expect( checkImagesStatus( imagesContainerEl ) ).toBe( 'loading' );
    });

    test( 'should eventually return `complete` when targeting a container with images', () => {
        const imagesContainerEl = document.getElementsByClassName( 'images-container' )[0];

        setTimeout( () => {
            expect( checkImagesStatus( imagesContainerEl ) ).toBe( 'complete' );
        }, 10);
    });

    test( 'should return `complete` when targeting a container with no images', () => {
        const noImagesContainerEl = document.getElementsByClassName( 'no-images-container' )[0];

        expect( checkImagesStatus( noImagesContainerEl ) ).toBe( 'complete' );
    });

    test( 'should return `complete` when targeting a container with empty images', () => {
        const loadedImagesContainerEl = document.getElementsByClassName( 'loaded-images-container' )[0];

        expect( checkImagesStatus( loadedImagesContainerEl ) ).toBe( 'complete' );
    });
});

describe( 'checkImagesComplete function', () => {
    beforeEach( () => {
        const html = `
            <div class="main-container">
                <div class="no-images-container"></div>
                <div class="loaded-images-container"><img src=""/></div>
                <div class="images-container">
                    <div><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAAHAP8ALAAAAAABAAEAAAICRAEAOw=="/></div>
                    <div><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAAHAP8ALAAAAAABAAEAAAICRAEAOw=="/></div>
                    <div><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAAHAP8ALAAAAAABAAEAAAICRAEAOw=="/></div>
                </div>
            </div>`;

        document.body.innerHTML = html;
    });

    afterEach( () => {
        document.body.innerHTML = '';
    });

    test( 'should resolve as `complete` when there are no loading images', async () => {
        const containerEl = document.getElementsByClassName( 'main-container' )[0];
        await expect( checkImagesComplete( containerEl ) ).resolves.toBe( 'complete' );
    });
});