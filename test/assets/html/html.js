export const basicSlider = `
<div id="slider" class="slider-pro sp-no-js">
    <div class="sp-slides">
        <div class="sp-slide">1</div>
        <div class="sp-slide">2</div>
        <div class="sp-slide">3</div>
        <div class="sp-slide">4</div>
        <div class="sp-slide">5</div>
    </div>
</div>`;

export const captionSlider = `
<div class="slider-pro sp-no-js">
    <div class="sp-slides">
        <div class="sp-slide"><div class="sp-caption">Caption 1</div></div>
        <div class="sp-slide"><div class="sp-caption">Caption 2</div></div>
        <div class="sp-slide"><div class="sp-caption">Caption 3</div></div>
        <div class="sp-slide"><div class="sp-caption">Caption 4</div></div>
        <div class="sp-slide"><div class="sp-caption">Caption 5</div></div>
    </div>
</div>`;

export const conditionalImagesSlider = `
<div class="slider-pro sp-no-js">
    <div class="sp-slides">
        <div class="sp-slide">
            <img class="sp-image" src="blank.gif" data-src="medium1.jpg" data-small="small1.jpg" data-medium="medium1.jpg" data-large="large1.jpg" />
        </div>
        <div class="sp-slide">
            <img class="sp-image" src="blank.gif" data-src="medium2.jpg" data-small="small2.jpg" data-medium="medium2.jpg" data-large="large2.jpg" />
        </div>
        <div class="sp-slide">
            <img class="sp-image" src="blank.gif" data-src="medium3.jpg" data-small="small3.jpg" data-medium="medium3.jpg" data-large="large3.jpg" />
        </div>
        <div class="sp-slide">
            <img class="sp-image" src="blank.gif" data-src="medium4.jpg" data-small="small4.jpg" data-medium="medium4.jpg" data-large="large4.jpg" />
        </div>
        <div class="sp-slide">
            <img class="sp-image" src="blank.gif" data-src="medium5.jpg" data-small="small5.jpg" data-medium="medium5.jpg" data-large="large5.jpg" />
        </div>
    </div>
</div>`;

export const keyboardSlider = `
<div class="slider-pro sp-no-js">
    <div class="sp-slides">
        <div class="sp-slide">
            <a href="#"><img class="sp-image" src="blank.gif" /></a>
        </div>
        <div class="sp-slide">
            <a href="#"><img class="sp-image" src="blank.gif" /></a>
        </div>
        <div class="sp-slide">
            <a href="#"><img class="sp-image" src="blank.gif" /></a>
        </div>
        <div class="sp-slide">
            <a href="#"><img class="sp-image" src="blank.gif" /></a>
        </div>
        <div class="sp-slide">
            <a href="#"><img class="sp-image" src="blank.gif" /></a>
        </div>
    </div>
</div>`;

export const thumbnailSlider = `
<div id="slider" class="slider-pro sp-no-js">
    <div class="sp-slides">
        <div class="sp-slide">1</div>
        <div class="sp-slide">2</div>
        <div class="sp-slide">3</div>
        <div class="sp-slide">4</div>
        <div class="sp-slide">5</div>
    </div>
    <div class="sp-thumbnails">
        <div class="sp-thumbnail">1</div>
        <div class="sp-thumbnail">2</div>
        <div class="sp-thumbnail">3</div>
        <div class="sp-thumbnail">4</div>
        <div class="sp-thumbnail">5</div>
    </div>
</div>`;

export const HTML5Video = `
<video id="my-video" class="video" poster="poster.jpg" width="500" height="350" controls="controls" preload="none">
    <source src="video.mp4" type="video/mp4"/>
</video>
`;

export const YouTubeVideo = `
<iframe class="video" src="//www.youtu.be/embed/12345abc?enablejsapi=1&amp;wmode=opaque&rel=0" width="500" height="350" frameborder="0" allowfullscreen></iframe>
`;

export const VimeoVideo = `
<iframe class="video" src="//player.vimeo.com/video/12345" width="500" height="350" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
`;

export const VideoJSVideo = `
<video id="my-video" class="video video-js vjs-default-skin" poster="poster.jpg" width="500" height="350" controls="controls" preload="none" data-setup="{}">
	<source src="video.mp4" type="video/mp4"/>
</video>
`;

export const videoSlider = `
<script></script>
<div id="slider" class="slider-pro sp-no-js">
    <div class="sp-slides">
        <div class="sp-slide">
            <video id="video-1" class="sp-video mock-video" poster="poster.jpg" width="500" height="350" controls="controls" preload="none">
                <source src="video.mp4" type="video/mp4"/>
            </video>
        </div>
        <div class="sp-slide">
            <video id="video-2" class="sp-video mock-video" poster="poster.jpg" width="500" height="350" controls="controls" preload="none">
                <source src="video.mp4" type="video/mp4"/>
            </video>
        </div>
        <div class="sp-slide">
            <a id="video-3" class="sp-video mock-video" href="//www.youtu.be/watch?v=12345abc">
                <img src="poster.jpg" width="500" height="300"/>
            </a>
        </div>
        <div class="sp-slide">
            <a id="video-4" class="sp-video mock-video" href="//vimeo.com/12345abc">
                <img src="poster.jpg" width="500" height="300"/>
            </a>
        </div>
    </div>
</div>`;