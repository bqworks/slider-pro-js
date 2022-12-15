// If a single image is passed, check if it's loaded.
// If a different element is passed, check if there are images
// inside it, and check if these images are loaded.
export function checkImagesComplete( targetEl ) {
    return new Promise( ( resolve ) => {
        let status = checkImagesStatus( targetEl );

        // If there are loading images, wait for them to load.
        // If the images are loaded, resolve the promise.
        if ( status === 'loading' ) {
            const checkImages = setInterval(() => {
                
                status = checkImagesStatus( targetEl );

                if ( status === 'complete' ) {
                    clearInterval( checkImages );
                    resolve( 'complete' );
                }
            }, 100 );
        } else {
            resolve( 'complete' );
        }
    });
}

export function checkImagesStatus( targetEl ) {
    let status = 'complete';

    if ( targetEl.tagName === 'IMG' && targetEl.complete === false ) {
        status = 'loading';
    } else {
        Array.from( targetEl.getElementsByTagName( 'img' ) ).forEach( ( imageEl ) => {
            if ( imageEl.complete === false ) {
                status = 'loading';
            }
        });
    }

    return status;
}

export function resolveUnit( target ) {
    return ( isNaN( target ) || target === 'auto' ) ? target : target + 'px';
}

export function getParent( element, identifier ) {
    if ( typeof element === 'undefined' || element === null || typeof element.tagName === 'undefined' ) {
        return null;
    }

    while ( ! element.classList.contains( identifier ) && element.tagName !== identifier.toUpperCase() ) {
        if ( element.tagName === 'HTML' ) {
            return null;
        }

        element = element.parentElement;
    }

    return element;
}
