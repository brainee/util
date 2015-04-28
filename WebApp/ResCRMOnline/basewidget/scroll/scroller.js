define(["class", "base"], function ( $class, base ){

    var Scroll = new $class();

    var rAF = window.requestAnimationFrame	||
        window.webkitRequestAnimationFrame	||
        window.mozRequestAnimationFrame		||
        window.oRequestAnimationFrame		||
        window.msRequestAnimationFrame		||
        function (callback) { window.setTimeout(callback, 1000 / 60); };

    Scroll.include({
       init : function (options){
           var defaultOptions = {
               wrapper : null,
               scroller : null,
               distance : 100,
               timeout : 5000,
               pullCallback : false,
               pushCallback : false
           };

           this.opt = $.extend(defaultOptions, options);

           //判断触发了哪些事件
           this.isSwipeDown = false;
           this.isSwipeUp = false;

           //io锁默认关闭，当触发pull/push事件，打开锁,禁止再次触发事件，
           // 当默认5秒内没有回调函数返回，关闭锁，重新允许pull/push事件
           this.IOLock = false;

           //动画计时器
           this.animateTimer = null;

           this.wrapper = $(this.opt.wrapper);
           this.scroller = $(this.opt.scroller);

           //内部transform,外面也需要加一个transform用来盖住
           this.wrapper.addClass("cpWpTransform");
           //内部加一个class用来运行css3动画
           this.scroller.addClass("cpWpSwipe");

           //计算基于document的绝对位置
           this.InitDATA();

           this.eventTrigger();

           this.update();
       },
       InitDATA : function (){
           var unWHeight = this.wrapper.height(),
               unWPadding = parseInt(this.wrapper.css("padding"),10),
               unWMargin = parseInt(this.wrapper.css("margin"),10),
               unSHeight =  this.scroller.height(),
               unSPadding = parseInt(this.wrapper.css("padding"),10),
               unSMargin = parseInt(this.wrapper.css("margin"),10);

           var wHeight = unWHeight + unWPadding + unWMargin;
           var sHeight = unSHeight + unSPadding + unSMargin;

           this.minTop = 0;
           this.maxTop = wHeight - sHeight;

           console.warn(
               "minTop:" + this.minTop,
               ",maxTop:" + this.maxTop
           );
       },
       scrollFix : function (elem){
           var startY, startTopScroll;
           elem = document.querySelector(elem);
           if(!elem) return;
           elem.addEventListener('touchstart', function(event){
               startY = event.touches[0].pageY;
               startTopScroll = elem.scrollTop;
               if(startTopScroll <= 0)
                   elem.scrollTop = 1;
               if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
                   elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
           }, false);
       },
       eventTrigger : function () {
           var self = this,
               start,
               end;

           this.wrapper.on("touchstart", function (e){
               start = e.changedTouches[0].pageY;
           });

           //阻止safari橡皮筋效果
           if(base.isIOS()){
               this.scrollFix( this.opt.wrapper );
           }

           this.wrapper.on("touchend", function (e){
               end = e.changedTouches[0].pageY;
               var dis = end - start;
               //从上至下拉
               if( dis > 0 ){
                   self.isSwipeDown = true;
               }
               //从下至上拉
               else if ( dis < 0 ){
                   self.isSwipeUp = true;
               }
               //点击
               else{
                   console.log("click");
               }
           });
       },
       changeEffect : function ( effect, method  ){
           var b = method == "addClass";
           //非IOS使用css3效果实现，
           //ios使用自己的橡皮筋效果
           //if( !base.isIOS() ){
               this.scroller[ method ]( "h5Swipe" + effect );
           //}
           this["isSwipe" + effect] = b;
       },
       checkAddAction : function ( obj ){
           var b = obj == "pull",
               //获取scoller当前位置
               t = this.scroller.position().top;

           //如果是pull,则判断最小位置是否满足,如果是push,则判断最大位置是否满足
           if( b  ? t >= this.minTop : t <= this.maxTop ){

               var _callback = b ? "pull" : "push",
                   _getMethod = function ( cdt ){
                      return cdt ? "Down" : "Up";
                   };

               var _dir = _getMethod(b),
                   __dir = _getMethod(!b);

               this.changeEffect( _dir, "addClass" );

               if( !this.IOLock
                   && typeof this.opt[ _callback + "Callback" ] == "function"
                   && this[ "isSwipe" + _dir ]
               ){
                   this.IOLock = true;
                   //执行reCallback
                   //传过去当前事件，和非当前事件
                   this[ _callback ]( _dir, __dir);
               }
           }
       },
       update : function (){
           var self = this;
           //不断检测滚动条是否被触发

           if( this.isSwipeDown ){
               this.isSwipeDown = false;
               this.checkAddAction("pull");
           }else if( this.isSwipeUp ){
               this.isSwipeUp = false;
               this.checkAddAction("push");
           }

           rAF(function (){
               self.update();
           });
       },
       resetBackScrollAnimate : function (c,o,callback){
           var self = this;
           //重置变量
           self.IOLock = false;
           //重置动画
           //清除动画
           self.changeEffect( c, "removeClass");
           self.changeEffect( o, "addClass");
           //清除回滚动画
           this.animateTimer = null;
           this.animateTimer = setTimeout(function (){
               self.changeEffect( o, "removeClass" );
               return callback && callback();
           },500);
       },
       //fn：需要执行的回调函数
       //c : 当前的事件名称（ pull/push ）
       //o : 非当前事件名称（ pull/push ）
       reCallback : function (fn, c, o){
           var self = this;
           fn(
               function (callback){     //error
                   self.resetBackScrollAnimate(c,o,function () {
                       return callback && typeof callback == "function" && callback();
                   })
               },
               function ( callback ){   //success
                   self.resetBackScrollAnimate(c,o,function () {
                       //重新计算DOM 模型
                       self.InitDATA();
                       //执行回调函数
                       return callback && typeof callback == "function" && callback();
                   })
               }
           );
       },
       pull : function (c, o) {
           return this.reCallback(this.opt.pullCallback, c, o);
       },
       push : function (c, o){
           return this.reCallback(this.opt.pushCallback, c, o);
       }
    });

    return Scroll;
});