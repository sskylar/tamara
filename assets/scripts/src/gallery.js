import imagesLoaded from 'imagesLoaded';
import Flickity from 'flickity';
import baguetteBox from 'baguetteBox.js';

let isMobileStyling = (window.innerWidth <= 600); // this should stay in sync with the CSS variable
let sliders = document.querySelectorAll('.slider__items.has-flickity');

baguetteBox.run('.slider__items');

if (sliders.length) {
  for (var i = sliders.length - 1; i >= 0; i--) {
    let slider = sliders[i];
    let images = slider.querySelectorAll('img');

    imagesLoaded(images, function(){
      new Flickity(slider, {
        adaptiveHeight: true,
        cellAlign: 'left',
        draggable: isMobileStyling, // otherwise the lightbox interferes
        pageDots: false,
        wrapAround: true
      });
    });
  }
}