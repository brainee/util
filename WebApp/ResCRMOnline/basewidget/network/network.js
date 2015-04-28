define([ 'base', 'class' ],function ( base, $class ){

	var Network = new $class();

	var openedElementArray = [];    //已添加的元素
	var openedElementIdArray = [];

	var loadFailed = ".cp-Network-loadFailed",
		loadFailedWithCall = ".cp-Network-loadFailedWithCall",
		loading = ".cp-Network-loading",
		loadingForSubmit = ".cp-Network-loadingForSubmit",
		noSearch = ".cp-Network-noSearch",
		load404 = ".cp-Network-load404";

	var	screenOp = "keepheader,keepfooter,fullscreen,keepboth",

		template = {
			loadFailed : '<div class="cp-h5-main" style="background-color:#fff;"><div class="cp-Network-loadFailed loadFailed-box"><div class="loadFailed-animate"><div class="bubble"></div><div class="eyebrow"></div><div class="tail"></div><div class="tear"></div><div class="l-hand"></div><div class="r-hand" style="z-index: 0;"></div><div class="text"></div></div><p>网络不给力，请再试试吧。</p><div class="btns"><span class="btn-retry">重试</span></div></div></div>',
			loadFailedWithCall : '<div class="cp-h5-main" style="background-color:#fff;"><div class="cp-Network-loadFailedWithCall cp-Network-loadFailed loadFailed-box"><div class="loadFailed-animate"><div class="bubble"></div><div class="eyebrow"></div><div class="tail"></div><div class="tear"></div><div class="l-hand"></div><div class="r-hand" style="z-index: 0;"></div><div class="text"></div></div><div class="text"></div><p>网络不给力，请再试试吧。</p><p>您也可以拨打客服电话。</p><div class="btns"><span class="btn-retry">重试</span><div class="line-spacing"></div><span class="btn-call">联系客服</span></div></div></div></div>',
			loading : '<div class="cp-h5-main" style="background-color:#fff;"><div class="cp-Network-loading loading-box"><div class="loading-animate"><div class="bubble"></div><div class="eye"></div><div class="eye2"></div><div class="tail"></div><div class="tear"></div><div class="l-hand"></div><div class="r-hand" style="z-index: 0;"></div><div class="text"></div><div class="sweat"></div></div><p><i class="i-loading"></i>游游努力加载中...</p></div></div>',
			loadingForSubmit : '<div class="cp-h5-main" style="width:100%;background-color:rgba(0,0,0,0.7);position: fixed;z-index:9999;"><div class="cp-Network-loadingForSubmit loading-box"><div class="loading-layer">游游努力提交中... </div></div></div>',
			noSearch : '<div class="cp-h5-main" style="background-color:#fff;"><div class="cp-Network-noSearch loadNosearch-box"><div class="nosearch-animate"></div><p>找不到，换个试试吧...</p></div></div>',
			load404 : '<div class="cp-h5-main" style="background-color:#fff;"><div class="cp-Network-load404 load404-box"><div class="load404-animate"><div class="body"><div class="eyes"></div><div class="r-hand"></div><div class="l-hand"></div><div class="bubble"></div><div class="tail"></div><div class="nofind">404</div></div><div class="bubble"></div></div><p>游游迷路了，<br>你能带我回首页吗？</p><div class="btns"><span class="btn-retry">返回首页</span></div></div></div>'
		};
	
	Network.include({
		init : function (){
			var options = arguments[0];
			if( !options || typeof options !== "object" ) options = {};
			this.parentNodes = (options.parent && typeof options.parent === "string" && /(\.|#)(\w|-)+/.test( options.parent )) ? options.parent : "#main";
			var $screen = options.screen && options.screen.toLowerCase();
			this.screen = ( typeof $screen === "string" && screenOp.indexOf( $screen ) > -1 ) ? $screen : "keepheader";
			this.zIndex = base.isNumeric( options.zIndex ) ? options.zIndex : 10;
			this.position = options.position || "absolute";

			var initParameters = function ( el ){
				return base.isNumeric( el ) ? el : 0;
			};

			var t = initParameters( options.header),
				b = initParameters( options.footer );

			this.l = initParameters( options.left );
			this.r = initParameters( options.right );

			this.t = t === null ? 0 : t;
			this.b = b === null ? 0 : b;
		},
		__setCss : function ( el ){
			var self = this;
			return function ( styles ){
				var _b = !!(self.position == "absolute" || self.position == "fixed");
				var initStyles = function ( direction ){
					base.isNumeric(styles[direction]) && ( _b ? el.css(direction,styles[direction]):el.css("margin-"+direction, styles[direction]));
				};
				for(var m in styles) initStyles(m);
				base.isNumeric(styles.zIndex) && _b && el.css({"zIndex":styles.zIndex});
			}
		},
		__open : function ( id ){

			var $temp = id.replace(/\.cp-Network-/,"");
			var temp = template[$temp];
			//根据screen改变元素样式
			var d = $(temp);

			d.css({"position":this.position});

			//页面已经load,获取父级
			this.parent = $(this.parentNodes);
			//如果父级不是main,且是绝对定位，则给此元素加一个relative
			if(this.parent.prop("id") !== "main" && this.position == "absolute" ){
				this.parent.css({"position":"relative"});
			}
			var setCss = this.__setCss(d);

			switch ( this.screen ) {
				case "keepheader" :
					setCss({"top":this.t,"bottom":0});
					break;
				case "keepfooter" :
					setCss({"bottom":this.b,"top":0});
					break;
				case "fullscreen" :
					setCss({"top":0,"bottom":0});
					break;
				case "keepboth" :
					setCss({"top":this.t,"bottom":this.b});
					break;
				default :
					setCss({"top":this.t,"bottom":0});
			}
			setCss({ "left" : this.l, "right" : this.r, "zIndex" : this.zIndex });

			this.parent.append( d );

			this.$id = $( id );
			this.$parent = this.$id.parent();

			openedElementArray.push( this.$parent );
			openedElementIdArray.push( $temp );

			//获取可能存在的所有按钮
			this.retryBtn = this.parent.find(".btn-retry");
			this.callBtn  = this.parent.find(".btn-call");
			this.closeBtn = this.parent.find(".close");
		},
		__close : function (){
			this.$parent.remove();
		},
		__callback : function ( callback ){
			var self = this;
			return callback && callback(function (){
				self.__close();
			});
		},
		__hidden : function ( type, element ){
			var $type = type === "close" ? 'remove' : 'hide';
			if( !element ){ //如果没有填任何元素，则删除所有已经添加的元素
				openedElementArray.forEach(function ( el, i ){
					el[$type]();
				});
			}else{
				//如果填有元素，则查找已添加元素的数组，赋为索引
				var index = openedElementIdArray.indexOf(element);
				//通过索引查找其元素，执行remove/hide方法
				if( index > -1 ){
					openedElementArray[index][$type]();
				}else{
					console.warn("no this element!");
				}
			}
		},
		close : function ( element ){
			this.__hidden('close', element);
		},
		hide : function ( element ){
			this.__hidden('hide', element);
		},
		loadFailed : function ( callback ){
			var self = this;
			//显示/创建
			this.__open( loadFailed );
			//返回一个close函数，用于手动关闭页面
			this.retryBtn.off("click").on("click",function (){
				return self.__callback.call( self,callback );
			});
		},
		loadFailedWithCall : function ( number, callback ){
			var self = this;
			this.__open( loadFailedWithCall );
			this.retryBtn.off("click").on("click",function (){
				return self.__callback.call( self,callback );
			});
			this.callBtn.off("click").on("click",function (){
				window.location.href = "tel:" + (number || '8008206666');
			});
		},
		loading : function ( callback ){
			this.__open( loading );
			return this.__callback.call( this,callback );
		},
		loadingForSubmit : function ( delay, callback ){
            var self = this;
            if( typeof delay == "function" ) callback = delay;
            delay = base.isNumeric(delay) ? delay : 0;
            var f = function (){
                self.__open( loadingForSubmit );
                return self.__callback.call( self,callback );
            };
            return delay > 0 ? setTimeout(f, delay) : f();
		},
		noSearch : function ( callback ){
			this.__open( noSearch );
			return this.__callback.call( this,callback );
		},
		load404 : function ( callback ){
			var self = this;
			this.__open( load404 );
			this.retryBtn.off("click").on("click",function (){
				location.href = "/";
				return self.__callback.call( self,callback );
			});
		}
	});
	return Network;
});