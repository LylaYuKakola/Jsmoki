(function($) {

	/**
	 * @class core.widgetmgr
	 * @extends core.Base
	 * 实现类似java中的map类
	 */
	$.widget("smoki.widgetmgr", {
				ctype : "widgetmgr",
				version : "0.5",
				options : {},
				_create : function() {
					// 创建前事件
					this._super();
					this._all=new smokiMap();
				},
				/**
				 * 注册一个组件
				 * @param {f1.widget} w 需要注册的组件
				 */
				register : function(w){
            		this._all.add(w.getId(),w);
       			},
				
		        /**
		         * 注销一个组件.
		         * @param {f1.widget} w 需要注销的组件
		         */
		        unregister : function(w){
		            this._all.remove(w.getId());
		        },
		        
		        get:function(id){
		        	return this._all.getValue(id);
		        }
		        
			});
})(jQuery);

/*
 * 定义全局变量
 * 
 * F1WidgetMgr 组件管理器
 */
var SmokiWidgetMgr = new $.smoki.widgetmgr();

// 防止出现匿名代码段
//@ sourceURL=src/core/jquery.f1.widgetmgr.js
//# sourceURL=src/core/jquery.f1.widgetmgr.js
