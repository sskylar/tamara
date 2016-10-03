import imagesLoaded from 'imagesLoaded';
import Flickity from 'flickity';

let sliders = document.querySelectorAll('.slider__items.has-flickity');

if (sliders.length) {
  for (var i = sliders.length - 1; i >= 0; i--) {
    let slider = sliders[i];
    let images = slider.querySelectorAll('img');

    imagesLoaded(images, function(){
      new Flickity(slider, {
        adaptiveHeight: true,
        cellAlign: 'left',
        pageDots: false,
        wrapAround: true
      });
    });
  }
}