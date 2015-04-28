define(['class','base'],function ( $class, base ){

	var Prompt = new $class();

	var pp = ["cp-promptMask","cm-modal--alert"],

		screenOp = "keepheader,keepfooter,fullscreen,keepboth",

		template = {
			prompt : '<div class="cp-promptMask cui-view cui-mask cui-opacitymask" style="position:absolute; left: 0px; top: 0px; background: rgba(0,0,0,.5); width:100%; height:100%"></div>'+
			'<section class="cm-modal cm-modal--alert">'+
			'<div class="cm-modal-bd">'+

			'</div>'+
			'<div class="cm-actions">'+

			'</div>'+
			'</section>'
		},
		check = false;

	Prompt.include({
		init : function (){

			var options = arguments[0];

			if(!options || typeof options !== "object") options = {};

			this.parent = base.parent(options.parent);

			this.screen = (typeof options.screen === "string" && screenOp.indexOf(options.screen.toLowerCase()) > -1) ? options.screen.toLowerCase() : "keepheader";

			this.zIndex = options.zIndex && typeof options.zIndex === "number" && !isNaN(options.zIndex) ? options.zIndex : 10;

			this.message = options.message && {}.toString.call(options.message) == '[object Object]' ? options.message : { title: '标题配置不正确'};

			this.buttons = options.buttons && base.isArray(options.buttons) ? options.buttons : [];

			this.autoHide = options.autoHide && typeof options.autoHide === "boolean" ? options.autoHide : false;

			this.timeout = options.timeout && typeof options.timeout === "number" && !isNaN(options.timeout) &&  (options.timeout > 0) ? options.timeout : 1000;

			this.hidecallback = options.hidecallback;

			var t = base.isNumeric( options.header ) ? options.header : $("header").height();
			var b = base.isNumeric( options.footer ) ? options.footer : $("footer").height();

			this.t = t === null ? 0 : t;
			this.b = b === null ? 0 : b;
		},
		__open : function ( selector,temp ){
			var self = this;

			var d = $(temp);
			var dM = d.eq(0);
			var bd;

			if(this.screen === "keepheader"){
				dM.css({"top":this.t,"bottom":0});
			}else if(this.screen === "keepfooter"){
				dM.css({"bottom":this.b,"top":0});
			}else if (this.screen === "fullscreen"){
				dM.css({"top":0,"bottom":0});
			}else if(this.screen === "keepboth"){
				dM.css({"top":this.t,"bottom":this.b});
			}else{
				dM.css({"top":this.t,"bottom":0});
			}
			dM.css("zIndex",this.zIndex);
			d.eq(1).css("zIndex",this.zIndex + 1);

			this.parent.append( d );

			bd = d.find('.cm-modal-bd');

			if(!!this.message.content){
				bd.html('<h3 class="cm-alert-title">' + this.message.title + '</h3><div class="cm-mutil-lines">' + this.message.content + '</div>');
			}else{
				!!this.message.title ? bd.html('<p>' + this.message.title + '</p>') : bd.html('<p>没有标题</p>');
			}

			self.__btns();

			$('.cp-promptMask').css('height',$(document).height())

			$('.cm-modal').css('display','block');//

			this.currentElement = d;
		},
		__btns : function (){
			var self = this;
			var btns = $('.cm-actions');
			var btnsArray = [];

			if(this.buttons.length <= 0){
				return;
			}else if(this.buttons.length > 2 ){
				btns.addClass('cm-actions--full');
			}

			for(var i=0; i<= this.buttons.length-1; i++){
				btns.append('<span class="cm-actions-btn">'+ this.buttons[i].text +'</span>');

				(function( i ){
					btns.find('.cm-actions-btn').eq(i).off().on('click',function(){
						self.buttons[i].callback( $.proxy( self.__close, self ) );
					})
				})( i )
			}
		},
		__close : function (){
			if(check) this.currentElement.hide(); else this.currentElement.remove();
		},
		prompt : function ( M ){
			var self = this;

			if ( M ){
				this.message.title = M.message.title;
				this.message.content = M.message.content;
				this.buttons = M.buttons || [];
				this.autoHide = M.autoHide;
				this.timeout = M.timeout;
				this.hidecallback = M.hidecallback;
			}

			var timeout = this.timeout;
			var autohide = this.autoHide;

			//显示/创建
			self.__open(pp[0],template.prompt);


			if (autohide) setTimeout(function(){ _callback() },timeout);

			var _callback = function(){
				self.__close();
				if(!!self.hidecallback && typeof(self.hidecallback) === 'function') self.hidecallback();
			}
		},
		checkNetStatus : function (){
			var self = this;

			var $checkNetStatus = new Prompt({
				zIndex: 3000,
				parent: "#main",
				screen: "FullScreen",
				message: {
					title : '网络连接已关闭',
					content: '启动蜂窝移动数据或Wi-Fi来访问数据！'
				},
				autoHide: false,

				buttons: [
					{
						text: '知道了！',
						callback: function (close) {
							close();
						}
					}
				]
			});
			setTimeout(function(){ $checkNetStatus.prompt() },300);
		}
	});

	if( base.isInApp() ){

		var img = new Image(),
			imgSrc = "http://m.ctrip.com/favicon.ico?";

		setTimeout(function(){
			img.src = imgSrc +"t="+(new Date().getTime());

			img.addEventListener("error",function (){ //第一次error检测
				var imgSec = new Image();

				imgSec.src = imgSrc +"t="+(new Date().getTime());
				imgSec.addEventListener("error",function () { //第二次检测error，则判为无网络;
					Prompt.prototype.checkNetStatus();
				});
			});
		}, 100);
	}else{
		if( !navigator.onLine ) Prompt.prototype.checkNetStatus();
	}
	return Prompt;
});