define(['base','class'],function ( base, $class ){

	var host = location.host,
		protocol = base.getProtocol(),
		method = base.getMethod();

	var Query = new $class();

	Query.include({
		baseurl : function ( path ) {

			var domain = 'm.ctrip.com';

			var domainarr = {
				"local": {
					"https": {
						"common": { "domain": "secure.fat19.qa.nt.ctripcorp.com", "path": "restapi" }
					},
					"http": {
						"common": { "domain": "gateway.m.fws.qa.nt.ctripcorp.com", "path": "restapi" },
						"gateway": { "domain": "gateway.m.fws.qa.nt.ctripcorp.com", "path": "restapi" },
						"cruise_gateway": { "domain": "orderws.cruise.fat6.qa.nt.ctripcorp.com", "path": "Cruise-Order-OpenAPI" }
					}
				},
				"test": {
					"https": {
						"common": { "domain": "secure.fat19.qa.nt.ctripcorp.com", "path": "restapi" }
					},
					"http": {
						"common": { "domain": "gateway.m.fws.qa.nt.ctripcorp.com", "path": "restapi" },
						"gateway": { "domain": "gateway.m.fws.qa.nt.ctripcorp.com", "path": "restapi" },
						"cruise_gateway": { "domain": "orderws.cruise.fat6.qa.nt.ctripcorp.com", "path": "Cruise-Order-OpenAPI" }
					}
				},
				"uat": {
					"https": {
						"common": { "domain": "restful.m.uat.qa.nt.ctripcorp.com", "path": "restapi" }
					},
					"http": {
						"common": { "domain": "gateway.m.uat.qa.nt.ctripcorp.com", "path": "restapi" },
						"gateway": { "domain": "gateway.m.uat.qa.nt.ctripcorp.com", "path": "restapi" },
						"cruise_gateway": { "domain": "orderws.cruise.fat6.qa.nt.ctripcorp.com", "path": "Cruise-Order-OpenAPI" }
					}
				},
				"baolei": {
					"https": {
						"common": { "domain": "10.8.5.99", "path": "restapi" }
					},
					"http": {
						"common": { "domain": "10.8.14.28:8080", "path": "restapi" },
						"gateway": { "domain": "10.8.14.28:8080", "path": "restapi" },
						"cruise_gateway": { "domain": "orderws.cruise.fat6.qa.nt.ctripcorp.com", "path": "Cruise-Order-OpenAPI" }
					}
				},
				"pro": {
					"https": {
						"common": { "domain": "wpg.ctrip.com", "path": "restapi" }
					},
					"http": {
						"common": { "domain": "m.ctrip.com", "path": "restapi" },
						"gateway": { "domain": "m.ctrip.com", "path": "restapi" },
						"cruise_gateway": { "domain": "m.ctrip.com", "path": "restapi" }
					}
				}
			};

			domain = domainarr[ base.getEnv() ][ this.protocol ][ this.method ][ "domain" ];

			return domain
		},
		buildurl: function ( path ) {
			var domain = this.baseurl();
			//var path = path || 'restapi/soa2/10108/json/';
			var tempUrl =  protocol + '://' + domain + '/';
			return tempUrl;
		},
		setting : function (  options /* method,protocol,interface */ ){
			if( !options || typeof options !== "object" || !options.interface ){
				console.error( "options parameters error" );
				return;
			}
			this.method = options.method || method;
			this.protocol = options.protocol || protocol;
			this.requestUrl = this.buildurl() + options.interface;
		},
		send : function ( url,data,callback,type ){

			var self = this;

			var type = type || "POST";

			var head = base.getHeadStore();

			//如果取不到则判断没有登录
			if( !head || typeof head.value !== "object" || !base.isLogin() ){
				return callback({ "errorMsg":"notLoggedIn" });
			}

			var $data = {};
			$data.head = head.value;

			//data与$data合并
			if( typeof data === "object" ){
				for( var i in data ){
					$data[i] = data[i];
				}
			}
			$.ajax({
				url : this.requestUrl + url,
				type : type,
				dataType : "json",
				data : JSON.stringify( $data ),
				contentType : "application/json",
				success : function ( data ){
					return callback( null,data );
				},
				error : function ( xhr,error ){
					return callback({ "errorMsg":error });
				}
			});
		}
	});

	return Query;
});