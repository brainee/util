define(['class','base'],function ( $class, base ){

	var pullDown = new $class();
	
	var templete = {
		loadRefresh : '<div class="loadRefresh-over-box"><div class="slogan"><p class="refresh_slogan">携程在手，说走就走！</p><p><i class="i-loading"></i><span>释放可刷新</span></p></div></div>',
		loadText : '<div class="loadText-box"><p><i class="i-loading"></i><span>正在加载中...</span></p></div><style>.loadRefresh-over-box { position:absolute; top:0; height:0;width:100%; overflow:hidden;background: #efefef url(http://pic.c-ctrip.com/h5/rwd_myctrip/cove@2x.png) center bottom no-repeat ;text-align: center; display: box; display: -webkit-box; display: -moz-box;-webkit-box-pack:center; -moz-box-pack:center; -webkit-box-align:center; -moz-box-align:center; }.loadRefresh-over-box .slogan {width:100%}.loadRefresh-over-box p.refresh_slogan {width:100%; height: 21px; margin:0; background:url(http://pic.c-ctrip.com/h5/rwd_myctrip/botom-logo@2x.png) center 0 no-repeat;text-indent:-999em;overflow:hidden;-webkit-background-size:177px auto;background-size:177px auto;}.loadRefresh-over-box .i-loading {width: 13px;height: 14px;margin-right: 5px;display: inline-block;vertical-align: middle;background:url(http://pic.c-ctrip.com/h5/rwd_myctrip/loading@2x.png) no-repeat -160px -67px;background-size: 180px auto;}.loadRefresh-ing-box{height:61px;padding:20px 0 19px 0;background: #efefef;}.i-loading2{-webkit-animation:loading 1s linear 0s infinite;animation:loading 1s linear 0s infinite;}@-webkit-keyframes loading{0%{-webkit-transform:rotate(0);}100%{-webkit-transform:rotate(360deg);}}@keyframes loading{0%{transform:rotate(0);}100%{transform:rotate(360deg);}}.loadRefresh-over-box .i-loadingSucc,.loadText-box .i-loadingSucc{display: inline-block;width:13px;height:8px;margin-right:6px;border:2px solid #13b418;border-width:0 0 2px 2px;-webkit-transform:translate(0,-5px) rotate(-45deg);-ms-transform:translate(0,-5px) rotate(-45deg);-o-transform:translate(0,-5px) rotate(-45deg);transform:translate(0,-5px) rotate(-45deg);}.loadRefresh-over-box .i-loadingFailed{position: relative;margin-right:10px;}.loadRefresh-over-box .i-loadingFailed::before,.loadRefresh-over-box .i-loadingFailed::after{position: absolute;top:50%;left:50%;content:"";background:#ee693b;-webkit-transform:rotate(45deg);transform:rotate(45deg);}.loadRefresh-over-box .i-loadingFailed::before{width:2px;height:14px;margin-left:-1px;margin-top:-7px;}.loadRefresh-over-box .i-loadingFailed::after{width:14px;height:2px;margin-top:-1px;margin-left:-7px;}.loadText-box{ position:relative; display:none; width:100%; height:35px;line-height:35px;text-align:center; }.loadText-box p {font-size:12px;color: #666;}.loadText-box .i-loading {width:12px;height: 13px;margin-right:5px;display: inline-block;background:url(http://pic.c-ctrip.com/h5/rwd_myctrip/un_icon_loading@2x.png) 0 0 no-repeat;background-size: 19px auto;vertical-align: middle;-webkit-animation:loading 1s linear 0s infinite;animation:loading 1s linear 0s infinite;}.loadText-box .i-loadingFailed{position: relative;margin-right:10px;}.loadText-box .i-loadingFailed::before,.loadText-box .i-loadingFailed::after{position: absolute;top:50%;left:50%;content:"";background:#ee693b;-webkit-transform:rotate(45deg);transform:rotate(45deg);}.loadText-box .i-loadingFailed::before{width:2px;height:14px;margin-left:-1px;margin-top:-7px;}.loadText-box .i-loadingFailed::after{width:14px;height:2px;margin-top:-1px;margin-left:-7px;}@-webkit-keyframes loading{0%{-webkit-transform:rotate(0);}100%{-webkit-transform:rotate(360deg);}}@keyframes loading{0%{transform:rotate(0);}100%{transform:rotate(360deg);}}</style>'
	}

	pullDown.include({
		init : function (){
			var option = arguments[0];
			//if (!(this instanceof pullDown)) return new pullDown( option ); 
			if( !option || typeof option !== "object" ) option = {};
			
			this.parent = option.parent || ""; 
			this.self = option.self || ""; 
			this.header = option.header || ""; 
			this.topcallback = option.topCallback;
			this.bottomcallback = option.bottomCallback;
			
			this.tsp = 0; // 手指点击屏幕位置
			this.movedis = 0; //手指移动距离
			this.dis = 0; // 初始滑动距离
			this.SCROLLH = $(window).height() - $(this.self).offset().top //滚动高度，屏幕高度- 元素offsetTop
			this.topkeepdis = 80; //下拉刷新（top） 松开后停留距离
			this.bottomloaded = true;
			
			$(this.parent).append( templete.loadRefresh ); 
			$(this.parent).append( templete.loadText );
			this.loadRefresh = $('.loadRefresh-over-box');  
			this.loadText = $('.loadText-box');
			this.freshi = this.loadRefresh.find('i');
			this.freshspan = this.loadRefresh.find('span');
			this.texti = this.loadText.find('i');
			this.textspan = this.loadText.find('span');
			
			
			if( this.parent != "body,document" && this.parent ){
				if($(this.parent).css('position') == "static") $(this.parent).css({'position':'relative'});
			}
		},
		__touch : function( event ){
			var _this = this;
			var event = event || event.target;
			var self = $(this.self);
			
			switch( event.type ){
				case "touchstart": 
					this.tsp = event.targetTouches[0].clientY;
					break;
					
				case "touchend":
					this.__gesture(); //调用判断手势方法
					this.__endTop( self ); //松开操作
					break;
					
				case "touchmove":
					this.movedis = event.targetTouches[0].clientY - this.tsp; //手指移动距离
					this.dis = this.movedis / 2; //运动的距离
					if(this.__gesture() == "down" && this.__ontop()) this.__down( this.dis ); //在顶部并且向下拉动
					
					break;
			}
		},
		
		__down : function( dis ){
			var self = $( this.self );
			this.__freshMotion( dis );
			this.__transform( self, dis ); 
			
			if( dis > 0 && dis <= 20){ 
				this.freshspan.text('下拉可刷新'); //小于20px操作;
			} else if ( dis >= 100 ) {
				this.freshspan.text('释放可刷新'); //超过100px松开提示
			}
		},
		
		__endTop : function( self ){
			var _this = this;
			if( this.dis > 100 && this.__gesture() == "down" && this.__ontop()){
				this.freshspan.text('刷新中...');
				this.freshi.addClass('i-loading2');
				this.__move( this.dis, -5, self , _this.topkeepdis);
				this.__callback( this.topcallback );
				this.dis = _this.topkeepdis;
				this.removes(); //加载中禁止再次刷新
			}
			else if(this.__gesture() == "down" && this.__ontop()){
				this.__move( this.dis, -5, self , 5 );
			}
		},
		
		__callback : function( callback ){
			var _this = this;
			if(!!callback && typeof(callback) === 'function'){
				if( callback == _this.topcallback ) return callback && callback(function (){
					if(!!arguments[0]) _this.__close( 'top', arguments[0] );
				});
				if( callback == _this.bottomcallback ) return callback && callback(function (){
					if(!!arguments[0]) _this.__close( 'bottom', arguments[0] );
				});
			}
		},
		
		__close : function( pos, msg ){
			var _this = this;
			var self = $( this.self );
			if( pos == "top" ){
				switch ( msg ){
					case 'success':
						this.freshspan.text('刷新成功');
						this.freshi.removeClass().addClass('i-loadingSucc');
					break;
					
					case 'failed':
						this.freshspan.text('未加载成功，稍后再试吧');
						this.freshi.removeClass().addClass('i-loadingFailed');
					break;
				}
				this.__runTop( self );
			}
			else{
				switch ( msg ){
					case 'success':
						this.textspan.text('加载成功');
						this.texti.removeClass().addClass('i-loadingSucc');
					break;
					
					case 'failed':
						this.textspan.text('加载未成功，请稍后再试');
						this.texti.removeClass().addClass('i-loadingFailed');
					break;
					
					case 'nomore':
						this.textspan.text('没有更多结果了');
						this.texti.removeClass();
					break;
				}
				this.__runBottom( self );
			}
		},
		
		__runTop : function( self ){
			var _this = this;
			setTimeout(function(){
				_this.__move( _this.topkeepdis, -5, self , 5 );
				_this.scroll();
			},800)
		},
		
		__runBottom : function( self ){
			var _this = this;
			setTimeout(function(){
				_this.loadText.css('display','none');
				_this.textspan.text('正在加载中...');
				_this.texti.removeClass().addClass('i-loading');
				_this.bottomloaded = true;
				_this.scroll();
			},800)
		},
		
		__bind : function( obj ){
			var _this = this; 
			return function() { 
				_this.apply(obj,arguments); 
			} 
		},
		
		__move : function( dis, speed, ele, pos ){
			var _this = this;
			var interval = setInterval(function(){
				dis = dis + speed;
				if( dis <= pos ){
					dis = pos - 5;
					_this.dis = 0; //回归重置dis
					clearInterval(interval);
				}
				_this.__freshMotion( dis );
				_this.__transform( ele, dis );
			},5)
		},
		
		__transform : function( ele, y ){
			$( ele ).css({
				'-webkit-transform':'translateY('+ y + 'px)',
				'transform':'translateY('+ y + 'px)'
			});
		},
		
		__freshMotion : function( dis ){
			this.loadRefresh.css('height',dis + 'px');
			if( dis <= 0 ) this.freshi.removeClass().addClass('i-loading');
		},
		
		__onbottom : function(){
			if( ($(this.self).height() - this.SCROLLH) == document.body.scrollTop && this.bottomloaded ){
				this.loadText.css({'display':'block'});
				this.__callback( this.bottomcallback );
				this.bottomloaded = false;
				this.removes();
		　　}
		},
		
		__ontop : function(){
			if( document.body.scrollTop == 0) return true;
		},
		
		__gesture : function(){
			var distance = 5; //滑动超过5px判定为滑动
			if(this.movedis == 0 || Math.abs(this.movedis) < distance) {
				return 'click';
			}
			else if(this.movedis > 0 && Math.abs(this.movedis) >= distance ){
				return "down"
			}
			else if(this.movedis < 0 && Math.abs(this.movedis) >= distance ){
				return "up"
			}
		},
		
		scroll : function(){
			$( window, document ).on('scroll',this.__onbottom.bind(this))
			$(this.self).on('touchstart',this.__touch.bind(this));
			$(this.self).on('touchmove',this.__touch.bind(this));
			$(this.self).on('touchend',this.__touch.bind(this));
		},
		
		removes : function(){
			$(this.self).off('touchstart');
			$(this.self).off('touchmove');
			$(this.self).off('touchend');
		}
	});

	return pullDown;
});