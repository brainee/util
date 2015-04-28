define(['class','base'],function ( $class, base ){

	var Pull = new $class();

	Pull.include({
		init : function (){
			var options = arguments[0];
			if( !options || !base.isObject( options )) return;
			this.upParent = options.upParent && $(options.upParent);
			this.downParent = options.downParent && $(options.downParent);
			this.zIndex = options.zIndex || 1;
			this.type();
		},
		type : function (){
			var self = this;
			this.up =  {
				loading : function (){
					return self.template("upLoading");
				},
				loadFailed : function (){
					return self.template("upLoadFailed");
				},
				loadNoResult : function (){
					return self.template("upLoadNoResult");
				},
				loadMore:function (){
					return self.template("upLoadMore");
				}
			};
			this.down = {
				freshAble : function (){
					return self.template("downFreshAble");
				},
				freshDrop : function (){
					return self.template("downFreshDrop");
				},
				freshDropLimit : function (){
					return self.template("downFreshDropLimit");
				},
				loading : function (){
					return self.template("downLoading");
				},
				loadSuccess : function (){
					return self.template("downLoadSuccess");
				},
				loadFailed : function (){
					return self.template("downLoadFailed");
				}
			};
		},
		template : function ( name ){
			var _temp,_p;
			_p = /up/.test( name ) ? "up" : "down";
			var _parent = _p === "up" ? this.upParent : this.downParent;
			var _status = "default";

			switch ( name ){
				case "upLoading" :
					_temp = '<i class="i-loading"></i>正在加载中...';
					break;
				case "upLoadFailed" :
					_temp = '<i class="i-loadingFailed"></i>加载未成功，请稍后再试';
					break;
				case "upLoadNoResult":
					_temp = '没有更多结果了';
					break;
				case "upLoadMore":
					_temp = '点击加载更多';
					break;
				case "downFreshAble":
					_temp = '<i class="i-loading"></i>下拉可刷新';
					_status = "default";
					break;
				case "downFreshDrop":
					_temp = '<i class="i-loading"></i>释放可刷新';
					_status = "touch";
					break;
				case "downFreshDropLimit":
					_temp = '<i class="i-loading"></i>释放可刷新';
					_status = "over";
					break;
				case "downLoading" :
					_temp = '<i class="i-loading"></i>刷新中...';
					_status = "ing";
					break;
				case "downLoadSuccess" :
					_temp = '<i class="i-loadingSucc"></i>刷新成功';
					_status = "succeed";
					break;
				case "downLoadFailed" :
					_temp = '<i class="i-loadingFailed"></i>未刷新成功，请稍后再试吧';
					_status = "failed";
					break;
			}

			var _dom = _p === "up"
					? $('<div class="cp-h5-main"><div class="loadText-box"><p>'+ _temp +'</p></div></div>')
					: $('<div class="cp-h5-main"><div class="loadRefresh-'+ _status +'-box"><p class="refresh_slogan">携程在手，说走就走！</p><p></p>' + _temp + '</p></div></div>');

			return {
				show : function (){
					_dom.css({"zIndex":this.zIndex});
					_dom.appendTo( _parent );
				},
				hide : function (){
					if( _dom ) _dom.remove();
				}
			};
		}
	});

	return Pull;
});