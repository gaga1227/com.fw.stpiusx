/* ------------------------------------------------------------------------------ */
/* common - debug - log */
/* ------------------------------------------------------------------------------ */
if(!window.console){console={log:function(a){alert(a)}}};
/* ------------------------------------------------------------------------------ */
/* common - debug - displayDebugInfo */
/* ------------------------------------------------------------------------------ */
function displayDebugInfo(debug){
	//vars
	var $debug = $(debug),
		updateDebugInfo = function(){
			$debug.attr('data-width',$(window).width());
		};
	//init and bind event
	$debug
		.css('opacity', '0')
		.on('click', function(e){
		e.preventDefault();
		Number($debug.css('opacity')) > 0 ? $debug.css('opacity', '0') : $debug.css('opacity', '1');
	});
	//update info
	updateDebugInfo();
	//bind update to window resize
	$(window).bind('resize', updateDebugInfo);		
}
/* ------------------------------------------------------------------------------ */
/* common - get Platform */
/* ------------------------------------------------------------------------------ */
var Platform = new function(){
	//detecting functions
	function checkPlatform(os) { return (navigator.userAgent.toLowerCase().indexOf(os.toLowerCase())>=0); }
	function checkEvent(e) { return (e in document.documentElement); }
	//add properties
	this.iPhone = checkPlatform('iPhone');
	this.iPad = checkPlatform('iPad');
	this.iPod = checkPlatform('iPod');
	this.iOS = this.iPhone||this.iPad||this.iPod;
	this.android = checkPlatform('android');
	this.touchOS = checkEvent('ontouchstart');
	this.addDOMClass = function(){
		var $html = $('html'),
			cls = '';
		if ( this.iPhone )	cls = 'iPhone';
		if ( this.iPad )	cls = 'iPad';
		if ( this.iPod )	cls = 'iPod';
		if ( this.iOS )		cls = 'iOS';
		if ( this.android )	cls = 'android';
		$html.addClass(cls);
	}
	this.debugLog = function(){
		console.log('iPhone: '+this.iPhone);
		console.log('iPad: '+this.iPad);
		console.log('iPod: '+this.iPod);
		console.log('iOS: '+this.iOS);
		console.log('android: '+this.android);
		console.log('touchOS: '+this.touchOS);
	}
	//return self
	return this;
}
/* ------------------------------------------------------------------------------ */
/* common - insert First and Last Child */
/* ------------------------------------------------------------------------------ */
function insertFirstLastChild(b){var a=$(b);$.each(a,function(c,d){var f=$(d),g=f.find("> :first-child"),e=f.find("> :last-child");if(!g.hasClass("first-child")){g.addClass("first-child")}if(!e.hasClass("last-child")){e.addClass("last-child")}})};
/* ------------------------------------------------------------------------------ */
/* common - initCSS3PIE */
/* ------------------------------------------------------------------------------ */
function initCSS3PIE() {
	var oldIE = $('html').hasClass('oldie'),
		triggerCLS = 'css3pie';
	if ( oldIE && window.PIE ) {
		$.each( $('.' + triggerCLS), function(idx, ele){
			PIE.attach(ele);
		});
	} else {
		return false;	
	}
}
/* ------------------------------------------------------------------------------ */
/* common - cssAnim (working specifically with animate.css) */
/* ------------------------------------------------------------------------------ */
function cssAnim(target,anim) {
	if ( !Modernizr.cssanimations || !target.length || !anim ) return false;
	var $target = target,
		animCls = anim,
		scopeCls = 'animated',
		cleanTarget = function(){ $target.removeClass(scopeCls).removeClass(animCls); },
		updateTarget = function(){ cleanTarget(); $target.addClass(scopeCls).addClass(animCls); },
		delay;
	updateTarget();
	delay = window.setTimeout( function(){ cleanTarget() }, 1300 );
}
/* ------------------------------------------------------------------------------ */
/* common - matchHeights */
/* ------------------------------------------------------------------------------ */
function matchHeights(tgt) {
	
	//check if parameters are valid
	if (!$(tgt).length || $(tgt).length < 2) return false;
	
	//create global obj
	var matchGrpObj = {};

	//obj properties
	matchGrpObj.$targets = $(tgt);
	matchGrpObj.property = 'height';
	matchGrpObj.valid = true;
	matchGrpObj.maxHeight = 0;
	matchGrpObj.treshold = 98;
	matchGrpObj.delay = 600;//for lagging page rendering
	
	//functions - validToMatch
	matchGrpObj.validToMatch = function(){
		this.valid = true;
		$.each( this.$targets, function( idx, ele ) {
			var $ele = $(ele),
				$parent = $ele.parent();
				pct = Math.round( $ele.innerWidth() / $parent.width() * 100 );
			if ( pct > matchGrpObj.treshold ) {
				matchGrpObj.valid = false;
			}
		});
	};
	
	//functions - updateMaxHeight
	matchGrpObj.updateMaxHeight = function(){
		this.maxHeight = 0;
		$.each( this.$targets, function( idx, ele ) {
			var $ele = $(ele).css('height','auto'),
				eleH;
			//use height if elems have padding, otherwise use innerHeight
			if ( $ele.css('padding-top').substr( 0, 1 ) != '0' || $ele.css('padding-bottom').substr( 0, 1 ) != '0' ) {
				eleH = $ele.height();
			} else {
				eleH = $ele.innerHeight();
			}
			if (eleH > matchGrpObj.maxHeight) {
				matchGrpObj.maxHeight = eleH;
			}
		});
	};
	
	//functions - setMaxHeight
	matchGrpObj.setMaxHeight = function(){
		matchGrpObj.validToMatch();//check if targets are valid
		matchGrpObj.updateMaxHeight();//update max height value
		//console.log(this.valid);
		$.each(matchGrpObj.$targets, function(idx,ele){
			if ( matchGrpObj.valid ) {
				$(ele).height( matchGrpObj.maxHeight );
				//$(ele).animate( {'height': String(matchGrpObj.maxHeight) + 'px' }, 600, function(){  } );
			} else {
				$(ele).css( 'height', 'auto' );
			}
		});
	};
	
	//functions - init
	matchGrpObj.init = function(){
		setTimeout( this.setMaxHeight, this.delay );
		$(window).bind('resize', this.setMaxHeight );
	};
	
	//init obj
	matchGrpObj.init();
	
	//retunr global obj
	return matchGrpObj;
	
}
/* ------------------------------------------------------------------------------ */
/* initSelectNav */
/* ------------------------------------------------------------------------------ */
function initSelectNav() {
	
	//check if DOM elem exists
	if ( !$('#nav').length || !$('#navSelect').length ) return false;
	
	//create global obj
	var selectNav = {};
	
	//function - update
	selectNav.update = function() {
		
		//check if $btnSelect is set visible from Media Queries
		this.selectMode = this.$btnSelect.css('display') != 'none';
		this.itemHeight = Math.ceil( this.$items.outerHeight() );
		
		//enable select nav if selectMode is on
		if ( this.selectMode ) {
			//update container height with all items
			this.containerHeight = this.itemHeight * ( this.totalItems + 1 );
			
			//check if select nav is active
			if ( this.$container.hasClass('active') ) {
				this.$container.height( this.containerHeight );//apply total items height if is
			} else {
				this.$container.height( this.itemHeight );//apply snigle item height if not
			}

			//update select label text
			this.$selectedItem = this.$items.filter('.selected:first');
			if (this.$selectedItem.length) {
				this.$btnSelectLabel.html( this.$selectedItem.html() );
			} else {
				this.$btnSelectLabel.text( this.defaultLabel );
			};
		} else {//if selectMode is off
			//update and apply container height to single item
			this.containerHeight = this.itemHeight;
			this.$container.height( this.containerHeight );
		}		
		
		//console.log('selectMode: ' + this.selectMode);
		//console.log('itemHeight: ' + this.itemHeight);
		//console.log('containerHeight: ' + this.containerHeight);
			
	};
	
	//function - bindBtn
	selectNav.bindBtn = function(){
		
		//bind event
		this.$btnSelect.on( 'click', function(e){
			e.preventDefault();
			if ( selectNav.selectMode ) {
				
				//if nav is active
				if ( !selectNav.$container.hasClass('active') ) {
					selectNav.$container
						.addClass('active')
						.height( selectNav.containerHeight );
						/* using css3 transition
						.stop(false, false)
						.animate(
							{ 'height': String( selectNav.containerHeight ) + 'px' },
							selectNav.speed,
							function(){ 
								//complete
							}
						);
						*/
				} else { //if nav is not active
					selectNav.$container
						.removeClass('active')
						.height( selectNav.itemHeight );
						/* using css3 transition
						selectNav.$container
							.stop(false, false)
							.animate(
								{ 'height': String( selectNav.itemHeight ) + 'px' },
								selectNav.speed * 0.6,
								function(){ 
									//complete
								}
							);
						*/
				}
			}
		});
		
	};
	
	//function - init
	selectNav.init = function(){
		
		//cache DOM elems
		this.$container = $('#nav');
		this.$btnSelect = $('#navSelect');
		this.$btnSelectLabel = this.$btnSelect.find('.label');
		this.$items = this.$container.find('.navItem');
		this.$selectedItem = null;
		
		//cache properties
		this.totalItems = this.$items.length;
		this.itemHeight = this.containerHeight = 0;
		this.selectMode = false;
		this.speed = 300;
		this.defaultLabel = 'Menu';
		
		//first update
		this.update();
		
		//bind button
		this.bindBtn();
		
		//update on window resize
		$(window).resize(function(e) {
			selectNav.update();
		});
			
	};
	
	//init obj
	selectNav.init();
	
	//return global obj
	return selectNav;
		
}
/* ------------------------------------------------------------------------------ */
/* initSideNav */
/* ------------------------------------------------------------------------------ */
function initSideNav() {
	
	if ( $('body#home').length ) return false;
	
	var $window = $(window),
		$content = $('#content'),
		$aside = $('#contentAside'),
		$main = $('#contentMain'),
		$sideNav = $('#sideNav'),
		$menuIcon = $('#sideNavIcon'),
		$firstItem = $sideNav.find('li:first'),
		defaultOffsetY,
		offsetY,
		mode = null,
		activeCls = 'active',
		asideActive = function(){
			return $aside.hasClass(activeCls);
		},
		updateMode = function(){ 
			if ($aside.css('position') == 'absolute') {
				if ( $window.width() > 480 ) {
					mode = 'overlay';
				} else {
					mode = 'float';
				}
			} else {
				mode = 'default';
			}
			return mode;
		},
		updateOffsetY = function($tgt){
			defaultOffsetY = Math.round( $tgt.offset().top );
			offsetY = Math.round( $window.scrollTop() - defaultOffsetY );
		},
		updateTarget = function($tgt, top){
			var marginTop = top || 0;
			if ( offsetY <= 0 ) { offsetY = 0; }
			$tgt.css('margin-top', String(offsetY + marginTop) + 'px');	
		},
		clearElemStyle = function($elems, style){
			$.each( $elems, function(idx,ele){
				$(ele).css(style,'');
			});
		},
		getWindowHeight = function(){
			var h = null;
			window.innerHeight ? h = window.innerHeight : h = $window.height();
			return h;
		};
	
	//function - update
	function update(){
		//update interaction mode
		updateMode();
		//reset added styles
		clearElemStyle( [ $firstItem, $menuIcon, $aside ], 'margin-top' );
		clearElemStyle( $aside, 'height' );
		//update menu on scroll
		if ( !mode || mode == 'default' ) {
			return false;
		} else {
			if ( mode == 'overlay' ) {
				updateOffsetY($sideNav);
				if ( Platform.iOS ) updateTarget($firstItem);
				updateTarget($menuIcon, 30); 
			} else if ( mode == 'float' ) {
				updateOffsetY($main);
				if ( !Platform.android ) updateTarget($aside);
				if ( asideActive() ) {
					$aside.height( getWindowHeight() );
				}
			}
		}
	}
	
	//function - init
	function init(){
		
		//init swipe interaction for touch only
		if ( Modernizr.touch ) {
			//touch interactions
			
			/*using jquery mobile touch*/
			$content.touchSwipe(function(dir){
				if ( dir == 'left' ) {
					if (mode == 'overlay') {
						$aside.removeClass(activeCls);
					} else if (mode == 'float')  {
						$aside.addClass(activeCls);
					}
					update();
				} else if ( dir == 'right' ) {
					if (mode == 'overlay') {
						$aside.addClass(activeCls);
					} else if (mode == 'float')  {
						$aside.removeClass(activeCls);
					}
					update();
				}
			});
			
			/*using touchSwipe
			$content.swipe({
				threshold:200,
				maxTimeThreshold:2000,
				fallbackToMouseEvents:false,
				//gesture functions
				swipeLeft:function(e, dir, dis, dur, finger) {
					if (mode == 'overlay') {
						$aside.removeClass(activeCls);
					} else if (mode == 'float')  {
						$aside.addClass(activeCls);
					}
					update();
				},
				swipeRight:function(e, dir, dis, dur, finger) {
					if (mode == 'overlay') {
						$aside.addClass(activeCls);
					} else if (mode == 'float')  {
						$aside.removeClass(activeCls);
					}
					update();
				}				
			});*/
			
			/*
			//for mobile mode
			if ( updateMode() == 'float' ) {
				$aside
					.unbind()
					.on('click', function(e){ 
						if ( asideActive() ) {
							if (!$sideNav.has($(e.target)).length) {
								$aside.removeClass(activeCls);
							}
						} else {
							$aside.addClass(activeCls);
						}
						update();
					});
			}*/
		} 

		//init click interaction for all
		$aside.unbind().on('click', function(e){ 
			if ( asideActive() ) {
				if (!$sideNav.has($(e.target)).length) {
					$aside.removeClass(activeCls);
				}
			} else {
				$aside.addClass(activeCls);
			}
			update();
		});
		
		//update
		update();
		
		//bind window resize
		$window
			.off('resize scroll', update)
			.on('resize scroll', update);
	}
	
	//init
	init();
	
}
/* ------------------------------------------------------------------------------ */
/* initHomeTabs */
/* ------------------------------------------------------------------------------ */
function initHomeTabs() {	
	
	//check if DOM elem exists
	if ( !$('body#home #newsAndEvents').length ) return false;
	
	//create global obj
	var homeTabObj = {};
	
	//cache DOM elems
	homeTabObj.$btnNewsTab = $('#btnNewsTab'),
	homeTabObj.$btnEventsTab = $('#btnEventsTab'),
	homeTabObj.$newsListing = $('#newsListing'),
	homeTabObj.$eventListing = $('#eventListing'),
	homeTabObj.initTab = 'news';
	homeTabObj.currentTab;
	homeTabObj.speed = 20;
	
	//functions - update
	homeTabObj.update = function( tgtTab ){
		
		var afterSwitch = function(){
			MatchGroups.eventItems.setMaxHeight();	
			MatchGroups.home1.setMaxHeight();
		};
		
		//check tgtTab
		if ( tgtTab == this.currentTab ) { //finish if target tab is current tab
			//console.log('same tab');
			return false; 
		} else if ( tgtTab == 'news' ) {
			//console.log('news');
			this.$btnNewsTab.addClass( 'current' );
			this.$btnEventsTab.removeClass( 'current' );
			this.$newsListing.fadeIn( this.speed, function(){ afterSwitch(); } );
			this.$eventListing.hide();
			this.currentTab = 'news';
		} else if ( tgtTab == 'events' ) {
			//console.log('events');
			this.$btnEventsTab.addClass( 'current' );
			this.$btnNewsTab.removeClass( 'current' );
			this.$eventListing.fadeIn( this.speed, function(){ afterSwitch(); } );
			this.$newsListing.hide();
			this.currentTab = 'events';
		}
			
	};
	
	//functions - bindControls
	homeTabObj.bindControls = function(){
		this.$btnNewsTab.on( 'click', function( e ) {
			e.preventDefault();
			homeTabObj.update( 'news' );
		} );
		this.$btnEventsTab.on( 'click', function( e ) {
			e.preventDefault();
			homeTabObj.update( 'events' );
		} );
	}
	
	//functions - init
	homeTabObj.init = function(){
		this.update( this.initTab );
		this.bindControls();
	}
	
	//init obj
	homeTabObj.init();
	
	//return global obj
	return homeTabObj;
		
}
/* ------------------------------------------------------------------------------ */
/* initHomeBanner */
/* ------------------------------------------------------------------------------ */
function initHomeBanner() {		
	
	//check if DOM elem exists
	if ( !$('body#home #banner').length ) return false;
	
	var //jQuery objs
		$banner = $('#banner'),//banner container
		$slideshow = $('#slideshow'),//slideshow container
			$slides = $slideshow.find('.slide'),//slides collection
		$caption = $('#caption'),//slide info container
			$ttl = $caption.find('.heading'),//slide title
			$detail = $caption.find('.detail'),//slide desc
			$btn = $caption.find('a'),//slide btn link
		$btnPrev = $banner.find('.btnPrev'),//btnPrev container
		$btnNext = $banner.find('.btnNext'),//btnNext container
		$pagination = $banner.find('.pagination'),//pagination container
		
		//vars
		homeSlideshowObj = {},
		speed = 6000,
		
		//functions
		updateTitle = function(nextSlide){					
			var $nextSlide = $(nextSlide),
				spd = speed/10,
				target = ($nextSlide.attr('target') && $nextSlide.attr('target').length) ? $nextSlide.attr('target') : '_self';
			$ttl.fadeOut(0, function(){
				$ttl.text($.trim($nextSlide.attr('data-title')));
				$ttl.fadeIn(spd, function(){});
			});
			$detail.fadeOut(0, function(){
				$detail.text($.trim($nextSlide.attr('data-detail')));
				$detail.fadeIn(spd, function(){});
			});
			$btn.attr({
				'href':		$.trim($nextSlide.attr('href')),
				'target': 	target
			});
		};
				
	//onChange handler
	homeSlideshowObj.onChange = function(currSlide, nextSlide, opts, forwardFlag){
		updateTitle(nextSlide);				
	};
	
	//init slideshow
	homeSlideshowObj.Cycle = $slideshow.cycle({
		fx:     			'scrollHorz', 
		speed:  			speed/10, 
		timeout: 			0/*speed*/,
		nowrap:				0,
		prev:   			$btnPrev, 
		next:   			$btnNext,
		height:				'auto',
		pager:				$pagination,
		slideExpr:			$slides,
		before:				homeSlideshowObj.onChange,
		pagerAnchorBuilder: function(idx, slide) { return '<a href="#" class="ir btnSlide"><span>'+(idx+1)+'</span></a>'; }
	});
	
	//bind events for touch devices
	if ( Modernizr.touch ) {
		
		/*using jquery mobile touch*/
		$banner.touchSwipe(function(dir){
			if ( dir == 'left' ) 		$slideshow.cycle('next');
			else if ( dir == 'right' ) 	$slideshow.cycle('prev');
		});
		
		/*using touchSwipe
		$banner.swipe({
			swipeLeft:function(e, dir, dis, dur, finger) {
				$slideshow.cycle('next');
			},
			swipeRight:function(e, dir, dis, dur, finger) {
				$slideshow.cycle('prev');
			},
			threshold:160,
			maxTimeThreshold:2000,
			fallbackToMouseEvents:false
		});*/
		
		/*using touchwipe
		$slideshow.touchwipe({
			wipeLeft: function() { $slideshow.cycle('next'); },
			wipeRight: function() { $slideshow.cycle('prev'); },
			preventDefaultEventsX: true,
			preventDefaultEventsY: false
		});*/
		
	}
	
	//return global obj
	return homeSlideshowObj;
}
/* ------------------------------------------------------------------------------ */
/* initHomeCarousel */
/* ------------------------------------------------------------------------------ */
function initHomeCarousel(){
	
	//check if carousel exists
	if ( !$('body#home #areaListing').length ) return false;
	
	//create global obj
	var carouselObj = {};
	
	//functions - getMaxHeight
	/***************************************************************/
	carouselObj.getMaxHeight = function( $items ) {
		
		//vars
		var maxHeight = 0;
		//iterate through items and overwrite maxHeight if bigger value is found
		$.each( $items, function( idx, ele ) {
			var $ele = $(ele),
				eleH = $ele.outerHeight();
			if ( eleH > maxHeight ) maxHeight = eleH;
		} );
		//return result
		return maxHeight;
	
	}
	
	//function - updateControls
	/***************************************************************/
	carouselObj.updateControlView = function() {
		
		//vars
		var $btnPages = this.$container.find('.btnPage'),
			activeCls = 'active',
			disabledCls = 'disabled';
		
		//updating pager
		$.each( $btnPages, function( idx, ele ) {
			var $ele = $(ele),
				active = ( ( idx + 1 ) == carouselObj.currentPage );
			active ? $ele.addClass( activeCls ) : $ele.removeClass( activeCls ); 
		}); 
		
		//upadting prev and next
		this.currentPage == 1 ? this.$btnPrev.addClass( disabledCls ) : this.$btnPrev.removeClass( disabledCls );
		this.currentPage == this.totalPages ? this.$btnNext.addClass( disabledCls ) : this.$btnNext.removeClass( disabledCls );
		
		//console.log('totalPages: ' + this.totalPages);
		//console.log('currentPage: ' + this.currentPage);
		
	};
	
	//function - gotoItem
	/***************************************************************/
	carouselObj.gotoItem = function( index, speed ) {
		
		//vars
		var spd = ( speed == undefined ) ? this.speed : speed,
			tgtIndex,
			tgtDistance;
		
		//functions
		function getValidIndex() {
			
			var lastValidIndex = carouselObj.totalItems - carouselObj.itemsPerPage + 1,
				tgtIdx;
			
			if (index > lastValidIndex) {
				tgtIdx = lastValidIndex; 
			} else if (index < 1) {
				tgtIdx = 1;
			} else {
				tgtIdx = index;
			}
			
			return tgtIdx;
		}
		
		function getTgtDistance() {
			
			var $tgtItem = $( carouselObj.$items.filter( ':eq('+ String( getValidIndex() - 1 ) +')' ) ),
				listLeft = Math.floor( carouselObj.$list.offset().left ),
				itemLeft = Math.floor( $tgtItem.offset().left ),
				distance =  listLeft - itemLeft;
				
			//console.log('listLeft: ', listLeft);
			//console.log('itemLeft: ', itemLeft);
			
			return distance;
			
		};
		
		//update data
		tgtIndex = getValidIndex();
		tgtDistance = getTgtDistance();
		
		//store updated data
		this.currentItem = tgtIndex;
		this.currentPage = this.tgtPage;
		
		//update views for controls
		this.updateControlView();
		
		//console.log('tgtItem: ', index, '->', tgtIndex);
		//console.log('currentItem: ', this.currentItem, ' of ', this.totalItems);
		//console.log('tgtPage: ', this.tgtPage);
		//console.log('currentPage: ', this.currentPage, ' of ', this.totalPages);
		//console.log('speed: ', this.speed);
		//console.log('[transition START]');
		
		//kick-off transition
		this.$list
			.stop(true, true)
			.animate(
				{
					left:				String( tgtDistance ) + 'px'
					//avoidTransforms:	true //css transforms creates errors on iOS, to be fixed in future versions
				},
				spd,
				function(){
					//complete
					//console.log('[transition END]');
					//console.log('------------------------------');
				}
			);
				
	};
	
	//function - gotoPage	
	/***************************************************************/
	carouselObj.gotoPage = function( page ) {
		
		//vars
		var tgtItem;
		
		//update data to obj
		this.tgtPage = page;
		
		//pass if target page is the current page
		if ( this.tgtPage == this.currentPage ) {
			//console.log('same page: ' + this.tgtPage + ' -> no action!');
			
			//trigger css animation for touch devices
			cssAnim( this.$view, 'shake' );
			
			return false;
		}
		
		//get target item from target page
		tgtItem = ( ( this.tgtPage - 1 ) * this.itemsPerPage ) + 1;
		
		//goto target item
		this.gotoItem(tgtItem);
		
	};
	
	//function - goForward
	/***************************************************************/	
	carouselObj.goForward = function( forwardFlag ) {
		
		//determin whether going forward or backward to update target page
		forwardFlag ? this.tgtPage = this.currentPage + 1 : this.tgtPage = this.currentPage - 1;
		
		//validate target page to range
		if ( this.tgtPage <= 1 ) {
			this.tgtPage = 1;
		}
		else if ( this.tgtPage >= this.totalPages ) {
			this.tgtPage = this.totalPages;
		}
		
		//goto target page
		this.gotoPage( this.tgtPage );
		
	};

	//function - bindControls
	/***************************************************************/
	carouselObj.bindControls = function() {
		
		//get all page btns
		var $btnPages = this.$container.find('.btnPage');
		
		//bind event handlers
		$.each($btnPages, function(idx,ele){//page btn
			//vars
			var $ele = $(ele);
			//events
			$ele.off();
			$ele.on('click', function(e){
				e.preventDefault();
				carouselObj.gotoPage( idx + 1 );
			});
		});
		this.$btnPrev.off();
		this.$btnPrev.on('click', function(e){//btn prev
			e.preventDefault();
			carouselObj.goForward( false );
		});
		this.$btnNext.off();
		this.$btnNext.on('click', function(e){//btn next
			e.preventDefault();
			carouselObj.goForward( true );
		});
		
		//bind events for touch devices
		if ( Modernizr.touch && !this.initiated ) {
			
			/*using jquery mobile touch*/
			this.$view.touchSwipe(function(dir){
				if ( dir == 'left' ) 		carouselObj.goForward( true );
				else if ( dir == 'right' ) 	carouselObj.goForward( false );
			});
			
			/*using touchSwipe
			this.$view.swipe({
				swipeLeft:function(e, dir, dis, dur, finger) {
					carouselObj.goForward( true );
				},
				swipeRight:function(e, dir, dis, dur, finger) {
					carouselObj.goForward( false );
				},
				threshold:160,
				maxTimeThreshold:2000,
				fallbackToMouseEvents:false
			});*/
			
			/*using touchwipe
			this.$view.touchwipe({
				wipeLeft: function() { carouselObj.goForward( true ); },
				wipeRight: function() { carouselObj.goForward( false ); },
				preventDefaultEvents: true
			});
			*/
							
		}
		
	}
	
	//function - updatePagination
	/***************************************************************/
	carouselObj.updatePagination = function() {

		//update total pages
		this.totalPages = Math.ceil( this.totalItems / this.itemsPerPage );
		
		//update current page to valid range (1 ~ totalPages) [ INCORRECT LOGIC ]
		//if ( this.currentPage > this.totalPages ) this.currentPage = this.tgtPage = this.totalPages;	

		//update tgt page, current page from current item
		this.tgtPage = this.currentPage = Math.ceil( this.currentItem / this.itemsPerPage );
		
		//update current item from updated current page
		this.currentItem = ( ( this.currentPage - 1 ) * this.itemsPerPage ) + 1;
		
		if ( this.enabled ) {//if control switch is on
			
			this.$controls.slideDown();
			
			//vars
			var btnTmpl = '<a class="btnPage" href="#"></a>',
				total = this.totalPages;
			
			//clear existing pager btns
			this.$pager.empty();
			
			//add page btns to DOM when items per page is bigger than 1
			if ( this.itemsPerPage > 1 ) {
				while ( total-- ) {
					this.$pager.append( $(btnTmpl).text( String( this.totalPages - total ) ) );
				}
			}
			
			//bind controls
			this.bindControls();
			
		} else { //if control switch is off
			
			this.$controls.slideUp();
			
		}
		
	}
	
	//functions - update
	/***************************************************************/
	carouselObj.update = function() {
		
		//update item data
		this.itemWidth = Number( this.$items.css( 'width' ).replace( 'px', '' ) );//get item width from css
		this.itemWidth = Math.max( this.itemWidth, this.minItemWidth );//make sure width bigger than minimum
		this.itemHeight = Math.ceil( this.getMaxHeight( this.$items ) );//get max item height
		
		//update view data
		this.viewGap = this.$view.css( 'margin-left' );//get current css value
		if ( isNaN( this.viewGap ) ) {//if value not a number
			if ( this.viewGap.indexOf( 'auto' ) != -1 ) {//if auto, get gap value by calculation
				this.viewGap = Math.floor( ( this.$container.width() - this.$view.outerWidth() ) / 2 );
			} else if ( this.viewGap.indexOf( 'px' ) != -1 ) {//if has px, replace and number the value
				this.viewGap = Number( this.viewGap.replace( 'px', '' ) );
			}
		} 
		this.viewGap = Math.max( this.viewGap, this.minViewGap );//make sure gap value in range
		this.viewGap = Math.min( this.viewGap, this.maxViewGap );
		this.viewWidth = this.$container.innerWidth() - ( this.viewGap * 2 );//with and height
		this.viewHeight = 0;
		
		//update item data		
		this.itemsPerPage = Math.floor( ( this.viewWidth + this.minItemGap ) / ( this.itemWidth + this.minItemGap ) ); 
		this.itemsPerPage = Math.min ( this.itemsPerPage, this.totalItems );
		this.itemGap = Math.floor( ( ( this.viewWidth + this.minItemGap ) - ( ( this.itemWidth + this.minItemGap ) * this.itemsPerPage ) ) / ( this.itemsPerPage - 1 ) ); 
		this.itemGap = Math.max( this.itemGap + this.minItemGap, this.minItemGap );
		
		//update list data
		this.listWidth = ( ( this.itemWidth + this.itemGap ) * this.totalItems ) + this.floatBuffer;
		this.listLeft = Number( this.$list.css( 'left' ).replace( 'px', '' ) );
		
		//update totalPages
		//this.totalPages = Math.ceil( this.totalItems / this.itemsPerPage );
		
		//update speed
		this.speed = this.itemsPerPage * this.minSpeed;//varies based on items per page
		
		//update control switch
		this.enabled = this.totalItems > this.itemsPerPage;
		
		//overwrite properties if only one item	per page
		if ( this.itemsPerPage == 1 ) { 
			this.itemWidth = this.viewWidth = 280;
			this.itemGap = 0;
			this.viewGap = 'auto';
			this.listWidth = ( this.itemWidth * this.totalItems ) + this.floatBuffer;
		}
		
		//overwrite properties if only two item	per page
		if ( this.itemsPerPage == 2 ) { 
			this.itemWidth = 200; 
			this.itemGap = 30;
			this.viewWidth = 430;
			this.viewGap = 'auto';
			this.listWidth = ( ( this.itemWidth + this.itemGap ) * this.totalItems ) + this.floatBuffer;
		}
		
		//apply data to list
		this.$list.css({
			//'background':	'yellow',//debug
			'top':			this.listTopPad + 'px',
			'width':		this.listWidth + 'px',
			'height':		this.itemHeight + 'px'
		});		
		
		//update list height
		this.viewHeight = Math.ceil( this.$list.outerHeight() );
		
		//apply data to view
		this.$view.css({
			//'background':	'red',//debug
			'position':		'relative',
			'width':		'auto',
			'height':		String( this.viewHeight ) + 'px',
			'overflow': 	'hidden'
		});
		if ( this.itemsPerPage == 1 || this.itemsPerPage == 2 ) { //if one item per page
			this.$view.css({
				'width':			this.viewWidth + 'px',//set width
				'margin-left':		this.viewGap,//auto
				'margin-right':		this.viewGap //auto
			});
		} else {
			this.$view.css({
				'width':			'auto',
				'margin-left':		String( this.viewGap ) + 'px',
				'margin-right':		String( this.viewGap ) + 'px'
			});	
		}
				
		//apply data to items
		this.$items.css({
			'margin':	'0 '+ this.itemGap +'px 0 0',
			'padding':	'0'
		});
		this.$items.last().css({//no gap for last item
			'margin':	'0'
		});
		
		//update pager
		this.updatePagination();

		//go to current item, with no transition, for responsive layout only, not for interaction
		this.gotoItem( this.currentItem, 0 );
		
		//go to current page
		//this.gotoPage( this.currentPage );
				
		//update init state
		this.initiated = true;
		
	};
		
	//function - init	
	/***************************************************************/
	carouselObj.init = function() {
		
		//obj properties - DOM elems
		this.$list = $('#areaListing');//list
		this.$view = this.$list.parent('#areaListingViewport');//viewport
		this.$container = this.$view.parent();//container
		this.$items = this.$list.children();//items
		this.$controls = this.$container.find('.pagingControls');//controls container
		this.$pager = this.$controls.find('.pagination');//pager
		this.$btnPrev = this.$controls.find('.btnPrev');//btnPrev
		this.$btnNext = this.$controls.find('.btnNext');//btnNext
		
		//obj properties - paging
		this.totalItems = this.$items.length;//total items count
		this.totalPages = 0;//total pages
		this.currentItem = 1;//starting with item 1
		this.currentPage = 1;//starting with page 1
		this.tgtPage = 1;//page to goto
		
		//obj properties - layout
		this.viewGap = this.minViewGap = 20;//minimum viewport side gap
		this.maxViewGap = 25;//maximum viewport side gap
		this.itemWidth = this.minItemWidth = 200;//minimum item width
		this.itemGap = this.minItemGap = 10;//minimum item gap
		this.floatBuffer = 10;//added to list width to make sure no float wrap on items

		//obj properties - misc
		this.speed = this.minSpeed = 200;//transition speed
		this.initiated = false;//init state
		this.enabled = false;//switch for controls
		
		//update obj for the first time (init)
		this.update();
		
		//update obj on window resize
		$(window).resize(function(e) {
			carouselObj.update();
		});
		
	}
	
	//init obj
	carouselObj.init();
	
	//return obj to DOM
	return carouselObj;
	
}
/* ------------------------------------------------------------------------------ */
/* initCalendar */
/* ------------------------------------------------------------------------------ */
function initCalendar(cls) {
	
	//vars
	var calCls = cls || '.calendarView',
		$cals = $(calCls);
	
	//exit if no instance found
	if ( !$cals.length ) return false;
	
	//function - initCal
	function initCal(idx, ele) {
		
		//vars
		var $cal = $(ele),
			$calBody = $cal.find('.calendarViewBody:first'),
			$calWeeks = $cal.find('.week'),
			$calDays = $cal.find('.day'),
			$calToday = $cal.find('.today:first'),
			$calEntries = $cal.find('.entries'),
			$calEntriesTarget = $cal.find('.entriesListing:first'),
			hasDataCls = 'hasData',
			selectedCls = 'selected',
			noDataInfoTmpl = '<li class="entry"><p class="msg">No events for selected day</p></li>';
			
		//entries - insert first/last child
		$calEntries.find('.entry:first').addClass('first-child');
		$calEntries.find('.entry:last').addClass('last-child');
		
		//entries - check data
		$.each($calEntries, function(idx, ele){
			var $entries = $(ele),
				$entry = $entries.find('.entry');
			if ($entry.length) {
				$entries.addClass(hasDataCls);
			} else {
				$entries.removeClass(hasDataCls);
			}
		});
		
		//function selectDay
		function selectDay($d) {
			//vars
			var $day = $d || $calToday,
				$entries = $day.find('.entries'),
				$content = null,
				hasData = $entries.hasClass(hasDataCls);
			
			//determine data
			if (!hasData) {
				$content = $(noDataInfoTmpl);
			} else {
				$content = $($entries.html());
			}
			
			//update day style
			$calDays.removeClass(selectedCls);
			$day.addClass(selectedCls);
			
			//adding content to DOM
			$content.appendTo( $calEntriesTarget.empty() );				
		}
		
		//init day interaction
		$.each($calDays, function(idx, ele){
			var $day = $(ele);
			$day.unbind().on('click', function(e){
				selectDay($day);	
			});
		});
		
		//start by today as default
		selectDay($calToday);
			
	}
	
	//loop through and process each instance
	$.each( $cals, initCal );
	
}
/* ------------------------------------------------------------------------------ */
/* init */
/* ------------------------------------------------------------------------------ */
var SelectNav, HomeTabs, HomeBanner, HomeCarousel, MatchGroups;
function init(){
	
	//nav
	insertFirstLastChild('#nav');
	SelectNav = initSelectNav();
	
	//template specific functions
	if ( $('body#home').length ) {
		initHome();
	} else {
		//sideNav
		insertFirstLastChild('#sideNav, #sideNav ul');
		initSideNav();
		//calendar
		initCalendar();
	}

	//css3pie rendering
	initCSS3PIE();
	
	//debug
	displayDebugInfo('#debugMediaQueries');
	
}
function initHome(){
	
	//layout assistance
	insertFirstLastChild('#newsListing, #eventListing, #shortcutListing');
	MatchGroups = {};
	MatchGroups.home1 = matchHeights('#welcome, #newsAndEvents');
	MatchGroups.home2 = matchHeights('#shortcuts, #enews');
	MatchGroups.eventItems = matchHeights('.eventItem .title');
	
	//interactions
	HomeTabs = initHomeTabs();
	HomeBanner = initHomeBanner();
	HomeCarousel = initHomeCarousel();
	
}
/* DOM.ready */
$(document).ready(function(){ 
	Platform.addDOMClass();
	init();	
});
