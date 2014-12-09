define('main', ['jquery', 'swipeshow', 'movingmap', 'activify', 'ajaxloader', 'lazyload'],

    function ($, Swipeshow, MovingMap, Activify, Ajaxloader, Lazyload) {
    'use strict';

    var Main = function (){};
	
	Main.prototype = {

		init : function () {
			this.documentSetup();
			this.activifyInit();
			this.swipeshowInit();
			this.lazyInit();
			this.movingMapInit();
			this.ajaxloaderInit();
		},

		documentSetup : function () {
			$('html').addClass('js');
		},

		activifyInit : function () {

			if ($('.main--nav-trigger').length) {

				var toggleNav = new Activify({
			    	$trigger: $('.main--nav-trigger'),
			    	$target: $('.main--nav-target'),
			    	reInitMap: false
				});

				toggleNav.init();
			}

			if ($('.aside--trigger').length) {
				
				var toggleSidebar = new Activify({
			    	$trigger: $('.aside--trigger'),
			    	$target: $('.aside--target'),
			    	reInitMap: true
				});

				toggleSidebar.init();
			}
		},

		swipeshowInit : function () {

			var $djangoPlugin = $('.slideshow .cms_placeholder');

			if ($('.slideshow').length && $djangoPlugin.length !== 1) {
				berlinSlide = new Swipeshow({
					$element: $('.slideshow'),
					$holder: $('.slideshow-holder'),
					$arrowBack: $('.arrow-back'),
					$arrowForward: $('.arrow-forward')
				});

				berlinSlide.init();
			}
		},

		lazyInit : function () {

			if ($('.lazy').length) {
				var lazy = new Lazyload();
				lazy.init();
			}

		},

		movingMapInit : function () {

			if ($('.mymap').length) {
				var berlinMap = new MovingMap({
					$mapHolder: $('.mymap')
				});
				berlinMap.init();
			}
		},

		ajaxloaderInit : function () {
			if (window.location.search === "" && $('.posts--pagination').length) {

				var berlinGuidePostLoad = new Ajaxloader({
					$loader : $('.ajax-loader'),
					$pageBottom: $('.page-bottom'),
					$stepLinks: $('.step-links'),
					$loaderImage: $('.ajax-loader--image')
				});

				berlinGuidePostLoad.init();
			}
		}
	};


	$(document).ready(function () {
		new Main.init();
	});
    
});