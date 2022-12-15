window.resizeTo = ( width, height ) => {
    window.innerWidth = width;
    window.innerHeight = height;

    window.dispatchEvent( new Event( 'resize' ) );
};