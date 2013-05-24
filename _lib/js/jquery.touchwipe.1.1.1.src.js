/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (2nd August 2012) by JX - Adding 'preventDefaultEventsX' and 'preventDefaultEventsY' to config
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function($) { 
   $.fn.touchwipe = function(settings) {
     var config = {
    		min_move_x: 20,
    		min_move_y: 20,
 			wipeLeft: function() { },
 			wipeRight: function() { },
 			wipeUp: function() { },
 			wipeDown: function() { },
			preventDefaultEvents: true,
			preventDefaultEventsX: true,//(2nd August 2012) by JX
			preventDefaultEventsY: true//(2nd August 2012) by JX
	 };
     
     if (settings) $.extend(config, settings);
	 
	 //(2nd August 2012) by JX
	 if (!config.preventDefaultEventsX || !config.preventDefaultEventsY) {
	 	config.preventDefaultEvents = false; 
	 } else if (config.preventDefaultEventsX && config.preventDefaultEventsY) {
		config.preventDefaultEvents = true; 
	 }//end of update
 
     this.each(function() {
    	 var startX,
    	 	 startY,
		 	 isMoving = false;

    	 function cancelTouch() {
    		 this.removeEventListener('touchmove', onTouchMove);
    		 startX = null;
    		 isMoving = false;
    	 }	
    	 
    	 function onTouchMove(e) {
    		 if(config.preventDefaultEvents) {
    			 e.preventDefault();
    		 }
    		 if(isMoving) {
	    		 var x = e.touches[0].pageX,
				 	 y = e.touches[0].pageY,
	    			 dx = startX - x,
	    		 	 dy = startY - y;
	    		 if(Math.abs(dx) >= config.min_move_x) {
	    			cancelTouch();
					//(2nd August 2012) by JX
					if(config.preventDefaultEventsX) {
						e.preventDefault();
					}//end of update
					if(dx > 0) {
	    				config.wipeLeft();
	    			} else {
	    				config.wipeRight();
	    			}
	    		 } else if(Math.abs(dy) >= config.min_move_y) {
					cancelTouch();
					//(2nd August 2012) by JX
					if(config.preventDefaultEventsY) {
						e.preventDefault();
					}//end of update
					if(dy > 0) {
						config.wipeDown();
					} else {
						config.wipeUp();
					}
				 }
    		 }
    	 }
    	 
    	 function onTouchStart(e) {
    		 if (e.touches.length == 1) {
    			 startX = e.touches[0].pageX;
    			 startY = e.touches[0].pageY;
    			 isMoving = true;
    			 this.addEventListener('touchmove', onTouchMove, false);
    		 }
    	 }    	 
    	 if ('ontouchstart' in document.documentElement) {
    		 this.addEventListener('touchstart', onTouchStart, false);
    	 }
     });
 
     return this;
   };
 
 })(jQuery);
