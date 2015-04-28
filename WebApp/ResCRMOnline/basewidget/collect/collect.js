define([ 'class', "base", "model", template('collect') ],function ( $class, base, Model, html ){

    var Collect = new $class();
    if(!window.h5collect) window.h5collect = {};
    h5collect.groupNameList = [];
    Collect.include({
        init : function (){
            var options = arguments[0];
            if( !options || typeof options !== "object" ) options = {};
            this.parent = base.parent( options.parent );
            this.query = Model;
            this.elem = $( html );
            this.favoirteTags = this.elem.find(".pop-group-list");
            this.mask = this.elem.find(".cp-h5-mask");
        },
        save : function ( options, callback ){
            var self = this;
            if ( !options ||  typeof options !== "object" || typeof callback !== "function"
                || !base.isArray(options.FavoriteList) ){
                return callback({ errorMsg : "FavoriteList参数错误" });
            }
            var FavoriteList = options.FavoriteList;
            var channel = options.Channel || null;

            this.query.addProduct( FavoriteList, channel, function ( error,data ){
                if( error ){
                    return callback ( error );
                }else{
                    //添加ubt代码
                    if (typeof window['__bfi'] == 'undefined') window['__bfi'] = [];
                    window['__bfi'].push([
                        '_tracklog',
                        'COLLECT_FROM',
                        'from='+base.isInApp()?'Hybrid':'H5'
                    ]);
                    //收藏成功
                    h5collect.FavoriteIDs = data.FavoriteIdList;
                    //进入分组
                    self.group(function ( error ){
                        if( error ) return callback( error );
                        //返回FavoriteID,用于取消收藏
                        return callback( null,{
                            "FavoriteIDs" : h5collect.FavoriteIDs
                        });
                    });
                }
            });
        },
        //是否已经收藏
        isMyFavorites : function ( options, callback ){
            if ( !options ||  typeof options !== "object" || typeof callback !== "function" || !base.isArray(options.QueryList) ){
                return callback({ errorMsg : "QueryList参数错误" });
            }
            var QueryList = options.QueryList;
            var QueryProductList = [];
            var FavoriteIDList = [];

            //将需要查询的product放入数组中
            QueryList.forEach(function ( el ){
                QueryProductList.push( el.ProductID );
                FavoriteIDList.push(null);
            });

            this.query.isMyFavorites( QueryList, function ( error, data ){
                if( error ){
                    base.prompt("网络错误，请重试");
                    return callback( error );
                }
                var resultList = (data && data.ResultList) || [];
                var ok;
                //遍历结果数组，然后在请求数组中查询，如果查到了，就把查到的项变为true
                resultList.forEach(function ( el ){
                    //服务返回的 el.ProductID是个string
                    var n = QueryProductList.indexOf(parseInt(el.ProductID,10));
                    if( n > -1 ){
                        QueryProductList[n] = true;
                        FavoriteIDList[n] = el.FavoriteID;
                        ok = true;
                    }
                });
                //将没有查到的项变为false
                QueryProductList.forEach(function (el,i){
                    if(!base.isBool(el)){
                        QueryProductList[i] = false;
                        ok = false;
                    }
                });

                return callback( null, {
                    result : QueryProductList,
                    FavoriteIDs : FavoriteIDList,
                    success : ok
                });
            });
        },
        cancel : function ( FavoriteIDs, callback ){
            var params = Array.isArray( FavoriteIDs ) ? FavoriteIDs : [ FavoriteIDs ];
            this.query.deleteProduct( params, function ( error, data ){
                if( error ){
                    base.prompt("取消收藏失败");
                    return callback ( error );
                }
                base.prompt("取消收藏成功");
                return callback( null, data );
            });
        },
        fn : function ( callback ){

            var self = this;
            this.collectView = $(".cp-h5-collect");
            this.newGroupView = $(".cp-h5-newGroup");
            this.cancelBtn = $(".cui-btns-cancel");
            this.sureBtn = $(".cui-btns-sure");
            this.groupInput = $(".group-new-input");
            this.mask = $(".cp-h5-mask");
            this.createNewGroupBtn = $(".cp-newGroupBtn");
            this.clearVal = $(".group-clear-val");

            return {
                //新建分组输入事件
                inputEvents : function (e){
                    var b = $(e.target).val().length > 0;
                    self.clearVal[ b ? 'show' : 'hide' ]();
                },
                //确认创建新分组
                joinGroupView : function (){
                    self.collectView.hide();
                    self.newGroupView.show();
                    self.groupInput.focus();
                },
                //取消创建新分组
                cancelGroupView : function (){
                    self.collectView.show();
                    self.newGroupView.hide();
                },
                //兼容h5中输入框
                groupViewCompatible : function (){
                    if( !base.isInApp() ) {
                        self.newGroupView.css({"top": "150px"});
                    }
                },
                //清空输入框
                clearInput : function (){
                    //新建分组页面回到页面中间
                    self.newGroupView.css({"top":"50%"});
                    self.groupInput.val("");
                    self.clearVal.hide();
                },
                //右上角的关闭按钮
                closeAllView : function (){
                    self.collectView.hide();
                    self.mask.hide();
                    //保存至未分组,服务会判断
                    base.prompt("已添加至“未分组”");
                    if( self.$fn ) self.$fn = null;
                    return callback( null, true );
                },
                //确认创建新分组
                createNewGroupEntity : function (){
                    self.query.validateGroupName( self.groupInput.val(),function ( error ){
                        if( error ){
                            base.prompt( error.errorMsg || "网络错误，请重试");
                            return;
                        }
                        base.prompt("已添加至“"+ self.groupInput.val() +"”");

                        self.collectView.hide();
                        self.newGroupView.hide();
                        self.mask.hide();
                        self.groupInput.val("");

                        return callback( null,true );
                    });
                },
                //添加进分组
                saveToMyFavorite : function (e){
                    var tagid = $(e.target).attr("tagid"),
                        tagName = $(e.target).text();
                    if(!tagid) return;
                    self.query.collectIt(tagid,function ( error ){
                        if( error ){
                            base.prompt("网络错误，请重试");
                            return;
                        }
                        base.prompt("已添加至“"+ tagName +"”");
                        self.collectView.hide();
                        self.newGroupView.hide();
                        self.mask.hide();

                        return callback( null,true );
                    });
                }
            }
        },
        group : function ( callback ){
            var self = this;
            //获取taglist
            this.query.getGroupInfo($.proxy(function ( error,data ){
                if( error && error.errorMsg === "notLoggedIn" ){
                    return callback({ "errorMsg" : error.errorMsg });
                }
                h5collect.groupNameList = [];
                var html = "";
                $(data.TagList).each(function ( i,el ){
                    if( el.TagID != 0 && el.TagID != -100 && el.TagName !== "攻略" ){	//0是<未分组>，-100是<全部>
                        html += "<li class='pop-group-list-item' TagID=\""+ el.TagID +"\">" + el.TagName + "</li>";
                    }
                    //保存至组名列表
                    h5collect.groupNameList.push( el.TagName );
                });
                this.favoirteTags.html( html );

                if( base.has('.cp-h5-collect') ){
                    if( this.newGroupView.css("display") === "none" ) this.collectView.show() && this.mask.show();
                }else{
                    this.parent.append( this.elem );
                }

                this.$fn = this.fn.call(self,callback);

                base.delegate({
                    "keyup .group-new-input" : this.$fn.inputEvents,
                    "click .group-new-input" : this.$fn.groupViewCompatible,
                    "click .group-clear-val" : this.$fn.clearInput,
                    "click .i-close" : this.$fn.closeAllView,
                    "click .cui-btns-sure" : this.$fn.createNewGroupEntity,
                    "click .pop-group-list-item" : this.$fn.saveToMyFavorite,
                    "click .cp-newGroupBtn" : this.$fn.joinGroupView,
                    "click .cui-btns-cancel" : this.$fn.cancelGroupView
                });

                this.$fn = null;    //释放内存

            },this));
        }
    });

    return Collect;
});