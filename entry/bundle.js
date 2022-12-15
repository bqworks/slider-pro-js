import SliderPro from '../src/core/slider-pro.js';

import Arrows from '../src/add-ons/arrows/arrows.js';
import Autoplay from '../src/add-ons/autoplay/autoplay.js';
import Breakpoints from '../src/add-ons/breakpoints/breakpoints.js';
import Buttons from '../src/add-ons/buttons/buttons.js';
import Caption from '../src/add-ons/caption/caption.js';
import ConditionalImages from '../src/add-ons/conditional-images/conditional-images.js';
import DeepLinking from '../src/add-ons/deep-linking/deep-linking.js';
import Fade from '../src/add-ons/fade/fade.js';
import Fullscreen from '../src/add-ons/fullscreen/fullscreen.js';
import Keyboard from '../src/add-ons/keyboard/keyboard.js';
import Layers from '../src/add-ons/layers/layers.js';
import LazyLoading from '../src/add-ons/lazy-loading/lazy-loading.js';
import Retina from '../src/add-ons/retina/retina.js';
import Thumbnails from '../src/add-ons/thumbnails/thumbnails.js';
import ThumbnailArrows from '../src/add-ons/thumbnail-arrows/thumbnail-arrows.js';
import ThumbnailTouchSwipe from '../src/add-ons/thumbnail-touch-swipe/thumbnail-touch-swipe.js';
import TouchSwipe from '../src/add-ons/touch-swipe/touch-swipe.js';
import Video from '../src/add-ons/video/video.js';

import AddOnsManager from '../src/add-ons/add-ons-manager.js';

AddOnsManager.add([ 
    Arrows,
    Autoplay,
    Breakpoints,
    Buttons,
    Caption,
    ConditionalImages,
    DeepLinking,
    Fade,
    Fullscreen,
    Keyboard,
    Layers,
    LazyLoading,
    Retina,
    Thumbnails,
    ThumbnailArrows,
    ThumbnailTouchSwipe,
    TouchSwipe,
    Video
]);

window.SliderPro = SliderPro;