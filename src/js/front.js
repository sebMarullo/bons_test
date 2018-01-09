/* Simple jQuery Slider
 * by Logan Stellway
 * http://www.loganstellway.com
 */
//Document ready best practice as shown on:
//http://gregfranko.com/jquery-best-practices/#/8
(function(code) {
	code(window.jQuery, window, document);
}(function($, window, document) {
	$(function() {
		//Document Ready
	});

	// simpleSlide Plugin
	$.fn.simpleSlide = function(options){
		defaults = {
			'page':0,
			'auto':false,
			'autoTime':10000,
			'autoInteraction':false, // Continue auto after interaction?
			'interval':false,
			'arrows':true,
			'bullets':false,
			'transitionTime':500,
			'hashChange':true,
			'slideSelector':'.slide',
			'count':0,
			'container':$(this),
			//Callbacks
			'onInitiate':function(){},
			'onBeforeSlide':function(){},
			'onAfterSlide':function(){},
			'onSlideStart':function(){},
			'onBulletClick':function(){},
			'onArrowClick':function(){},
			'onPreviousClick':function(){},
			'onNextClick':function(){}
		};
		options = $.extend(defaults,options);

		// Count Slide Elements
		options.count = options.container.find(options.slideSelector).length;

		// Listen For Hash Change
		if(options.hashChange==true){
			if('onhashchange' in window){ //Standard
				$(window).on('hashchange', function() {
					options.hash();
				});
			}else{ //Modified (IE)
				var prevHash = window.location.hash;
				window.setInterval(function(){
					if(window.location.hash != prevHash){
						prevHash = window.location.hash;
						options.hash();
					}
				},100);
			}
		}

		options.hash = function(){
			if(/#slide-/i.test(window.location.hash)){
				clearInterval(options.interval);
				options.page = window.location.hash.split('-')[1];
				options.slide();
			}
		}
		options.initiate = function(){
			options.onInitiate(); // Callback for initiate

			// Autoplay
			if(options.auto){
				options.interval = setInterval(function(){
					options.page++;
					options.slide();
				}, options.autoTime)
			}

			options.container.find(options.slideSelector).css({opacity:0});
			options.hash();
			options.slide();
		}
		options.stopAuto = function(){
			if(!options.autoInteraction){
				clearInterval(options.interval);
			}
		}
		options.slide = function(){
			options.onBeforeSlide(); // Callback Before Slide

			if(options.page>=options.count){options.page=0}
			if(options.page<0){options.page=options.count-1}

			//Bullet
			options.container.find('.slide-bullets a').removeClass('active').eq(options.page).addClass('active');

			//Slide
			options.container.find(options.slideSelector).stop().animate({opacity:0},options.transitionTime/2,'swing',function(){
				options.onSlideStart(); // Callback on Slide Start

				options.container.find(options.slideSelector).hide().removeClass('active')
				.eq(options.page).addClass('active').show().stop().animate({opacity:1},options.transitionTime/2,'swing',function(){
					options.onAfterSlide(); // Callback After Slide
				});
			});
		}
		
		// Arrows
		if(options.arrows){
			$('<a />',{'href':'javascript:void(0)','class':'arrow prev'}).on('click',function(){
				options.onArrowClick();
				options.onPreviousClick();

				options.stopAuto();
				options.page--;
				options.slide();
			}).append('<span />').appendTo(options.container);
			$('<a />',{'href':'javascript:void(0)','class':'arrow next'}).on('click',function(){
				options.onArrowClick();
				options.onNextClick();

				options.stopAuto();
				options.page++;
				options.slide();
			}).append('<span />').appendTo(options.container);
		}

		// Bullets
		if(options.bullets){
			bullets = $('<div />',{'class':'slide-bullets'});
			for(var i=0;i<options.count;i++){
				$('<a />',{href:'javascript:void(0)'}).on('click',function(){
					options.onBulletClick(); // Callback on Bullet Click

					options.stopAuto();
					options.page = $(this).index();
					options.slide();
				}).appendTo(bullets);
			}
			options.container.append(bullets);
		}

		// Initiate Slide
		options.initiate();
	};
}));

/* General Functions */
$(function(){
	homeSlider();
	homeSlider2();
})

/* Principal Hero Content Slider*/
function homeSlider(){
	window.slider = $('#slide');
	window.slider.simpleSlide({
	'auto':true,
	'bullets':false,
	'slideSelector':'.slid',
	'onInitiate':function(){
		window.slider.find('a.arrow.prev').addClass('icon-HeroSlider-ArrowLeft');
		window.slider.find('a.arrow.next').addClass('icon-HeroSlider-ArrowRight');
		}
	});
	$(".preload").hide();	
}

/* Second Video Content Slider*/
function homeSlider2(){
	window.slider = $('#slide2');
	window.slider.simpleSlide({
	'auto':true,
	'bullets':false,
	'slideSelector':'.slid',
	'onInitiate':function(){
		window.slider.find('a.arrow.prev').addClass('icon-HeroSlider-ArrowLeft');
		window.slider.find('a.arrow.next').addClass('icon-ArrowRight--Black');
		}
	});
	$(".preload").hide();	
}

