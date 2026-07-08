var spriteImages = document.querySelectorAll('.slide-item__image');
var spriteImagesSrc = [];
var texts = [];

document.addEventListener('DOMContentLoaded', function () {
  // Remove the #prizes section
  let scheduleSection = document.getElementById('schedule');
  if (scheduleSection) {
    scheduleSection.remove();
  } else {
    console.log('Schedule section not found.');
  }

  // Remove all elements with class "prizeTrackDiv"
  let prizeDivs = document.querySelectorAll('.prizeTrackDiv');
  prizeDivs.forEach((div) => div.remove());

  let trackDivs = document.querySelectorAll('.makeStyles-mt_50-51');
  trackDivs.forEach((div) => div.remove());

  let sponsorDivs = document.querySelectorAll('.makeStyles-root-56');
  sponsorDivs.forEach((div) => div.remove());
});

for (var i = 0; i < spriteImages.length; i++) {
  var img = spriteImages[i];
  // Set the texts you want to display to each slide
  // in a sibling element of your image and edit accordingly
  if (img.nextElementSibling) {
    texts.push(img.nextElementSibling.innerHTML);
  } else {
    texts.push('');
  }
  spriteImagesSrc.push(img.getAttribute('src'));
}

/*var initCanvasSlideshow = new CanvasSlideshow({
  sprites: spriteImagesSrc,
  texts: texts,
  displacementImage: 'img/dmaps/2048x2048/ripple.jpg',
  fullScreen: true,
  centerSprites: false
});*/
