[![npm version](https://img.shields.io/npm/v/slider-pro-js)](https://www.npmjs.com/package/slider-pro-js)
[![License](https://img.shields.io/github/license/bqworks/slider-pro-js)](https://github.com/bqworks/slider-pro-js/blob/master/LICENSE)
[![Build](https://github.com/bqworks/slider-pro-js/actions/workflows/build.yml/badge.svg)](https://github.com/bqworks/slider-pro-js/actions/workflows/build.yml)
[![Tests](https://github.com/bqworks/slider-pro-js/actions/workflows/test.yml/badge.svg)](https://github.com/bqworks/slider-pro-js/actions/workflows/test.yml)
[![Downloads](https://img.shields.io/npm/dt/slider-pro-js)](https://github.com/bqworks/slider-pro-js)

# Slider Pro JS #

A modular JavaScript slider that is __dependency-free__, __rich-featured__, __flexible__ and __easy to use__. 

*Main features:* 

* Modular architecture
* Responsive
* Touch-swipe support
* CSS3 transitions
* Animated layers (and static)
* Infinite scrolling
* Carousel layout
* Different sized slides/images
* Full Width and Full Window support
* Thumbnails
* Lazy loading
* Fade effect
* Full-screen support
* Video content support
* Conditional images (different images for different screen sizes)
* JavaScript breakpoints 

See some [examples](https://bqworks.net/slider-pro/) on the [presentation page](https://bqworks.net/slider-pro/).

The slider is also available as a [jQuery plugin](https://github.com/bqworks/slider-pro) and as a [WordPress plugin](https://wordpress.org/plugins/sliderpro/).

## Getting started ##

### 1. Get a copy of the plugin ###

You can fork or download the plugin from GitHub, or you can install it through `npm`.

```
$ npm install slider-pro-js
```

### 2. Load the required files ###

You can either load the minimized JS and CSS files in your HTML or you can import the files as modules.

```html
<link rel="stylesheet" href="slider-pro-js/build/slider-pro.css"/>
<script type="text/javascript" src="slider-pro-js/build/slider-pro.js"></script>
```

From unpkg.com:

```html
<link rel="stylesheet" href="https://unpkg.com/slider-pro-js/build/slider-pro.css"/>
<script type="text/javascript" src="https://unpkg.com/slider-pro-js/build/slider-pro.js"></script>
```

Alternatively you can import the slider's core and each add-on from the `slider-pro-js` package.

```js
import SliderPro, { Autoplay, Buttons, Thumbnails } from 'slider-pro-js';
```

You can also import the CSS, either the entire code or for each individual module:

```js
// imports the entire CSS code
import 'slider-pro-js/css';
```

```js
// imports the CSS code for the core and for each individual add-on
import 'slider-pro-js/css/core';
import 'slider-pro-js/css/buttons';
import 'slider-pro-js/css/thumbnails';
import 'slider-pro-js/css/arrows';
import 'slider-pro-js/css/caption';
import 'slider-pro-js/css/fullscreen';
import 'slider-pro-js/css/layers';
import 'slider-pro-js/css/thumbnail-arrows';
import 'slider-pro-js/css/thumbnail-touch-swipe';
import 'slider-pro-js/css/touch-swipe';
import 'slider-pro-js/css/video';
```

### 3. Create the HTML for the slider ###

```html
<div class="slider-pro" id="my-slider">
	<div class="sp-slides">
		<!-- Slide 1 -->
		<div class="sp-slide">
			<img class="sp-image" src="path/to/image1.jpg"/>
		</div>
		
		<!-- Slide 2 -->
		<div class="sp-slide">
			<p>Lorem ipsum dolor sit amet</p>
		</div>
		
		<!-- Slide 3 -->
		<div class="sp-slide">
			<h3 class="sp-layer">Lorem ipsum dolor sit amet</h3>
			<p class="sp-layer">consectetur adipisicing elit</p>
		</div>
	</div>
</div>
```

### 4. Instantiate the slider ###

```html
<script type="text/javascript">
	document.addEventListener( 'DOMContentLoaded', () => {
		const mySlider = new SliderPro( '#my-slider', {
			width: '100vw',
			height: '100vh',
			autoplay: true,
			...
		});
	});
</script>
```

If you are importing the files as modules, you need to add each imported add-on to the `addOns` option.

```html
<script type="text/javascript">
	document.addEventListener( 'DOMContentLoaded', () => {
		const mySlider = new SliderPro( '#my-slider', {
			addOns: [ Autoplay, Buttons, Thumbnails ],
			width: '100vw',
			...
		});
	});
</script>
```

### Custom build ###

The files from the packages's `build` folder, by default, will include all the slider's features. If you will use only a few of the provided features/add-ons and you want to optimize the files so that they include only what you use, you need to go to `entry/bundle.js` and `entry/style-bundle.js`, and comment out/remove the add-ons that you won't use. After that you need to open the terminal, navigate to the `slider-pro-js` package and run `npm run build`. 

## Detailed usage instructions ##

* [JavaScript API](#1-core-options)
	* [1. Core options](#1-core-options)
	* [2. Add-on options](#2-add-on-options)
	* [3. Public Methods](#3-public-methods)
	* [4. Events](#4-events)
* [Add-ons](#add-ons)
	* [1. Breakpoints](#1-breakpoints)
	* [2. Fade](#2-fade)
	* [3. Caption](#3-caption)
	* [4. Full Screen](#4-full-screen)
	* [5. Lazy Loading](#5-lazy-loading)
	* [6. Retina](#6-retina)
	* [7. Conditional Images](#7-conditional-images)
	* [8. Layers](#8-layers)
	* [9. Deep Linking](#9-deep-linking)
	* [10. Autoplay](#10-autoplay)
	* [11. Touch Swipe](#11-touch-swipe)
	* [12. Buttons](#12-buttons)
	* [13. Arrows](#13-arrows)
	* [14. Keyboard](#14-keyboard)
	* [15. Thumbnails](#15-thumbnails)
	* [16. Thumbnail Touch Swipe](#16-thumbnail-touch-swipe)
	* [17. Thumbnail Arrows](#17-thumbnail-arrows)
	* [18. Video](#18-video)

### 1. Core options ###

Name | Default value | Description
---|---|---
<span id="width">width</span> | 500 | Sets the width of the slide (not the whole slider). Can be set to a fixed value, like 900 (indicating 900 pixels), or to a percentage value, like '100%' or '100vw'.
<span id="height">height</span> | 300 | Sets the height of the slide.
<span id="responsive">responsive</span> | true | Makes the slider responsive. The slider can be responsive even if the 'width' and/or 'height' properties are set to fixed values. In this situation, 'width' and 'height' will act as the maximum width and height of the slides.
<span id="aspectratio">aspectRatio</span> | -1 | Sets the aspect ratio of the slides. If set to a value different than -1 (e.g., 1.5, 2), the height of the slides will be overridden in order to maintain the specified aspect ratio.
<span id="imagescalemode">imageScaleMode</span> | 'cover' | Sets the scale mode of the main slide images (images added as background). 'cover' will scale and crop the image so that it fills the entire slide. 'contain' will keep the entire image visible inside the slide. 'exact' will match the size of the image to the size of the slide. 'none' will leave the image to its original size.<br>*Available values:* 'cover', 'contain', 'exact' and 'none'
<span id="centerimage">centerImage</span> | true | Indicates if the image will be centered
<span id="allowscaleup">allowScaleUp</span> | true | Indicates if the image can be scaled up more than its original size
<span id="autoheight">autoHeight</span> | false | Indicates if height of the slider will be adjusted to the height of the selected slide.
<span id="autoslidesize">autoSlideSize</span> | false | Will maintain all the slides at the same height, but will allow the width of the slides to be variable if the orientation of the slides is horizontal and vice-versa if the orientation is vertical.
<span id="startslide">startSlide</span> | 0 | Sets the slide that will be selected when the slider loads.
<span id="shuffle">shuffle</span> | false | Indicates if the slides will be shuffled.
<span id="orientation">orientation</span> | 'horizontal' | Indicates whether the slides will be arranged horizontally or vertically.<br>*Available value:* 'horizontal' and 'vertical'
<span id="forcesize">forceSize | 'none' | Indicates if the size of the slider will be forced to full width or full window.<br>*Available value:* 'fullWidth', 'fullWindow' and 'none'.
<span id="loop">loop</span> | true | Indicates if the slider will be loopable (infinite scrolling).
<span id="slidedistance">slideDistance</span> | 10 | Sets the distance between the slides.
<span id="slideanimationduration">slideAnimationDuration</span> | 700 | Sets the duration of the slide animation.
<span id="heightanimationduration">heightAnimationDuration</span> | 700 | Sets the duration of the height animation.
<span id="visiblesize">visibleSize</span> | 'auto' | Sets the size of the visible area, allowing for more slides to become visible near the selected slide.
<span id="centerselectedslide">centerSelectedSlide</span> | true | Indicates whether the selected slide will be in the center of the slider, when there are more slides visible at a time. If set to false, the selected slide will be in the left side of the slider.
<span id="righttoleft">rightToLeft</span> | false | Indicates if the direction of the slider will be from right to left, instead of the default left to right.

### 2. Add-on options ###

Name | Default value | Description
---|---|---
<span id="addons">addOns</span> | [] | If the add-ons are imported as modules, each module needs to be added to this array.
fade | false | Indicates if fade will be used.
fadeOutPreviousSlide | true | Indicates if the previous slide will be faded out (in addition to the next slide being faded in).
<span id="fadeduration">fadeDuration</span> | 500 | Sets the duration of the fade effect.
<span id="autoplay">autoplay</span> | true | Indicates whether or not autoplay will be enabled.
<span id="autoplaydelay">autoplayDelay</span> | 5000 | Sets the delay/interval (in milliseconds) at which the autoplay will run.
<span id="autoplaydirection">autoplayDirection</span> | 'normal' | Indicates whether autoplay will navigate to the next slide or previous slide.<br>*Available values:* 'normal' and 'backwards'
<span id="autoplayonhover">autoplayOnHover</span> | 'pause' | Indicates if the autoplay will be paused or stopped when the slider is hovered.<br>*Available values:* 'pause', 'stop' and 'none'
<span id="arrows">arrows</span> | false | Indicates whether the arrow buttons will be created.
<span id="fadearrows">fadeArrows</span> | true | Indicates whether the arrows will fade in only on hover.
<span id="buttons">buttons</span> | true | Indicates whether the buttons will be created.
<span id="keyboard">keyboard</span> | true | Indicates whether keyboard navigation will be enabled.
<span id="keyboardonlyonfocus">keyboardOnlyOnFocus</span> | false | Indicates whether the slider will respond to keyboard input only when the slider is in focus.
<span id="touchswipe">touchSwipe</span> | true | Indicates whether the touch swipe will be enabled for slides.
<span id="touchswipethreshold">touchSwipeThreshold</span> | 50 | Sets the minimum amount that the slides should move.
<span id="fadecaption">fadeCaption</span> | true | Indicates whether or not the captions will be faded.
<span id="captionfadeduration">captionFadeDuration</span> | 500 | Sets the duration of the fade animation.
<span id="fullscreen">fullscreen</span> | false | Indicates whether the full-screen button is enabled.
<span id="fadefullscreen">fadeFullscreen</span> | true | Indicates whether the button will fade in only on hover.
<span id="waitforlayers">waitForLayers</span> | false | Indicates whether the slider will wait for the layers to disappear before going to a new slide.
<span id="autoscalelayers">autoScaleLayers</span> | true | Indicates whether the layers will be scaled automatically.
<span id="autoscalereference">autoScaleReference</span> | -1 | Sets a reference width which will be compared to the current slider width in order to determine how much the layers need to scale down. By default, the reference width will be equal to the slide width. However, if the slide width is set to a percentage value, then it's necessary to set a specific value for 'autoScaleReference'.
<span id="smallsize">smallSize</span> | 480 | If the slider size is below this size, the small version of the images will be used.
<span id="mediumsize">mediumSize</span> | 768 | If the slider size is below this size, the medium version of the images will be used.
<span id="largesize">largeSize</span> | 1024 | If the slider size is below this size, the large version of the images will be used.
<span id="updatehash">updateHash</span> | false | Indicates whether the hash will be updated when a new slide is selected.
<span id="reachvideoaction">reachVideoAction</span> | 'none' | Sets the action that the video will perform when its slide container is selected.<br>*Available values:* 'playVideo' and 'none'
<span id="leavevideoaction">leaveVideoAction</span> | 'pauseVideo' | Sets the action that the video will perform when another slide is selected.<br>*Available values:* 'stopVideo', 'pauseVideo', 'removeVideo' and 'none'
<span id="playvideoaction">playVideoAction</span> | 'stopAutoplay' | Sets the action that the slider will perform when the video starts playing.<br>*Available values:* 'stopAutoplay' and 'none'
<span id="pausevideoaction">pauseVideoAction</span> | 'none' | Sets the action that the slider will perform when the video is paused.<br>*Available values:* 'startAutoplay' and 'none'
<span id="endvideoaction">endVideoAction</span> | 'none' | Sets the action that the slider will perform when the video ends.<br>*Available values:* 'startAutoplay', 'nextSlide', 'replayVideo' and 'none'
<span id="thumbnailwidth">thumbnailWidth</span> | 100 | Sets the width of the thumbnail.
<span id="thumbnailheight">thumbnailHeight</span> | 80 | Sets the height of the thumbnail.
<span id="thumbnailsposition">thumbnailsPosition</span> | 'bottom' | Sets the position of the thumbnail scroller.<br>*Available values:* 'top', 'bottom', 'right' and 'left'
<span id="thumbnailpointer">thumbnailPointer</span> | false | Indicates if a pointer will be displayed for the selected thumbnail.
<span id="thumbnailarrows">thumbnailArrows</span> | false | Indicates whether the thumbnail arrows will be enabled.
<span id="fadethumbnailarrows">fadeThumbnailArrows</span> | true | Indicates whether the thumbnail arrows will be faded.
<span id="thumbnailtouchswipe">thumbnailTouchSwipe</span> | true | Indicates whether the touch swipe will be enabled for thumbnails.
<span id="breakpoints">breakpoints</span> | null | Sets specific breakpoints which allow changing the look and behavior of the slider when the page resizes.

### 3. Public methods ###

Method signature | Description
---|---
gotoSlide( index ) | Scrolls to the slide at the specified index.
nextSlide() | Scrolls to the next slide.
previousSlide() | Scrolls to the previous slide.
getSlideAt( index ) | Gets all the data of the slide at the specified index. Returns an object that contains all the data specified for that slide.
getSelectedSlide() | Gets the index of the selected slide.
getTotalSlides() | Gets the total number of slides.
update() | This is called by the plugin automatically when a property is changed. You can call this manually in order to refresh the slider after changing its HTML markup (i.e., adding or removing slides).
resize() | This is called by the plugin automatically when the slider changes its size. You can also call it manually if you find it necessary to have the slider resize itself.
addEventListener( type, handler ) | Adds an event listener to the slider.
removeEventListener( type ) | Removes an event listener from the slider.
destroy() | Destroys a slider by removing all the visual elements and functionality added by the plugin. Basically, it leaves the slider in the state it was before the plugin was instantiated.

*Example:*

```javascript
// instantiate the slider and set a few options
const mySlider = new SliderPro( '#my-slider', {
	autoSlideSize: true,
	loop: false
});

// the slider will go to the next slide when the document is clicked
document.addEventListener( 'click', () => {
	mySlider.nextSlide();
});
```

### 4. Events ###

Event type | Description
---|---
beforeInit | Triggered before the slider begins its initialization.
init | Triggered after the slider was setup.
beforeUpdate | Triggered before the slider is updates.
update | Triggered when the 'update' method is called, either automatically or manually.
beforeResize | Triggered before the slider is resized.
resize | Triggered after the slider is resized.
gotoSlide | Triggered when a new slide is selected.<br>Available details:<br>*index*: the index of the selected slide<br>*previousIndex*: the index of the previously selected slide
gotoSlideComplete | Triggered when the animation to the new slide is completed.<br>Available details:<br>*index*: the index of the opened slide

*Example:*

```javascript
// instantiate the slider and set a few options
const mySlider = new SliderPro( '#my-slider', {
	autoSlideSize: true,
	loop: false
});

// the slider will go to the next slide when the document is clicked
document.addEventListener( 'click', () => {
	mySlider.nextSlide();
});

// will show the index of the new slide in the console
mySlider.addEventListener( 'gotoSlide', ( event ) => {
	console.log( event.detail.index );
});
```

## Add-ons ##

Add-ons are optional blocks of code that extend the core functionality, adding more capabilities. This modular architecture makes the code more organized and also allows you to include only the features you will use, resulting in an optimized file size and performance.

### 1. Breakpoints ###

The 'breakpoints' property is assigned an object which contains certain browser window widths and the slider properties that are applied to those specific widths. This is very similar to CSS media queries. However, please note that these custom properties will not be inherited between different breakpoints. The slider's properties will reset to the original values before applying a new set of properties, so if you want a certain property value to persist, you need to set it for each breakpoint.

*Example:*
```javascript
const mySlider = new SliderPro( '#my-slider', {
	width: 960, 
	height: 400,
	orientation: 'horizontal',
	thumbnailPosition: 'right',
	breakpoints: {
		800: {
			thumbnailsPosition: 'bottom',
			thumbnailWidth: 270,
			thumbnailHeight: 100
		},
		500: {
			orientation: 'vertical',
			thumbnailsPosition: 'bottom',
			thumbnailWidth: 120,
			thumbnailHeight: 50
		}
	}
});
```

---

### 2. Fade ###

This add-on replaces the default slide/swipe transition with a fade transition.

__Customizable properties:__ [fade](#fade), [fadeOutPreviousSlide](#fadeoutpreviousslide) and [fadeDuration](#fadeduration).

---

### 3. Caption ###

Allows you to add captions to slides. Captions will be displayed one at a time, below the slides. The caption must be given the `sp-caption` class.

*Example:*

```html
<div class="sp-slide">
	<img class="sp-image" src="path/to/image.jpg"/>
	<p class="sp-caption">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
</div>
```

__Customizable properties:__ [fadeCaption](#fadecaption) and [captionFadeDuration](#captionfadeduration).

---

### 4. Full Screen ###

Allows you to view the slider in fullscreen mode, adding a button in the top-right corner of the slider.

__Customizable properties:__ [fullscreen](#fullscreen) and [fadeFullscreen](#fadefullscreen).

---

### 5. Lazy Loading ###

Enables the slider to load images (slide images and thumbnail images) only when they are in a visible area, thus saving bandwidth by not loading images that won't be viewed by the user. It also makes the initial load of the slider much faster.

*Example:*

```html
<div class="slider-pro">
	<div class="sp-slides">
		<div class="sp-slide">
			<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image1.jpg"/>
		</div>

		<div class="sp-slide">
			<a href="https://bqworks.net">
				<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image2.jpg"/>
			</a>
		</div>

		<div class="sp-slide">
			<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image3.jpg"/>
		</div>
	</div>

	<div class="sp-thumbnails">
		<img class="sp-thumbnail" src="path/to/blank.gif" data-src="path/to/thumbnail1.jpg"/>
		<img class="sp-thumbnail" src="path/to/blank.gif" data-src="path/to/thumbnail2.jpg"/>
	</div>
</div>
```

The `src` attribute of the image will point to a placeholder image, and the actual image will be specified in the `data-src` attribute. When the image becomes visible, the placeholder image will be replaced by the actual image.

---

### 6. Retina ###

Allows you to specify an alternative image for screens with high PPI (pixels per inch), like the 'Retina' screens from Apple devices. Please note that this module will work for any screen that has high PPI, not only for the 'Retina' screens.

The high resolution image needs to be specified in the `data-retina` attribute, as seen below.

*Example:*

```html
<div class="slider-pro">
	<div class="sp-slides">
		<div class="sp-slide">
			<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image1.jpg" data-src="path/to/image1@2x.jpg"/>
		</div>

		<div class="sp-slide">
			<a href="https://bqworks.net">
				<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image2.jpg" data-retina="path/to/image2@2x.jpg"/>
			</a>
		</div>

		<div class="sp-slide">
			<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image3.jpg" data-retina="path/to/image3@2x.jpg"/>
		</div>
	</div>

	<div class="sp-thumbnails">
		<img class="sp-thumbnail" src="path/to/blank.gif" data-src="path/to/thumbnail1.jpg" data-retina="path/to/thumbnail1@2x.jpg"/>
		<img class="sp-thumbnail" src="path/to/blank.gif" data-src="path/to/thumbnail2.jpg" data-retina="path/to/thumbnail2@2x.jpg"/>
	</div>
</div>
```

As can be seen above, the 'Retina' module can work together with the 'Lazy Loading' module.

The slider supports the `srcset` tag, which you can use to specify higher resolution images, so you don't need to use this add-on. This was provided only for backwards compatibility with the jQuery version of the slider, so that users who want to transition from the jQuery version to the Vanilla Javascript version can keep the previous HTML markup.

---

### 7. Conditional Images ###

This modules allows you to specify different image sources for different screen sizes. So, instead of loading large images (suited for desktop screens) on mobile devices, there will be a set of images that will load for smaller screens.

For each image you can specify three different sources in addition to the default source.

*Example:*

```html
<div class="sp-slide">
	<img class="sp-image" src="path/to/blank.gif" 
		data-src="path/to/image_default.jpg"
		data-small="path/to/image_small.jpg"
		data-medium="path/to/image_medium.jpg"
		data-large="path/to/image_large.jpg"/>
</div>
```

The exact size represented by the `data-small`, `data-medium` and `data-large` attributes is given by the `smallSize`, `mediumSize` and `largeSize` properties. By default these are set to 480, 768 and 1024 pixels.

So, the image source specified in the `data-large` attribute will load when the slider's width is smaller than the value of the `largeSize` property (which is 1024, by default). The image source specified in the `data-medium` attribute will load when the slider's width is smaller than the value of the `mediumSize` property and the image source specified in the `data-small` attribute will load when the slider's width is smaller than the value of the `smallSize` property. If the slider's width is above any of these values, the default image source will be loaded.

If you want to specify separate images for Retina (high PPI) displays, you can use the `data-retinasmall`, `data-retinamedium` and `data-retinalarge` attributes (no space between `retina` and the screen size).

*Example:*

```html
<div class="sp-slide">
	<img class="sp-image" src="path/to/blank.gif" 
		data-src="path/to/image_default.jpg"
		data-small="path/to/image_small.jpg"
		data-medium="path/to/image_medium.jpg"
		data-large="path/to/image_large.jpg"
		data-retinasmall="path/to/image_retina_small.jpg"
		data-retinamedium="path/to/image_retina_medium.jpg"
		data-retinalarge="path/to/image_retina_large.jpg"/>
</div>
```

__Customizable properties:__ [smallSize](#smallsize), [mediumSize](#mediumsize) and [largeSize](#largesize).

As with the `Retina` add-on, you don't need to include this add-on, unless you transition from the jQuery version and don't want to update the HTML markup to use the `srcset` tag.

---

### 8. Layers ###

Adds support for layers, which are blocks of text or HTML content that can easily be positioned, sized or animated.

*Example:*

```html
<div class="sp-slide">
	<img class="sp-image" src="path/to/image.jpg"/>

	<h3 class="sp-layer">
		Lorem ipsum dolor sit amet
	</h3>

	<p class="sp-layer">
		consectetur adipisicing elit
	</p>
</div>
```

As can be seen above, the layers need to have the `sp-layer` class, but they can be any HTML element: paragraphs, headings or just DIV elements.

Here is an example that adds some styling and animation parameters:

```html
<div class="sp-slide">
	<img class="sp-image" src="path/to/image.jpg"/>

	<h3 class="sp-layer sp-black"
		data-position="bottomLeft" data-horizontal="10%"
		data-show-transition="left" data-show-delay="300" data-hide-transition="right">
		Lorem ipsum dolor sit amet
	</h3>

	<p class="sp-layer sp-white sp-padding"
		data-width="200" data-horizontal="center" data-vertical="40%"
		data-show-transition="down" data-hide-transition="up">
		consectetur adipisicing elit
	</p>

	<div class="sp-layer sp-static">Static content</div>
</div>
```

There are several predefined classes that can be passed to layers in order to style them. The position, size and animations are set using data attributes.

#### Predefined classes: ####

`sp-static`

>Sets the layer to be visible all the time, not animated.

`sp-black`

>Adds a black and transparent background and makes the font color white.

`sp-white`

>Adds a white and transparent background and makes the font color black.

`sp-padding`

>Adds a 10 pixel padding to the layer.

`sp-rounded`

>Makes the layer's corners rounded.

#### Data attributes: ####

`data-width`

>Sets the width of the layer. Can be set to a fixed or percentage value. If it's not set, the layer's width will adapt to the width of the inner content.

`data-height`

>Sets the height of the layer. Can be set to a fixed or percentage value. If it's not set, the layer's height will adapt to the height of the inner content.

`data-depth`

>Sets the depth (z-index, in CSS terms) of the layer.

`data-position`

>Sets the position of the layer. Can be set to 'topLeft' (which is the default value), 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'centerLeft', 'centerRight' and 'centerCenter'.

`data-horizontal`

>Sets the horizontal position of the layer, using the value specified for data-position as a reference point. Can be set to a fixed or percentage value.

`data-vertical`

>Sets the vertical position of the layer, using the value specified for data-position as a reference point. Can be set to a fixed or percentage value.

`data-show-transition`

>Sets the transition of the layer when it appears in the slide. Can be set to 'left', 'right', 'up' or 'down', these values describing the direction in which the layer will move when it appears.

`data-show-offset`

>Sets an offset for the position of the layer from which the layer will be animated towards the final position when it appears in the slide. Needs to be set to a fixed value.

`data-show-duration`

>Sets the duration of the show transition.

`data-show-delay`

>Sets a delay for the show transition. This delay starts from the moment when the transition to the new slide starts.

`data-hide-transition`

>Sets the transition of the layer when it disappears from the slide. Can be set to 'left', 'right', 'up' or 'down', these values describing the direction in which the layer will move when it disappears.

`data-hide-offset`

>Sets an offset for the position of the layer towards which the layer will be animated from the original position when it disappears from the slide. Needs to be set to a fixed value.

`data-hide-duration`

>Sets the duration of the hide transition.

`data-hide-delay`

>Sets a delay for the hide transition.

`data-stay-duration`

>Sets how much time a layer will stay visible before being hidden automatically.

>The layers are animated using CSS3 transitions in most browsers. In IE9 and IE8 (where CSS3 transitions are not supported), the layers will only fade in/out, and in IE7 and older, the layers will appear without any animation.

__Customizable properties:__ [waitForLayers](#waitforlayers), [autoScaleLayers](#autoscalelayers) and [autoScaleReference](#autoscalereference).

---

### 9. Deep Linking ###

Provides the possibility to link to a specific slide in the slider. You can use this to have the slider opened at a specific slide when the page loads or to navigate to a specific slide at a later time.

The hash that needs to be appended to the URL consists of the 'id' attribute of the slider and the index of the slide separated by a slash character (/). For example, `https://domain.com/page#my-slider/0` will open the first slide (because slide indexes start with 0) in the slider that has the 'id' set to 'my-slider'.

It's also possible to specify the 'id' attribute of the slide instead of its index.

*Example:*

```html
<div id="my-slider" class="slider-pro">
	<div class="sp-slides">
		<div class="sp-slide">
			<img class="sp-image" src="path/to/image1.jpg"/>
		</div>

		<div id="my-slide" class="sp-slide">
			<img class="sp-image" src="path/to/image2.jpg"/>
		</div>

		<div class="sp-slide">
			<img class="sp-image" src="path/to/image3.jpg"/>
		</div>
	</div>
</div>
```

In order to open the second slide, you can use either `https://domain.com/page#my-slider/1` or `https://domain.com/page#my-slider/my-slide`.

__Customizable properties:__ [updateHash](#updatehash).

---

### 10. Autoplay ###

Adds autoplay functionality.

__Customizable properties:__ [autoplay](#autoplay), [autoplayDelay](#autoplaydelay), [autoplayDirection](#autoplaydirection) and [autoplayOnHover](#autoplayonhover).

---

### 11. Touch Swipe ###

Adds touch-swipe functionality for the slides. The module also adds mouse drag functionality on non-touch screen devices.

__Customizable properties:__ [touchSwipe](#touchswipe) and [touchSwipeThreshold](#touchswipethreshold).

---

### 12. Buttons ###

Adds navigation buttons below the slider.

__Customizable properties:__ [buttons](#buttons).

---

### 13. Arrows ###

Adds navigation arrows for the slides.

__Customizable properties:__ [arrows](#arrows) and [fadeArrows](#fadearrows).

---

### 14. Keyboard ###

Adds keyboard navigation support. The arrow keys will move the slider to the next or previous slide, and the Enter key will open the link attached to the slide's main image.

__Customizable properties:__ [keyboard](#keyboard) and [keyboardOnlyOnFocus](#keyboardonlyonfocus).

---

### 15. Thumbnails ###

This module adds support for thumbnails. Thumbnails can contain any HTML content, from simple images to more complex structures that include both text and images.

There are two possible variations for adding thumbnails:

- Add them separately from slides, in their own container, `sp-thumbnails`.

*Example:*

```html
<div class="slider-pro">
	<div class="sp-slides">
		...
	</div>

	<div class="sp-thumbnails">
		<img class="sp-thumbnail" src="path/to/thumbnail.jpg"/>

		<p class="sp-thumbnail">Thumbnail 2</p>

		<div class="sp-thumbnail">
			<img class="sp-thumbnail-image" src="path/to/thumbnail.jpg"/>
			<p class="sp-thumbnail-text">Tempor incididunt ut labore et dolore magna</p>
		</div>
	</div>
</div>
```

- Add each thumbnail in the `sp-slide` element to which it corresponds.

*Example:*

```html
<div class="slider-pro">
	<div class="sp-slides">
		<div class="sp-slide">
			<img class="sp-image" src="path/to/image1.jpg"/>

			<img class="sp-thumbnail" src="path/to/thumbnail.jpg"/>
		</div>

		<div id="my-slide" class="sp-slide">
			<img class="sp-image" src="path/to/image2.jpg"/>

			<p class="sp-thumbnail">Thumbnail 2</p>
		</div>

		<div class="sp-slide">
			<img class="sp-image" src="path/to/image3.jpg"/>

			<div class="sp-thumbnail">
				<img class="sp-thumbnail-image" src="path/to/thumbnail.jpg"/>
				<p class="sp-thumbnail-text">Tempor incididunt ut labore et dolore magna</p>
			</div>
		</div>
	</div>
</div>
```

You can use which variations you think is more semantic for your implementation.

__Customizable properties:__ [thumbnailWidth](#thumbnailwidth), [thumbnailHeight](#thumbnailheight), [thumbnailsPosition](#thumbnailsposition) and [thumbnailPointer](#thumbnailpointer).

---

### 16. Thumbnail Touch Swipe ###

Adds touch swipe functionality for the thumbnails.

__Customizable properties:__ [thumbnailTouchSwipe](#thumbnailtouchswipe). 

---

### 17. Thumbnail Arrows ###

Adds navigation arrows for the thumbnails.

__Customizable properties:__ [thumbnailArrows](#thumbnailarrows) and [fadeThumbnailArrows](#fadethumbnailarrows).

---

### 18. Video ###

Provides automatic control of the videos loaded inside the slider. For example, the video will pause automatically when another slide is selected or, if the autoplay is running, it will be paused when a video starts playing.

The video types or providers supported by this module are: YouTube, Vimeo, HTML5 and Video.js.

In order to have a video automatically controlled by the slider, the video must have the `sp-video` class. Also, there are some provider-specific requirements for the videos, as presented below.

__Customizable properties:__ [reachVideoAction](#reachvideoaction), [leaveVideoAction](#leavevideoaction), [playVideoAction](#playvideoaction), [pauseVideoAction](#pausevideoaction) and [endVideoAction](#endvideoaction).

##### YouTube #####

YouTube videos can be loaded in two ways: by using a poster image with a link to the YouTube video or by inserting directly the video iframe provided by YouTube.

*Example 1:*

```html
<a class="sp-video" href="//www.youtube.com/watch?v=oaDkph9yQBs">
    <img src="path/to/poster.jpg" width="500" height="300"/>
</a>
```

When using the second method, the videos will need to have the `enablejsapi=1` parameter appended to the URL of the video. It's also recommended to append the `wmode=opaque` parameter. The parameters need to be delimited by `&amp;`.

*Example 2:*

```html
<iframe class="sp-video" src="https://www.youtube.com/embed/msIjWthwWwI?enablejsapi=1&amp;wmode=opaque" width="500" height="350" frameborder="0" allowfullscreen></iframe>
```

##### Vimeo #####

Just like YouTube videos, Vimeo videos can also be loaded by using a poster image or by inserting directly the video iframe.

*Example 1:*

```html
<a class="sp-video" href="https://vimeo.com/109354891">
    <img src="path/to/poster.jpg" width="500" height="300"/>
</a>
```

When using the second method, the videos will need to have the `api=1` parameter appended to the URL of the video.

*Example 2:*

```html
<iframe class="sp-video" src="https://player.vimeo.com/video/109354891?api=1" width="500" height="300" frameborder="0" allowfullscreen></iframe>
```

##### HTML5 #####

Simple HTML5 videos don't need any preparations other than having the `sp-video` class.

*Example:*

```html
<video class="sp-video" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none">
	<source src="path/to/video.mp4" type="video/mp4"/>
	<source src="path/to/video.ogv" type="video/ogg"/>
</video>
```

##### Video.js #####

Videos using Video.js also need the `sp-video` class, in addition to the other video.js specific requirements, like adding the `video-js` class or the `data-setup={}` attribute.

*Example:*

```html
<video class="sp-video video-js" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none" data-setup="{}">
	<source src="path/to/video.mp4" type="video/mp4"/>
	<source src="path/to/video.ogv" type="video/ogg"/>
</video>
```

## Support ##

If you found a bug or have a feature suggestion, please submit it in the [Issues tracker](https://github.com/bqworks/slider-pro/issues).

If you need extensive help with implementing the slider in your project, you can contact me.

## License ##

The plugin is available under the <a href="https://opensource.org/licenses/MIT">MIT license</a>.