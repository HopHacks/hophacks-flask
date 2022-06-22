// imagesLoaded(document.body, () => document.body.classList.remove('loading'));
                
var spriteImages = document.querySelectorAll( '.slide-item__image' );
var spriteImagesSrc = [];
var texts = [];

for ( var i = 0; i < spriteImages.length; i++ ) {
    var img = spriteImages[i];
    // Set the texts you want to display to each slide 
    // in a sibling element of your image and edit accordingly
    if ( img.nextElementSibling ) {
        texts.push(img.nextElementSibling.innerHTML);
    } else {
        texts.push('');
    }
    spriteImagesSrc.push( img.getAttribute('src' ) );
}

var initCanvasSlideshow = new CanvasSlideshow({
    sprites: spriteImagesSrc,
    displacementImage: 'img/dmaps/2048x2048/ripple.jpg',
    autoPlay: true,
    autoPlaySpeed: [0.1, 0.1],
    centerSprites: false
});