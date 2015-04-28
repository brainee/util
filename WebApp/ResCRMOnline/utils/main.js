var template = function ( url ){
	return "text!template/" + url + ".html";
};

requirejs.config({
	"baseUrl" : "./",
	"paths" : {
		"network" : "basewidget/network/network",
		"collect" : "basewidget/collect/collect",
		"prompt" : "basewidget/prompt/prompt",
		"ctripmenu" : "basewidget/ctripmenu/ctripmenu",
		"pull" : "basewidget/pull/pull",
		"pulldown" : "basewidget/pulldown/pulldown",
        "scroll" : "basewidget/scroll/scroll",
		"base" : "utils/base"
	}
});