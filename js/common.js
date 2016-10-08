/**
 * Created by zhbr on 2016/9/18.
 * common.js用来加载以下文件和方法（使用原生js，请在引用所有js文件前引用）
 * 1. 加载jquery文件
 * 2. 加载jquery.common.js 文件
 * 3. 加载自定义原声js方法  smoki对象的importJS和importCSS方法
 * 4. 加载使用者自己引入的js文件（保证jquery是最先引入的）
 */

(function () {

    function getWebRoot(rootName) {
        var js = document.scripts;
        var jsPath=js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/"));
        while(jsPath.lastIndexOf(rootName)-(-rootName.length) !== jsPath.length ){
            jsPath = jsPath.substring(0 , jsPath.lastIndexOf("/"))
        }

        return jsPath + '/';

    }
    var webRoot =getWebRoot('Jsmoki');

    //js文件的路径（工程下js目录下的文件路径）
    var js_src = ["js/lib/jquery-3.0.0.min.js",
                    "js/util/jquery.smoki.bridge.js",
                    "js/core/jquery.smoki.base.js",
                    "js/util/jquery.smoki.map.js",
                    "js/core/jquery.smoki.widgetmgr.js",
                    "js/core/jquery.smoki.widget.js",
                    "js/loading/jquery.smoki.waiting.js",
                    "js/dialog/jquery.smoki.dialog.js"];

    //css文件路径（）
    var css_src = [ "css/theme1/common.css" , 'css/theme1/dialog.css' , "css/icomoon/style.css"];

    window.smoki = {
        importJS  : function (jsurl) {
            var newEl = document.createElement("script");
            newEl.setAttribute("type" , "text/javascript");
            newEl.setAttribute("src" , webRoot + jsurl);
            document.getElementsByTagName("head").item(0).appendChild(newEl);
        },

        importCSS : function (cssurl) {
            var newEl = document.createElement("link");
            newEl.setAttribute("type" , "text/css");
            newEl.setAttribute("rel" , "stylesheet");
            newEl.setAttribute("href" , webRoot + cssurl);
            document.getElementsByTagName("head").item(0).appendChild(newEl);
        }
    };

    for(var i = 0 ; i < css_src.length ; i++){
        // smoki.importJS(js_src[i]);
        //noinspection JSDuplicatedDeclaration
        var aaa = "<link href='" + webRoot + css_src[i] + "' type='text/css' rel='stylesheet'/>";
        document.write(aaa);
    }

    for(var i = 0 ; i < js_src.length ; i++){
        // smoki.importJS(js_src[i]);
        //noinspection JSDuplicatedDeclaration
        var aaa = "<script src='" + webRoot + js_src[i] + "' type='text/javascript'></script>";
        document.write(aaa);
    }



})();
