/*
 * Lazyload.js 
 *
 * Copyright (c) Charlotte Holmen
 *
 * www.howler.se
 *
 * Version:  1.1
 *
 */

define('lazyload', ['jquery'], 
    function ($) {
    'use strict';

    var Lazyload = function (options) {
        this.options = options;
    }

    Lazyload.prototype = {
        
        defaults : {
            imagesArray : []
        },

        init : function () {

            var self = this;

            self.settings = $.extend({}, self.options, self.defaults);

            self.reset();
            self.setImages();
            self.scroll();
        },

        reset : function () {

            var self = this;

            $(window).unbind('scroll.lazyload');
            self.settings.imagesArray = [];
        },

        setImages : function () {

            var self = this,
                images = $('.lazy');

            images.each(function() {
                if (!$(this).hasClass('loaded')) {
                    self.settings.imagesArray.push({
                        obj: $(this),
                        source: $(this).data('src')
                    });
                }
            });
        },

        scroll : function () {

            var self = this,
                i, src, y;

            $(window).bind('scroll.lazyload', function () {      

                for (i = 0; i < self.settings.imagesArray.length; i++) {
                    y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                    if (y + $(window).height() >= self.settings.imagesArray[i].obj.offset().top) {
                        src = self.settings.imagesArray[i].source;
                        self.settings.imagesArray[i].obj.attr('src', src);
                        self.settings.imagesArray[i].obj.addClass('loaded');
                    }
                }
            });
        }, 
    }

    return Lazyload;

});