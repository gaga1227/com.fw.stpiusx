/*
 * touchSwipe - jQuery Plugin
 * https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * http://labs.skinkers.com/touchSwipe/
 * http://plugins.jquery.com/project/touchSwipe
 *
 * Copyright (c) 2010 Matt Bryson (www.skinkers.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * $version: 1.3.1
 */
(function(c){var k="left",j="right",b="up",p="down",h="none",s="horizontal",n="vertical",m="auto",e="all",d="start",g="move",f="end",l="cancel",a="ontouchstart" in window,q="TouchSwipe";var i={fingers:1,threshold:75,maxTimeThreshold:null,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,click:null,triggerOnTouchEnd:true,allowPageScroll:"auto",fallbackToMouseEvents:true};c.fn.swipe=function(u){$this=c(this);var t=$this.data(q);if(t&&typeof u==="string"){if(t[u]){return t[u].apply(this,Array.prototype.slice.call(arguments,1))}else{c.error("Method "+u+" does not exist on jQuery.swipe")}}else{if(!t&&(typeof u==="object"||!u)){return o.apply(this,arguments)}}};c.fn.swipe.defaults=i;c.fn.swipe.phases={PHASE_START:d,PHASE_MOVE:g,PHASE_END:f,PHASE_CANCEL:l};c.fn.swipe.directions={LEFT:k,RIGHT:j,UP:b,DOWN:p};c.fn.swipe.pageScroll={NONE:h,HORIZONTAL:s,VERTICAL:n,AUTO:m};c.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,ALL:e};function o(t){if(t&&(t.allowPageScroll==undefined&&(t.swipe!=undefined||t.swipeStatus!=undefined))){t.allowPageScroll=h}if(!t){t={}}t=c.extend({},c.fn.swipe.defaults,t);return this.each(function(){var v=c(this);var u=v.data(q);if(!u){u=new r(this,t);v.data(q,u)}})}function r(v,x){var G=(a||!x.fallbackToMouseEvents),w=G?"touchstart":"mousedown",S=G?"touchmove":"mousemove",H=G?"touchend":"mouseup",U="touchcancel";var P=c(v);var F="start";var A=null;var L=0;var E={x:0,y:0};var y={x:0,y:0};var Y={x:0,y:0};var O=0;var B=0;var u;try{P.bind(w,t);P.bind(U,D)}catch(W){c.error("events not supported "+w+","+U+" on jQuery.swipe")}this.enable=function(){P.bind(w,t);P.bind(U,D);return P};this.disable=function(){X();return P};this.destroy=function(){X();P.data(q,null);return P};function t(ab){ab=ab.originalEvent;var aa,Z=a?ab.touches[0]:ab;F=d;if(a){L=ab.touches.length}else{ab.preventDefault()}distance=0;direction=null;duration=0;if(!a||(L==x.fingers||x.fingers==e)){E.x=y.x=Z.pageX;E.y=y.y=Z.pageY;O=Q();if(x.swipeStatus){aa=R(ab,F)}}else{D(ab)}if(aa===false){F=l;R(ab,F);return aa}else{P.bind(S,V);P.bind(H,z)}}function V(ac){ac=ac.originalEvent;if(F==f||F==l){return}var aa,Z=a?ac.touches[0]:ac;y.x=Z.pageX;y.y=Z.pageY;B=Q();direction=N();if(a){L=ac.touches.length}F=g;K(ac,direction);if((L==x.fingers||x.fingers==e)||!a){distance=I();duration=C();if(x.swipeStatus){aa=R(ac,F,direction,distance,duration)}if(!x.triggerOnTouchEnd){var ab=!T();if(M()===true){F=f;aa=R(ac,F)}else{if(ab){F=l;R(ac,F)}}}}else{F=l;R(ac,F)}if(aa===false){F=l;R(ac,F)}}function z(aa){aa=aa.originalEvent;aa.preventDefault();B=Q();distance=I();direction=N();duration=C();if(x.triggerOnTouchEnd||(x.triggerOnTouchEnd==false&&F==g)){F=f;if(((L==x.fingers||x.fingers==e)||!a)&&y.x!=0){var Z=!T();if((M()===true||M()===null)&&!Z){R(aa,F)}else{if(Z||M()===false){F=l;R(aa,F)}}}else{F=l;R(aa,F)}}else{if(F==g){F=l;R(aa,F)}}P.unbind(S,V,false);P.unbind(H,z,false)}function D(Z){L=0;E.x=0;E.y=0;y.x=0;y.y=0;Y.x=0;Y.y=0;B=0;O=0}function R(ab,Z){var aa;if(x.swipeStatus){aa=x.swipeStatus.call(P,ab,Z,direction||null,distance||0,duration||0,L)}if(Z==l){if(x.click&&(L==1||!a)&&(isNaN(distance)||distance==0)){aa=x.click.call(P,ab,ab.target)}}if(Z==f){if(x.swipe){aa=x.swipe.call(P,ab,direction,distance,duration,L)}switch(direction){case k:if(x.swipeLeft){aa=x.swipeLeft.call(P,ab,direction,distance,duration,L)}break;case j:if(x.swipeRight){aa=x.swipeRight.call(P,ab,direction,distance,duration,L)}break;case b:if(x.swipeUp){aa=x.swipeUp.call(P,ab,direction,distance,duration,L)}break;case p:if(x.swipeDown){aa=x.swipeDown.call(P,ab,direction,distance,duration,L)}break}}if(Z==l||Z==f){D(ab)}if(aa!==undefined){return aa}}function M(){if(x.threshold!==null){return distance>=x.threshold}else{return null}}function T(){var Z;if(x.maxTimeThreshold){if(duration>=x.maxTimeThreshold){Z=false}else{Z=true}}else{Z=true}return Z}function K(Z,aa){if(x.allowPageScroll==h){Z.preventDefault()}else{var ab=x.allowPageScroll==m;switch(aa){case k:if((x.swipeLeft&&ab)||(!ab&&x.allowPageScroll!=s)){Z.preventDefault()}break;case j:if((x.swipeRight&&ab)||(!ab&&x.allowPageScroll!=s)){Z.preventDefault()}break;case b:if((x.swipeUp&&ab)||(!ab&&x.allowPageScroll!=n)){Z.preventDefault()}break;case p:if((x.swipeDown&&ab)||(!ab&&x.allowPageScroll!=n)){Z.preventDefault()}break}}}function C(){return B-O}function I(){return Math.round(Math.sqrt(Math.pow(y.x-E.x,2)+Math.pow(y.y-E.y,2)))}function J(){var ac=E.x-y.x;var ab=y.y-E.y;var Z=Math.atan2(ab,ac);var aa=Math.round(Z*180/Math.PI);if(aa<0){aa=360-Math.abs(aa)}return aa}function N(){var Z=J();if((Z<=45)&&(Z>=0)){return k}else{if((Z<=360)&&(Z>=315)){return k}else{if((Z>=135)&&(Z<=225)){return j}else{if((Z>45)&&(Z<135)){return p}else{return b}}}}}function Q(){var Z=new Date();return Z.getTime()}function X(){P.unbind(w,t);P.unbind(U,D);P.unbind(S,V);P.unbind(H,z)}}})(jQuery);