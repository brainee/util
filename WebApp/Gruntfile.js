module.exports = function (grunt) {

  var os = require("os");

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var config = (grunt.file.readJSON('config.json')).pack;
  var version = (grunt.file.readJSON('package.json')).version;
  var hostname = os.hostname();

  //打包路径
  var jsDevUrl,
      cssDevUrl;

  label : for(var i in config){
    if (i === hostname) {
      var c = config[i];
      jsDevUrl = c.js.dev;
      cssDevUrl = c.css.dev;
      break label;
    }
  }

  var requireConfig = {
    "baseUrl" :  "ResCRMOnline/",
    "paths": {
      "text" : "../require.text",
      "main" : "utils/main",
      "base" : "utils/base",
      "ajax" : "utils/ajax",
      "model" : "utils/model",
      "class" : "utils/class",
      "start" : "utils/wrap/start",
      "end" : "utils/wrap/end",
      "network" : "basewidget/network/network",
      "collect" : "basewidget/collect/collect",
      "prompt" : "basewidget/prompt/prompt",
      "ctripmenu" : "basewidget/ctripmenu/ctripmenu",
      "pull" : "basewidget/pull/pull",
	  "pulldown" : "basewidget/pulldown/pulldown"
      //"scroll" : "basewidget/scroll/scroll"
    },
    "include" : [
      "text",
      "main",
      "base",
      "network",
      "collect",
      "prompt",
      "ctripmenu",
      "pull",
	  "pulldown",
      //"scroll",
      "text!template/collect.html",
      "text!template/menu_app.html",
      "text!template/menu_online.html"
    ],
    wrap : {
      startFile: 'ResCRMOnline/utils/wrap/start.js',
      endFile: 'ResCRMOnline/utils/wrap/end.js'
    }
  };

  var fileArr = ['ResCRMOnline/**.**','ResCRMOnline/**/**.**','ResCRMOnline/**/**/**.**'], //需要被监控的文件列表
      otherFiles = [
        "Gruntfile.js",
        "config.json"
      ];

  var cFileArr = fileArr.concat( otherFiles );

  var cssPackUrl = ['ResCRMOnline/basewidget/**/**.less'];

  grunt.initConfig({
    watch : {
      job : {
        files: cFileArr,
        tasks: ['requirejs:dev','less:dev']
      },
        scroll : {
            files : cFileArr,
            tasks : [ 'requirejs:scroll','less:web','less:app' ]
        }
    },
    less : {
      dev : {
        files : [{
          src : cssPackUrl,
          dest : cssDevUrl
        }],
        options : {
          compress : true
        }
      },
      web : {
        files : [{
          src : cssPackUrl,
          dest : "ResCRMOnline/basewidget/main.css"
        }],
        options : {
          compress : true
        }
      },
      app : {
        files : [{
          src : cssPackUrl,
          dest : "res/style/main.css"
        }],
        options : {
          compress : true
        }
      }
    },
    requirejs : {
      dev : {
        options : {
          "baseUrl": requireConfig.baseUrl,
          "optimize" : "none",
          "almond" : true,
          "name" : "../almond",
          "paths": requireConfig.paths,
          "include" : requireConfig.include,
          "out" : jsDevUrl,
          "exclude" : requireConfig.exclude,
          "wrap" : requireConfig.wrap
        }
      },
      web : {
        options : {
          "baseUrl": requireConfig.baseUrl,
          "almond" : true,
          "name" : "../almond",
          "paths": requireConfig.paths,
          "include" : requireConfig.include,
          "out" : "ResCRMOnline/basewidget/main.js",
          "exclude" : requireConfig.exclude,
          "wrap" : requireConfig.wrap
        }
      },
        scroll : {
            options : {
                "baseUrl": requireConfig.baseUrl,
                "optimize" : "none",
                "almond" : true,
                "name" : "../almond",
                "paths": requireConfig.paths,
                "include" : requireConfig.include,
                "out" : "ResCRMOnline/basewidget/main.js",
                "exclude" : requireConfig.exclude,
                "wrap" : requireConfig.wrap
            }
        }
    }
  });

  grunt.registerTask('dev',[
    'watch:job'
  ]);

 /* grunt.registerTask('scroll',[
    'watch:scroll'
  ]);*/

  grunt.registerTask('web',[
    'requirejs:web','less:web','less:app'
  ]);  

};