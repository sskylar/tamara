/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(2);

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3)(__webpack_require__(4))

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(src) {
		if (typeof execScript !== "undefined")
			execScript(src);
		else
			eval.call(null, src);
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "'use strict';\n\n/**\n * zoom.js - It's the best way to zoom an image\n * @version v0.0.2\n * @link https://github.com/fat/zoom.js\n * @license MIT\n */\n\n+function ($) {\n  \"use strict\";\n\n  /**\n   * The zoom service\n   */\n\n  function ZoomService() {\n    this._activeZoom = this._initialScrollPosition = this._initialTouchPosition = this._touchMoveListener = null;\n\n    this._$document = $(document);\n    this._$window = $(window);\n    this._$body = $(document.body);\n\n    this._boundClick = $.proxy(this._clickHandler, this);\n  }\n\n  ZoomService.prototype.listen = function () {\n    this._$body.on('click', '[data-action=\"zoom\"]', $.proxy(this._zoom, this));\n  };\n\n  ZoomService.prototype._zoom = function (e) {\n    var target = e.target;\n\n    if (!target || target.tagName != 'IMG') return;\n\n    if (this._$body.hasClass('zoom-overlay-open')) return;\n\n    if (e.metaKey || e.ctrlKey) {\n      return window.open(e.target.getAttribute('data-original') || e.target.src, '_blank');\n    }\n\n    if (target.width >= $(window).width() - Zoom.OFFSET) return;\n\n    this._activeZoomClose(true);\n\n    this._activeZoom = new Zoom(target);\n    this._activeZoom.zoomImage();\n\n    // todo(fat): probably worth throttling this\n    this._$window.on('scroll.zoom', $.proxy(this._scrollHandler, this));\n\n    this._$document.on('keyup.zoom', $.proxy(this._keyHandler, this));\n    this._$document.on('touchstart.zoom', $.proxy(this._touchStart, this));\n\n    // we use a capturing phase here to prevent unintended js events\n    // sadly no useCapture in jquery api (http://bugs.jquery.com/ticket/14953)\n    if (document.addEventListener) {\n      document.addEventListener('click', this._boundClick, true);\n    } else {\n      document.attachEvent('onclick', this._boundClick, true);\n    }\n\n    if ('bubbles' in e) {\n      if (e.bubbles) e.stopPropagation();\n    } else {\n      // Internet Explorer before version 9\n      e.cancelBubble = true;\n    }\n  };\n\n  ZoomService.prototype._activeZoomClose = function (forceDispose) {\n    if (!this._activeZoom) return;\n\n    if (forceDispose) {\n      this._activeZoom.dispose();\n    } else {\n      this._activeZoom.close();\n    }\n\n    this._$window.off('.zoom');\n    this._$document.off('.zoom');\n\n    document.removeEventListener('click', this._boundClick, true);\n\n    this._activeZoom = null;\n  };\n\n  ZoomService.prototype._scrollHandler = function (e) {\n    if (this._initialScrollPosition === null) this._initialScrollPosition = $(window).scrollTop();\n    var deltaY = this._initialScrollPosition - $(window).scrollTop();\n    if (Math.abs(deltaY) >= 40) this._activeZoomClose();\n  };\n\n  ZoomService.prototype._keyHandler = function (e) {\n    if (e.keyCode == 27) this._activeZoomClose();\n  };\n\n  ZoomService.prototype._clickHandler = function (e) {\n    if (e.preventDefault) e.preventDefault();else event.returnValue = false;\n\n    if ('bubbles' in e) {\n      if (e.bubbles) e.stopPropagation();\n    } else {\n      // Internet Explorer before version 9\n      e.cancelBubble = true;\n    }\n\n    this._activeZoomClose();\n  };\n\n  ZoomService.prototype._touchStart = function (e) {\n    this._initialTouchPosition = e.touches[0].pageY;\n    $(e.target).on('touchmove.zoom', $.proxy(this._touchMove, this));\n  };\n\n  ZoomService.prototype._touchMove = function (e) {\n    if (Math.abs(e.touches[0].pageY - this._initialTouchPosition) > 10) {\n      this._activeZoomClose();\n      $(e.target).off('touchmove.zoom');\n    }\n  };\n\n  /**\n   * The zoom object\n   */\n  function Zoom(img) {\n    this._fullHeight = this._fullWidth = this._overlay = this._targetImageWrap = null;\n\n    this._targetImage = img;\n\n    this._$body = $(document.body);\n  }\n\n  Zoom.OFFSET = 80;\n  Zoom._MAX_WIDTH = 2560;\n  Zoom._MAX_HEIGHT = 4096;\n\n  Zoom.prototype.zoomImage = function () {\n    var img = document.createElement('img');\n    img.onload = $.proxy(function () {\n      this._fullHeight = Number(img.height);\n      this._fullWidth = Number(img.width);\n      this._zoomOriginal();\n    }, this);\n    img.src = this._targetImage.src;\n  };\n\n  Zoom.prototype._zoomOriginal = function () {\n    this._targetImageWrap = document.createElement('div');\n    this._targetImageWrap.className = 'zoom-img-wrap';\n\n    this._targetImage.parentNode.insertBefore(this._targetImageWrap, this._targetImage);\n    this._targetImageWrap.appendChild(this._targetImage);\n\n    $(this._targetImage).addClass('zoom-img').attr('data-action', 'zoom-out');\n\n    this._overlay = document.createElement('div');\n    this._overlay.className = 'zoom-overlay';\n\n    document.body.appendChild(this._overlay);\n\n    this._calculateZoom();\n    this._triggerAnimation();\n  };\n\n  Zoom.prototype._calculateZoom = function () {\n    this._targetImage.offsetWidth; // repaint before animating\n\n    var originalFullImageWidth = this._fullWidth;\n    var originalFullImageHeight = this._fullHeight;\n\n    var scrollTop = $(window).scrollTop();\n\n    var maxScaleFactor = originalFullImageWidth / this._targetImage.width;\n\n    var viewportHeight = $(window).height() - Zoom.OFFSET;\n    var viewportWidth = $(window).width() - Zoom.OFFSET;\n\n    var imageAspectRatio = originalFullImageWidth / originalFullImageHeight;\n    var viewportAspectRatio = viewportWidth / viewportHeight;\n\n    if (originalFullImageWidth < viewportWidth && originalFullImageHeight < viewportHeight) {\n      this._imgScaleFactor = maxScaleFactor;\n    } else if (imageAspectRatio < viewportAspectRatio) {\n      this._imgScaleFactor = viewportHeight / originalFullImageHeight * maxScaleFactor;\n    } else {\n      this._imgScaleFactor = viewportWidth / originalFullImageWidth * maxScaleFactor;\n    }\n  };\n\n  Zoom.prototype._triggerAnimation = function () {\n    this._targetImage.offsetWidth; // repaint before animating\n\n    var imageOffset = $(this._targetImage).offset();\n    var scrollTop = $(window).scrollTop();\n\n    var viewportY = scrollTop + $(window).height() / 2;\n    var viewportX = $(window).width() / 2;\n\n    var imageCenterY = imageOffset.top + this._targetImage.height / 2;\n    var imageCenterX = imageOffset.left + this._targetImage.width / 2;\n\n    this._translateY = viewportY - imageCenterY;\n    this._translateX = viewportX - imageCenterX;\n\n    var targetTransform = 'scale(' + this._imgScaleFactor + ')';\n    var imageWrapTransform = 'translate(' + this._translateX + 'px, ' + this._translateY + 'px)';\n\n    if ($.support.transition) {\n      imageWrapTransform += ' translateZ(0)';\n    }\n\n    $(this._targetImage).css({\n      '-webkit-transform': targetTransform,\n      '-ms-transform': targetTransform,\n      'transform': targetTransform\n    });\n\n    $(this._targetImageWrap).css({\n      '-webkit-transform': imageWrapTransform,\n      '-ms-transform': imageWrapTransform,\n      'transform': imageWrapTransform\n    });\n\n    this._$body.addClass('zoom-overlay-open');\n  };\n\n  Zoom.prototype.close = function () {\n    this._$body.removeClass('zoom-overlay-open').addClass('zoom-overlay-transitioning');\n\n    // we use setStyle here so that the correct vender prefix for transform is used\n    $(this._targetImage).css({\n      '-webkit-transform': '',\n      '-ms-transform': '',\n      'transform': ''\n    });\n\n    $(this._targetImageWrap).css({\n      '-webkit-transform': '',\n      '-ms-transform': '',\n      'transform': ''\n    });\n\n    if (!$.support.transition) {\n      return this.dispose();\n    }\n\n    $(this._targetImage).one($.support.transition.end, $.proxy(this.dispose, this)).emulateTransitionEnd(300);\n  };\n\n  Zoom.prototype.dispose = function () {\n    if (this._targetImageWrap && this._targetImageWrap.parentNode) {\n      $(this._targetImage).removeClass('zoom-img').attr('data-action', 'zoom');\n\n      this._targetImageWrap.parentNode.replaceChild(this._targetImage, this._targetImageWrap);\n      this._overlay.parentNode.removeChild(this._overlay);\n\n      this._$body.removeClass('zoom-overlay-transitioning');\n    }\n  };\n\n  // wait for dom ready (incase script included before body)\n  $(function () {\n    new ZoomService().listen();\n  });\n}(jQuery);"

/***/ }
/******/ ]);