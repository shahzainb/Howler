define('movingmap', ['jquery'], 

	function ($) {
	'use strict';

	var Movingmap = function (options) {
		this.options = options;
	}

	Movingmap.prototype = {

		defaults : {
			map : null,
			long : 52.5075419,
	    	lat : 13.4261419,
	    	greenIcon : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
	    	blueIcon : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
	    	postsArray : [],
	    	markers : [],
	    	breakScroll: false
		},
		
		init : function () {

			var self = this;

			self.settings = $.extend({}, self.options, self.defaults);

			self.initMap();
			self.initOnResizeMap();

		},

		mapOptions : function () {
    		
    		var self = this;

    		var mapOptions = {
				center: new google.maps.LatLng(self.settings.long,self.settings.lat),
				zoom: 12,
				disableDefaultUI: true
			};

			return mapOptions;
    	},

    	initMap : function () {

    		var self = this;

			google.maps.event.addDomListener(window, 'load', run());

			function run() {
				var map = new google.maps.Map(self.settings.$mapHolder[0], self.settings.mapOptions());
				self.settings.map = map;
				self.settings.$mapHolder.parents('.loading').removeClass('loading');

				self.reset();
				self.createPostsArray();
				self.createMarkers();
				self.placeMarkersOnMap(map);
				self.scroll();
			}			
		},

		reset : function () {

			var self = this;

			$(window).unbind('scroll.movingmap');
			self.settings.postsArray = [];
			self.settings.markers = [];
			self.settings.breakScroll = false;
		},

    	createPostsArray : function () {

    		var self = this;

			$('.post').each(function() {
    			if ($(this).data('long') !== "" && $(this).data('lat') !== "") {
    				self.settings.postsArray.push({
	    				obj: $(this), 
	    				top: $(this).offset().top,
	    				long: $(this).data('long'),
	    				lat: $(this).data('lat'),
	    				hex: $(this).data('hex'),
	    				title: $(this).find('h2 a').html()
	    			});	
    			}
    		});
		},

		createMarkers : function () {
	
			var self = this,
				marker,
				i,
				pinImage = new google.maps.MarkerImage(self.settings.blueIcon);

			for (i = 0; i < self.settings.postsArray.length; i++) {
				
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(self.settings.postsArray[i].long, self.settings.postsArray[i].lat),
					map: self.settings.map,
					title: self.settings.postsArray[i].title,
					icon: pinImage
				});

	     		self.settings.markers.push(marker);
			}			
		},

		placeMarkersOnMap : function (map) {

			var self = this,
				label,
				title,
				marker;

			for (var i = 0; i < self.settings.markers.length; i++) {

				marker = self.settings.markers[i];
				marker.setMap(map);				

				google.maps.event.addListener(marker, "click", function () {
					self.markerAnimation(this);
				});
			}
		},

		markerAnimation : function (marker) {

			var self = this,
				$title = $('.map-title');
			
			$title.html(marker.title);
			self.settings.resetMarkers();
			marker.setIcon(self.settings.greenIcon);
			marker.setAnimation(google.maps.Animation.BOUNCE)
			window.setTimeout(function() {
				marker.setAnimation(null);
			}, 3000);
		},

		resetMarkers : function () {

			var self = this;

			for (var i = 0; i < self.settings.markers.length; i++) {
				self.settings.markers[i].setAnimation(null)
				self.settings.markers[i].setIcon(self.settings.blueIcon);
			}			
		},

		panToMarker : function (long, lat) {

			var self = this,
				latlong = new google.maps.LatLng(long,lat),
				label;

			self.settings.map.panTo(latlong);
		},

		mapStyle : function (hex) {

			var self = this;

			if (hex !== "") {
				var style = [
					{
						featureType: "all",
						stylers: [
							{ hue: hex },
							{ saturation: -50 }
						]
					},{
						featureType: "road.arterial",
						elementType: "geometry",
						stylers: [
							{ hue: hex },
							{ saturation: 0 }
						]
					}
				];
			}
			
			return style;
		},


		scroll : function () {

			var self = this,
				currentTopOfPage = $(window)[0].scrollY,
				i,
				topOfPage,
				post,
				marker;

			$(window).bind('scroll.movingmap', function () {

				topOfPage = $(window)[0].scrollY;

    			if (currentTopOfPage < topOfPage) {
    				for (i = 0; i < self.settings.postsArray.length; i ++) {

    					post = self.settings.postsArray[i];
    					marker = self.settings.markers[i];

    					// If maps edge bottom goes below post top
    					if (topOfPage > (post.top - 500) && !post.obj.hasClass('movingmap')) {
							post.obj.addClass('movingmap');
							self.panToMarker(post.long, post.lat);
							self.markerAnimation(marker);
							self.settings.map.setOptions({styles: self.settings.mapStyle(post.hex)});												
    					}
    				}
    			} else if (currentTopOfPage > topOfPage) {

    				for (i = 0; i < self.settings.postsArray.length; i ++) {

						post = self.settings.postsArray[i];
						marker = self.settings.markers[i];

						// If map top goes above post bottom
    					if (topOfPage < (post.top + post.obj.height() - 200) && post.obj.hasClass('movingmap')) {
    						post.obj.removeClass('movingmap');	
							self.settings.panToMarker(post.long, post.lat);
							self.settings.markerAnimation(marker);
							self.settings.map.setOptions({styles: self.settings.mapStyle(post.hex)});
    					}
       				}
    			}

    			currentTopOfPage = topOfPage;
    		});
		},

		initOnResizeMap : function () {

			var self = this;
			
			setTimeout(function(){
				self.initMap()
			}, 1200);
			
		}

	}

    return Movingmap;

});