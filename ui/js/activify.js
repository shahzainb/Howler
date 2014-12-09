/*
 * Activify.js - toggle element with class active 
 *
 * Copyright (c) Charlotte Holmen
 *
 * www.howler.se
 *
 * Version:  1.1
 *
 */

 define('activify', ['jquery', 'movingmap'], 

	function ($, MovingMap) {
	'use strict';

	var Activify = function (options) {
		this.options = options;
	};

	Activify.prototype = {

		defaults : {},

		init : function () {

			var self = this;

			self.settings = $.extend({}, self.options, self.defaults);

			self.setup();

		},

		setup : function () {

			var self = this;

			self.settings.$trigger.bind('click', function (e) {
				e.preventDefault();
				if (self.settings.$target.hasClass('active')) {
					self.settings.$target.removeClass('active');
				} else {
					self.settings.$target.addClass('active');
				}
				if (self.settings.reInitMap === true) {
					MovingMap.initOnResizeMap();
				}
			});
		}
	};

	return Activify;

});