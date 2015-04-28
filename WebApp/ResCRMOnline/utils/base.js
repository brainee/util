define(['class'],function ( $class ){

    var Base = new $class;

    var classToType = {},
        toString = classToType.toString;

    "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function ( el ){
        classToType[ "[object " + el + "]" ] = el.toLowerCase();
    });

    var isType = function ( obj ){
        return obj == null ? String(obj) :
        classToType[toString.call(obj)] || "object";
    };

    Base.extend({
        init : function (){},
        isPreProduction : function (){
            return localStorage.getItem( "isPreProduction" );
        }, //hybrid环境
        isObject : function ( el ){
            return isType( el ) == "object";
        },
        isBool : function ( el ){
            return isType( el ) == "boolean";
        },
        isNumeric : function ( num ){
            return typeof num == "number" && !isNaN( num ) && isFinite( num );
        },
        isArray : Array.isArray || function ( object ){
            return object instanceof Array
        },
        has : function ( el ){
            return Array.isArray( el ) ? el.length > 0 : $(el) && $(el).length > 0;
        },
        //aka : Object.keys
        keys : function( obj ) {
            var a = [];
            for(a[a.length] in obj);
            return a;
        },
        //aka : _.values
        values : function ( obj ){
            var keys = this.keys(obj);
            var length = keys.length;
            var values = Array(length);
            for (var i = 0; i < length; i++) {
                values[i] = obj[keys[i]];
            }
            return values;
        },
        //数组去重
        unique : function ( array ){
            var n = {},r=[];
            for(var i = 0; i < array.length; i++) {
                if (!n[array[i]]) {
                    n[array[i]] = true;
                    r.push(array[i]);
                }
            }
            return r;
        },
		isPC : function() {
			var useragent = navigator.userAgent;
			var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod", "BB10", "PlayBook", "Macintosh", "KFAPWI", "KFTHWI"];
			var isPC = true;
			for (var v = 0; v < Agents.length; v++) {
				if (useragent.indexOf(Agents[v]) > 0) {
					isPC = false;
					break;
				}
			}
			return isPC;
		},
        isIOS : function (){
            var _ua = navigator.userAgent;
            return /iPhone|iPad|Mac OS X/g.test( _ua ) && _ua.indexOf("Safari") > -1;
        },
        isInApp : function (){
            var useragent = navigator.userAgent, bInApp = false;
            var data = window.localStorage.getItem('isInApp') || window.localStorage.getItem('ISINAPP');
            if (useragent.indexOf('CtripWireless') > -1) {
                bInApp = true;
            }
            if (data) {
                bInApp = data == '1';
            }
            return bInApp;
        },
        //channel
        //default : 0
        //Online  : 1
        //H5      : 2
        //App     : 3
        channel : function (){
            return this.isPC() ? 1 : this.isInApp() ? 3 : 2;
        },
        deviceEnv : function () {
            var ua = navigator.userAgent;
            var padRegex = /ipad|android/i;
            var isOnline = !this.isInApp() && !padRegex.test(ua) && $(window).width() > 767;
            var isPadApp = ua.match(/Ctrip_Pad_App/i);
            var rv;

            if (isOnline) {
                rv = 0;
            }
            else if (isPadApp) {
                rv = 10;
            }
            else if (padRegex.test(ua) && $(window).width() > 767) {
                rv = 11;
            }
            else if (this.isInApp() && $(window).width() < 768) {
                rv = 20;
            }
            else{
                rv = 21;
            }

            return rv;
        },
        parent : function ( el ){
            return $((el && typeof el === "string" && /(\.|#)(\w|-)+/.test( el )) ? el : "#main" );
        },
        getHeadStore : function (){
            var headStore = localStorage.getItem( "HEADSTORE" );
            return headStore && JSON.parse( headStore );
        },
        isLogin : function() {
            var _userInfo = localStorage.getItem('USER');
            var userInfo = (_userInfo && JSON.parse( _userInfo )) || null,
                now = +new Date(),
                timeOut;
            if (!userInfo || !userInfo.value || !userInfo.value.Auth || !userInfo.timeout) {
                return false;
            }
            /*验证是否过期*/
            if (userInfo && userInfo.timeout) {
                timeOut = +new Date(userInfo.timeout.replace(/-/g, "/"));
                return timeOut - now >= 0;
            }
        },
        loginAction : function() {
            var host = window.location.host;
            var domain = "accounts.ctrip.com";
            var LINKS = 'https://' + domain + '/H5Login/#login';

            if (host.match(/^m\.ctrip\.com/i)) {
                domain = "accounts.ctrip.com";
            } else if (host.match(/\.uat\.qa/i)) {
                domain = "accounts.uat.qa.nt.ctripcorp.com";
            } else if (host.match(/\.fat/i) || host.match(/\.fws/i) || host.match(/^(localhost|172\.16|127\.0)/i)) {
                domain = "accounts.fat49.qa.nt.ctripcorp.com";
            }
            window.location.href = LINKS;
        },
        getEnv : function () {
            if (this.isInApp()) {
                if (this.isPreProduction() == '1') { // 定义堡垒环境
                    return "baolei";
                }
                else if (this.isPreProduction() == '0') { // 定义测试环境
                    return "test";
                }
                else if (this.isPreProduction() == '2') { // 定义UAT环境
                    return "uat";
                }
                else {
                    return "pro";
                }
            }
            else {
                var host = location && location.hostname;
                if (host.match(/^(localhost|172\.16|127\.0)/i)) {
                    return "local";
                }
                else if (host.match(/m\.fat\d*\.qa\.nt\.ctripcorp\.com|^210\.13\.100\.191/i)) {
                    return "test";
                }
                else if (host.match(/^m\.uat\.qa\.nt\.ctripcorp\.com/i)) {
                    return "uat";
                }
                else if (host.match(/^10\.8\.2\.111/i) || host.match(/^10\.8\.5\.10/i)) {
                    return "baolei";
                }
                else {
                    return "pro";
                }
            }
        },
        loadStyle : function (){
            if( this.getEnv() === "local" && location.href.indexOf("?test=cPublic") > -1 ){
                return !this.has("#cpH5MainCss") ? '<link href="main.css" type="text/css" rel="stylesheet" id="cpH5MainCss"/>' : "";
            }else{
                if( this.isInApp() ){
                    return !this.has("#cpH5MainCss") ? '<link href="../basewidget/res/style/main.css" type="text/css" rel="stylesheet" id="cpH5MainCss"/>' : "";
                }else{
                    var str = location.protocol + "//webresource.c-ctrip.com/ResCRMOnline/R5/basewidget/main.css";
                    return !this.has("#cpH5MainCss") ? "<link href='"+ str +"' type='text/css' rel='stylesheet' id='cpH5MainCss' />" : "";
                }
            }
        },
        getProtocol : function (){
            var _protocol = location.protocol && location.protocol.slice( 0, -1 ),
                protocol = _protocol !== "file" ? _protocol : "http";
            return protocol;
        },
        getMethod : function (){
            return this.getProtocol() === "http" ? "gateway" : "common";
        },
        prompt : function ( val ){
            var toast = $(".cp-h5-collect-toast"),
                $has = !toast.html();
            if( $has ){
                toast = $('<div class=cp-h5-collect-toast style="left:50%; margin-left:-130px; visibility: visible; z-index: 113003; top: 50%; position: fixed; display: none;"><div style="width: 220px; line-height: 24px; border-radius: 5px; background: rgba(0,0,0,.7); padding: 10px 15px; color: #fff; font-weight: 700; text-align: center; word-break: break-all;"><div class=cui-layer-content></div></div></div>');
                $("body").append(toast);
            }
            toast.show().find(".cui-layer-content").html( val );
            setTimeout(function (){
                toast[$has?'remove':'hide']();
            },2000)
        },
        //事件代理
        delegate : function ( maps ){
            //获取事件map 的 keys ( "click .xxx", "keyup .yyy" ... 这种 )
            var keys = this.keys( maps ),
            //获取事件map 的 函数 ( function xxx (){} )
                values = this.values( maps);

            var e = [],  //click , keyup 等事件名称
                m = [];  //.xxx, #xxx 等元素

            keys.forEach(function ( el, i ){
                var r = el.split(" ");
                e.push( r[0] );
                m.push( r[1] );
            });
            //注册监听器
            this.unique(e).forEach(function ( el ){
                $(".cp-h5-main").off(el).on(el, typeAction);
            });

            function typeAction (event){
                keys.every(function ( el, i){
                    if( event.type == e[i] ){
                        if( m[i][0] == "#" && event.target.id == m[i].slice(1)){
                            values[i].call( this, event );
                            return false;
                        }else if( m[i][0] == "." && event.target.classList.contains(m[i].slice(1))){
                            values[i].call( this, event );
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        return true;
                    }
                });
            }
        },
        base64 : function ( str ){
            var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var out, i, len;
            var c1, c2, c3;
            len = str.length;
            i = 0;
            out = "";
            while(i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if(i == len)
                {
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if(i == len)
                {
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
                out += base64EncodeChars.charAt(c3 & 0x3F);
            }
            return out;
        }
    });

    //自动加载css
    $("head").append(Base.loadStyle());

    return Base;
});