define('main', ['jquery', 'swipeshow', 'movingmap', 'activify', 'ajaxloader', 'lazyload'],

    function ($, Swipeshow, MovingMap, Activify, Ajaxloader, Lazyload) {
    'use strict';

	var main = {

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
			Swipeshow.start();
		},

		lazyInit : function () {
			Lazyload.start();
		},

		movingMapInit : function () {
			MovingMap.start();
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
		main.init();
	});
    
});