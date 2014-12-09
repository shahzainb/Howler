/*
 * Swipeshow.js - Slideshow with swipe support
 *
 * Copyright (c) Charlotte Holmen
 *
 * www.howler.se
 *
 * Version:  1.1
 *
 */



define('swipeshow', ['jquery'], 
	function ($) {

	'use strict';

	var Swipeshow = function (options) {
		this.options = options;
	}

	Swipeshow.prototype = {

		defaults : {
			imagesArray : [],
			swipeshowLeftOffset : 0,
			swipeDelay : 30,
			auto : true,
			enableArrows : false
		},

		init : function () {

			var self = this,
				images = $('img', self.$element);

			if ($(window).width() > 479) {
				self.defaults.enableArrows = true;
			} else if ($(window).width() > 1023) {
				self.defaults.swipeDelay = 300;
			}

			self.settings = $.extend({}, self.options, self.defaults);

			if (self.settings.enableArrows) {
				self.settings.$arrowBack.show();
				self.settings.$arrowForward.show();
			}
			
			//Save images in array
			images.each(function() {
				self.settings.imagesArray.push($(this));
			});

			//Set $holder width
			self.settings.$holder.css('width', (self.imagesArray.length * 100) + '%');

			self.resetImages();
		},

		swipeshowWidth : function () {

			var self = this;

			return self.settings.$element[0].scrollWidth;
		},

		imageWidth : function () {

			var self = this;

			return Math.floor(self.settings.$element[0].scrollWidth / self.imagesArray.length);
		},

		resetImages : function (direction) {	

			var self = this,
				i,
    			images,
    			htmlString = '';
    			
			// Current image is always number 2 in imagesArray. 
			// Replace html string with current array
			if (direction === 'forward') {
				self.settings.imagesArray.push(self.settings.imagesArray[0]);
				self.settings.imagesArray.shift();
			} else {
				self.settings.imagesArray.unshift(self.settings.imagesArray[self.settings.imagesArray.length - 1]);
				self.settings.imagesArray.pop();
			}
			
			for (i = 0; i < self.settings.imagesArray.length; i++) {
				htmlString = htmlString + self.settings.imagesArray[i][0].outerHTML;
			}

			self.settings.$holder.html(htmlString);

			images = $('img', self.settings.$holder);
			images.css('width', (100 / self.settings.imagesArray.length) + '%');
			self.settings.$element.scrollLeft(self.settings.imageWidth());
			self.settings.swipeshowLeftOffset = self.settings.imageWidth();

			self.enableSwipes();
    	},

		enableSwipes : function () {

			var self = this;

			self.settings.$element.bind("scroll", function(){
				if (!self.settings.$element.hasClass('active')) {
					self.settings.manuelSwipe();
				}
			});
			
			if (self.settings.enableArrows) {
				self.settings.$arrowBack.bind('click', function (e) {
					e.preventDefault();
					if (!self.settings.$element.hasClass('active')) {
						self.settings.auto = false;
						self.backAnimation();
					}
				});

				self.settings.$arrowForward.bind('click', function (e) {
					e.preventDefault();
					if (!self.settings.$element.hasClass('active')) {
						self.settings.auto = false;
						self.forwardAnimation();
					}
				});
			}

			self.settings.disableAutoSwipe();

			if (self.settings.auto === true) {
				self.autoSwipe();
			}

			self.settings.$element.removeClass('active');
		},

		disableSwipes : function () {

			var self = this;

			self.settings.$element.addClass('active');
    	}, 

    	autoSwipe : function () {

    		var self = this;

    		var interval = setInterval(function(){
    			self.forwardAnimation();
    		}, 5000);

    		self.settings.interval = interval;
    	},

    	disableAutoSwipe : function () {

    		var self = this;

    		clearInterval(self.settings.interval);
    	},

		manuelSwipe : function () {

			var self = this;

			if (self.settings.swipeshowLeftOffset !== self.settings.$element[0].scrollLeft) {
				self.settings.auto = false;
			}

			self.preventScrollTooFar();

	        //If swipe half the picture - Wait until swipe stopped, then do animation
			clearTimeout($.data(swipeshow, 'scrollTimer'));
			$.data(swipeshow, 'scrollTimer', setTimeout(function() {

				
				if (self.settings.swipeshowLeftOffset < self.settings.$element[0].scrollLeft) {
					self.disableSwipes();
					self.forwardAnimation();
				} else if (self.settings.swipeshowLeftOffset > self.settings.$element[0].scrollLeft) {
					self.disableSwipes();
					self.backAnimation();
				}			

			}, self.settings.swipeDelay));
		},

		preventScrollTooFar : function () {

			var self = this;

			//If swipe the whole picture - STOP
			if (self.settings.swipeshowLeftOffset < self.settings.$element[0].scrollLeft) {
	        	if (self.settings.$element[0].scrollLeft >= (self.imageWidth() * 2)) {
	        		self.settings.$element[0].scrollLeft = self.imageWidth() * 2;
	        		self.resetImages('forward');
	        	}
	        } else if (self.settings.swipeshowLeftOffset > self.settings.$element[0].scrollLeft) {
	        	if (self.settings.$element[0].scrollLeft === 0) {
	        		self.settings.$element[0].scrollLeft = 0;
	        		self.resetImages('back');
	        	}
	        }
		},

		forwardAnimation : function () {

			var self = this;

    		self.disableSwipes();
			self.animation('forward', self.imageWidth() * 2);
    	},

    	backAnimation : function () {

    		var self = this;

    		self.disableSwipes();
			self.animation('back', 0);
    	},

    	animation : function (direction, goToOffset) {

    		var self = this;

    		self.settings.$element.animate({scrollLeft: goToOffset}, 400, function() {
				clearTimeout($.data(self, 'scrollTimer'));
    			$.data(self, 'scrollTimer', setTimeout(function() {
					self.resetImages(direction);
				}, 10));
			});
    	}

	}


    return Swipeshow;

});