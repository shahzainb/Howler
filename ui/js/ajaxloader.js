/*
 * Ajaxloader.js - infinite loading for posts
 *
 * Copyright (c) Charlotte Holmen
 *
 * www.howler.se
 *
 * Version:  1.1
 *
 */

define('ajaxloader', ['jquery', 'lazyload', 'movingmap'],

	function ($, Lazyload, MovingMap) {

	'use strict';

	var AjaxLoader = function (options) {
		this.options = options;
	}

	AjaxLoader.prototype = {
		
		defaults : {
			loading : false
		},

		init : function () {

			var self = this;

			//Merge options and defaults
			self.settings = $.extend({}, self.options, self.defaults);

			self.setup();
			self.scroll();
			self.accessability();
		},

		setup : function () {

			var self = this;

			if (self.settings.$loader.length) {
				self.settings.$loader.show();
				self.settings.loading = false;
				self.settings.$pageBottom.hide();	
			} else {
				self.settings.$pageBottom.show();
			}

			self.settings.$stepLinks.hide();
				
		},

		scroll : function () {

			var self = this,
				y;

			$(window).bind('scroll.ajaxloader', function () {

				//IE fix
            	y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
				
				if (y + $(window).height() >= $(document).height() && self.settings.loading === false) {
					self.settings.loading = true;
					self.settings.loadPosts();
				}
    		});
		},

		loadPosts : function () {

			var self = this,
				data = self.settings.$loader.data(),
				holder = data.holder,
				populateholder = data.populateholder,
				url = data.url,
				currentPagination = self.settings.$loader.parents('.posts--pagination'),
				posts;

			$.ajax({
				url:url,
				type:'GET',
				success: function(data){

					posts = $(data).find(holder).html();
					$(populateholder).append(posts);
					currentPagination.remove();

					if (window.location.search === "") {
						ajaxloader.start();
					}

					//Reinit lazy and map
					Lazyload.start();
					MovingMap.start();
				}
			});
		},

		accessability : function () {

			var self = this;

			self.settings.$loaderImage.bind('click', function (e){
				e.preventDefault();
				window.scrollTo(0,document.body.scrollHeight);
			});
		}
	}

	return AjaxLoader;

});