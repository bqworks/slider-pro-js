// The default options of the slider
const defaults = {
    // Width of the slide
    width: 500,

    // Height of the slide
    height: 300,

    // Indicates if the slider is responsive
    responsive: true,

    // The aspect ratio of the slider (width/height)
    aspectRatio: -1,

    // The scale mode for images (cover, contain, exact and none)
    imageScaleMode: 'cover',

    // Indicates if the image will be centered
    centerImage: true,

    // Indicates if the image can be scaled up more than its original size
    allowScaleUp: true,

    // Indicates if height of the slider will be adjusted to the
    // height of the selected slide
    autoHeight: false,

    // Will maintain all the slides at the same height, but will allow the width
    // of the slides to be variable if the orientation of the slides is horizontal
    // and vice-versa if the orientation is vertical
    autoSlideSize: false,

    // Indicates the initially selected slide
    startSlide: 0,

    // Indicates if the slides will be shuffled
    shuffle: false,

    // Indicates whether the slides will be arranged horizontally
    // or vertically. Can be set to 'horizontal' or 'vertical'.
    orientation: 'horizontal',

    // Indicates if the size of the slider will be forced to 'fullWidth' or 'fullWindow'
    forceSize: 'none',

    // Indicates if the slider will be loopable
    loop: true,

    // The distance between slides
    slideDistance: 10,

    // The duration of the slide animation
    slideAnimationDuration: 700,

    // The duration of the height animation
    heightAnimationDuration: 700,

    // Sets the size of the visible area, allowing the increase of it in order
    // to make more slides visible.
    // By default, only the selected slide will be visible. 
    visibleSize: 'auto',

    // Indicates whether the selected slide will be in the center of the slider, when there
    // are more slides visible at a time. If set to false, the selected slide will be in the
    // left side of the slider.
    centerSelectedSlide: true,

    // Indicates if the direction of the slider will be from right to left,
    // instead of the default left to right
    rightToLeft: false,

    // The list of add-ons that will be initialized when the slider is initialized.
    addOns: []
};

export default defaults;