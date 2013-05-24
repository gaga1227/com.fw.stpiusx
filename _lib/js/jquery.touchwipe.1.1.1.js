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
(function(a){a.fn.touchwipe=function(c){var b={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){},preventDefaultEvents:true,preventDefaultEventsX:true,preventDefaultEventsY:true};if(c){a.extend(b,c)}if(!b.preventDefaultEventsX||!b.preventDefaultEventsY){b.preventDefaultEvents=false}else{if(b.preventDefaultEventsX&&b.preventDefaultEventsY){b.preventDefaultEvents=true}}this.each(function(){var e,d,i=false;function h(){this.removeEventListener("touchmove",f);e=null;i=false}function f(m){if(b.preventDefaultEvents){m.preventDefault()}if(i){var j=m.touches[0].pageX,n=m.touches[0].pageY,l=e-j,k=d-n;if(Math.abs(l)>=b.min_move_x){h();if(b.preventDefaultEventsX){m.preventDefault()}if(l>0){b.wipeLeft()}else{b.wipeRight()}}else{if(Math.abs(k)>=b.min_move_y){h();if(b.preventDefaultEventsY){m.preventDefault()}if(k>0){b.wipeDown()}else{b.wipeUp()}}}}}function g(j){if(j.touches.length==1){e=j.touches[0].pageX;d=j.touches[0].pageY;i=true;this.addEventListener("touchmove",f,false)}}if("ontouchstart" in document.documentElement){this.addEventListener("touchstart",g,false)}});return this}})(jQuery);