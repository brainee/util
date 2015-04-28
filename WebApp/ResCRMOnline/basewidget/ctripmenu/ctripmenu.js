define(["base", template('menu_app'), template('menu_online')], function (base, appTpl, onlineTpl ){

	var menu = function (){
		var obj = arguments[0];
		var self = menu;
		var isPadApp = navigator.userAgent.match(/Ctrip_Pad_App/i);
		var forTest = location.href.indexOf("for=test") > 0;		

		self.isInApp = base.isInApp();
		self.isShowing = false;
		self.Base64 = base.base64;
		self.isLogin = base.isLogin;
		self.loginAction = base.loginAction;
		//default sets
		self.sets = {
			show: false,
			bresize: false,
			buName: 'home'
		};

		if (obj && obj.show) {
			obj.show = (self.isInApp &&  !isPadApp)? false : obj.show;
		}	

		self.sets = obj = $.extend(self.sets, obj || {});
		var jmenuWrapper = $("<div id='ctripmenu-wrap' class='sidebar-pad'></div>"),
			cssApp, cssOnline;

		if(!self.isInApp){
			jmenuWrapper.html(appTpl).find(".member").remove();
			appTpl = jmenuWrapper.html();
		}		

		cssOnline = '.aside_fixed{position:fixed;top:-10px;}.aside{float:left;width:158px;_margin-right:13px;border:1px solid #ececec;border-top:1px solid #2577e3;border-bottom:1px solid #2577e3;}.sidenav{background-color:#f7f7f7;border-bottom:1px solid #ececec;font-family:microsoft yahei;color:#333}.sidenav a{position:relative;z-index:1;display:block;line-height:1;padding-left:4px;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;color:#333;_zoom:1}.sidenav a:hover{color:#06c;text-decoration:none}.sidenav dt a{padding-left:5px;font-size:14px}.sidenav dt a span{display:block;padding:14px 10px 14px 14px}.sidenav .ico_arr{position:absolute;border:5px solid #fcfcfc;border-top-color:#afafaf;border-bottom:0 none;font-size:0;line-height:0;overflow:hidden}.sidenav dt .ico_arr{top:18px;right:10px}.sidenav dt a:hover .ico_arr{border-top-color:#06c}.sidenav dd{display:none;position:relative;padding-bottom:5px}.sidenav dd a{padding-left:5px;border-top:1px solid #f7f7f7;border-bottom:1px solid #f7f7f7}.sidenav dd a span{display:block;padding:8px 10px 8px 24px}.sidenav dd a.more_order{position:relative;display:inline-block;margin:5px 0 10px 20px;padding:5px 28px 5px 14px;background-color:#e5f0ff;border-radius:20px}.sidenav dd a.more_order:hover{background-color:#2577e3;color:#fff}.sidenav dd a.more_order .ico_arr{top:8px;right:12px;border-color:#e5f0ff;border-top-color:#afafaf}.sidenav dd a.more_order:hover .ico_arr{border-color:#2577e3;border-top-color:#fff}.sidenav dd a.up_order .ico_arr{border:5px solid #e5f0ff;border-bottom-color:#afafaf;border-top:0 none}.sidenav dd a.up_order:hover .ico_arr{border-color:#2577e3;border-bottom-color:#fff}.ico_new2{position:absolute;z-index:3;width:24px;height:11px;top:16px;margin-left:5px;background-position:-162px -9px}.sidenav dd .ico_new2{top:9px}.hide_order{display:none}.sidenav .selected{width:auto;border-left-color:#2577e3;border-right-color:#fff;background-color:#06c;color:#06c}.sidenav dd .selected{border-color:#ececec #fff #ececec #ececec}.sidenav .selected span{background-color:#fff}.sidenav_c dt .ico_arr{border:5px solid #fcfcfc;border-bottom-color:#afafaf;border-top:0 none}.sidenav_c dt a:hover .ico_arr{border-bottom-color:#06c}.sidenav_c dd{display:block}.main{margin-left:159px}#main{height:auto}';
		
		cssApp = '.ctripmenu-pad .cui-warning-mask,.ctripmenu-pad .cui-pageview{left:150px!important;right:0;width:auto}.sidebar-pad{position:fixed;top:0;left:0;bottom:0;z-index:101;width:149px;font-size:16px;border-right:1px solid #AEAEAE;background-color:#EFEFEF;overflow-y: auto;}.sidebar-pad li{position:relative;height:60px;margin-top:1px;padding:0 10px;line-height:60px}.sidebar-pad li:first-child{margin-top:0}.sidebar-pad .current{color:#009FF3;background-color:#FFF}.sidebar-pad .multi-list{height:45px;padding-top:10px;line-height:1.5}.sidebar-pad li div{height:100%;padding-left:35px;white-space:nowrap;overflow:hidden;border-bottom:1px solid #CCC}.sidebar-pad li.multi-list span{display:block;font-size:12px;color:#999}.sidebar-pad li:before{content:"";position:absolute;top:50%;left:13px;width:25px;height:25px;background-image:url(https://pic.c-ctrip.com/h5/rwd_myctrip/un_sidebar@2x.png);background-repeat:no-repeat;background-size:50px 250px;-webkit-transform:translate(0,-50%);-ms-transform:translate(0,-50%);transform:translate(0,-50%)}.sidebar-pad .home:before{background-position:0 0}.sidebar-pad .home.current:before{background-position:-25px 0}.sidebar-pad .order:before{background-position:0 -25px}.sidebar-pad .order.current:before{background-position:-25px -25px}.sidebar-pad .wallet:before{background-position:0 -50px}.sidebar-pad .wallet.current:before{background-position:-25px -50px}.sidebar-pad .coupon:before{background-position:0 -75px}.sidebar-pad .coupon.current:before{background-position:-25px -75px}.sidebar-pad .point:before{background-position:0 -100px}.sidebar-pad .point.current:before{background-position:-25px 0}.sidebar-pad .favorite:before{background-position:0 -125px}.sidebar-pad .favorite.current:before{background-position:-25px -125px}.sidebar-pad .trip:before{background-position:0 -150px}.sidebar-pad .trip.current:before{background-position:-25px -150px}.sidebar-pad .member:before{background-position:0 -175px}.sidebar-pad .member.current:before{background-position:-25px -175px}.sidebar-pad .setting:before{background-position:0 -200px}.sidebar-pad .setting.current:before{background-position:-25px -200px}.sidebar-pad .about:before{background-position:0 -225px}.sidebar-pad .about.current:before{background-position:-25px -225px}#main{padding-left:150px;}@media screen and (max-width:2023px) and (min-width:479px){#main{padding-left:150px}#ctripmenu-wrap{width:149px;' + (self.isInApp? 'top:0;' : 'top:44px;') +'}}@media screen and (max-width:479px){#ctripmenu-wrap{display:none;}#main{padding-left:0}#headerview header{left:0}}';

		// self.tpl = base.deviceEnv() == 0 ? onlineTpl : appTpl;
		// self.cssText = base.deviceEnv() == 0 ? cssOnline : cssApp;
		self.tpl = forTest ? onlineTpl : appTpl;
		self.cssText = forTest ? cssOnline : cssApp;

		self.getUri=function(bdetail){
			if(self.isInApp){
				return location.host;
			}else{
				var proto=location.protocol+'//';
				var host=location.host||'';
				var isdomain=/\w+\..*.com$/.test(host);
				var first = isdomain?host.split('.')[0]:'';
				var second='';
				var url=proto+first;
				if (host.match(/\.fat\d*\.qa\.nt\.ctripcorp\.com|^210\.13\.100\.191/i)) {
					second = isdomain?'.fat19.qa.nt.ctripcorp.com':'m.fat19.qa.nt.ctripcorp.com';
				}else if(host.match(/\.fws\.qa\.nt\.ctripcorp\.com/i)){
					second = '.fat19.qa.nt.ctripcorp.com';
				}
				else if (host.match(/\.uat\.qa\.nt\.ctripcorp\.com/i)) {
					second = '.uat.qa.nt.ctripcorp.com';
				}
				else if (host.match(/^10\.8\.2\.111/i) || host.match(/^10\.8\.5\.10/i)) {
					second = '10.8.5.10';
				}
				else if (host.match(/^(localhost|172\.16|127\.0)/i)) {
					second = host;
				}else {
					second = '.ctrip.com';
				}
				url+=second;
				return bdetail?{url:url,proto:proto,host:host,isdomain:isdomain,first:first,second:second}:url;
			}
		};
		self.onlineMenuJump = function (e) {
			e.preventDefault();
			var $el = $(e.currentTarget),
				$sideNav = $(".sidenav"),
				currentUrl = location.href,
				url , tag;			

			url = $el.attr("href");

			if (currentUrl.indexOf("fat") > 0) {
				tag = ($el.hasClass("navhome") || $el.hasClass("allorders")) ? "fat19" : "fat49"; 	
				url = url.replace(/ctrip/, tag + ".qa.nt.ctripcorp");
			} else if(currentUrl.indexOf("uat") > 0) {
				url = url.replace(/ctrip/, "uat.qa.nt.ctripcorp");
			}			

			if ($el.find(".ico_arr").length > 0) {
				if ($el.parents(".sidenav").hasClass("sidenav_c")) {
					$el.parents(".sidenav").removeClass("sidenav_c");
				}else {
					$sideNav.removeClass("sidenav_c");
					$el.parents(".sidenav").addClass("sidenav_c");
				}
			} else {				
				!$el.hasClass("selected") && (window.location.href = url);
			}
		};
		self.menuLinkJump = function(e) {
			var jli = $(e.currentTarget);
			var uri=self.getUri(true);
			var url =uri.isdomain?'http://m'+uri.second:'http://'+uri.second;
			url+=jli.data("href");
			
			if (self.isInApp && !jli.hasClass("current")) {
				var urlApp = jli.data("app") || jli.data("href");

				if (jli.hasClass("setting")) {
					CtripUtil.app_open_url("ctrip://wireless/myctrip_setconfig", 1);
				} else if (jli.hasClass("trip")){	
					CtripUtil.app_open_url(urlApp, 2, "一生的旅行");
				} else {
					CtripUtil.app_open_url(urlApp, 4);
				}				
			} else {
				!jli.hasClass("current") && (window.location.href = url);
			}
		};

		//钱包跳转;
		self.walletLinkJump = function(e) {
			var hash = '#index';
			var uri=self.getUri(true);
			var url=uri.isdomain?'https://secure'+uri.second.replace('.fat19.','.fws.'):'https://'+uri.second;
			var url2=uri.isdomain?'http://m'+uri.second:'http://'+uri.second;
			var jumpUrl = url+'/webapp/wallet/index.html';
			var fromUrl = url2+'/webapp/myctrip/index.html';
			var tokenArr = {
				from: fromUrl,
				eback: fromUrl
			};
			jumpUrl = jumpUrl + hash + '?token=' + encodeURIComponent(self.Base64(JSON.stringify(tokenArr)));
			
			if (self.isInApp) {
				CtripUtil.app_open_url("wallet/index.html#index", 4);
			} else {
				window.location.href = jumpUrl;
			}
		};

		//优惠券跳转;
		self.couponLinkJump = function() {
			var uri=self.getUri(true);
			var url=uri.isdomain?'https://smarket'+uri.second.replace('.fat19.','.fat21.'):'https://'+uri.second;
			url+='/webapp/promocode/#index';
			var userInfo = JSON.parse(localStorage.getItem('USERINFO'));

			if (self.isInApp) {
				CtripUtil.app_open_url("promocode/index.html#index", 4);
			}else if (userInfo && userInfo.data && userInfo.data.Auth) {
				var tokenJson = {
					auth: userInfo.data.Auth
				};
				window.location.href = url + (url.indexOf("?") > 0 ? "&" : "?") + "token=" + encodeURIComponent(self.Base64(JSON.stringify(tokenJson)));
			}
		};

		//online 滚动时吸附顶部;
		self.windowScroll = function() {
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

			if (scrollTop > 110) {
				$(".aside").addClass("aside_fixed");
			} else {
				$(".aside").removeClass("aside_fixed");
			}
		};

		self.init = function(obj) {
			if (!obj) {
				console.log('method is not supply param obj.');
				return;
			}
			//ipad端或宽屏展示;						
			var isShow = /iPad/.test(navigator.userAgent) || $(window).width() > 767 || isPadApp;
			var cls = '.' + obj.buName, jwrap = $('body').find("#ctripmenu-wrap"), jul = jwrap.find('ul');
			
			if (obj.show && self.isLogin()) { //只有登录时才展示菜单;

				if (isShow) {
					
					if (!$("#ctripmenu-style").length) {
						
						//首页和收藏没有header，重置top值
						if (obj.buName == "home" || obj.buName == "favorite") {						
							self.cssText = self.cssText + "#ctripmenu-wrap{top: 0;}";
						}
						$('<style id="ctripmenu-style">').html(self.cssText).appendTo(document.head);
					}
					if (jwrap.length === 0) {

						if (forTest) {							
							$('.myctrip_wrap') && $(jmenuWrapper.html(self.tpl)).prependTo($('.myctrip_wrap'));


						}else {							

							$('body').append(jmenuWrapper.html(self.tpl));
						}

						

						jul = $('#ctripmenu-wrap ul');
						$onlineSideNav = $(".sidenav");

						jul.find('[data-href]').bind("click", self.menuLinkJump);
						$("#ctripmenu_wallet").bind("click", self.walletLinkJump);
						$("#ctripmenu_coupon").bind("click", self.couponLinkJump);
						$(".sidenav").find("a").bind("click", self.onlineMenuJump);
						$(window).bind("scroll", self.windowScroll);
						jul.find('li').removeClass("current");
						jul.find(cls).addClass("current");					

						//online;
						$onlineSideNav.find('.selected').removeClass("selected");

						if (location.href.indexOf("index") > 0) {
							$(".navhome").addClass("selected");
						} else {
							$(".allorders").addClass("selected");
						}

					} else {
						jwrap.show();
						jul.find('li').removeClass("current");
						jul.find(cls).addClass("current");

						//online;
						$onlineSideNav.find('.selected').removeClass("selected");

						if (location.href.indexOf("index") > 0) {
							$(".navhome").addClass("selected");
						} else {
							$(".allorders").addClass("selected");
						}
					}
					$('body').addClass('ctripmenu-pad');
					self.isShowing = true;
				} else {
					$('body').removeClass('ctripmenu-pad');
					self.isShowing = false;
				}
			} else {
				$("#ctripmenu-style").remove();
				$('body').removeClass('ctripmenu-pad');
				jwrap.hide();
				self.isShowing = false;
			}
		};
		self.reinit = function(obj2) {
			$("#ctripmenu-wrap").remove();
			$("#ctripmenu-style").remove();
			self.sets = obj = $.extend(obj, self.sets || {});
			return self.init(obj2 || obj);
		};
		self.init(obj);
		if (self.sets.bresize) {
			window.onresize = function() {
				self.reinit()
			}
		}
		return self.isShowing;
	};
	return menu;
});