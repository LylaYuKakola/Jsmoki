(function($) {

	/**
	 * @class util.filterlist
	 * @extends core.Base 实现类似java中的map类
	 */
	$.widget("smoki.Smokimap", {
				ctype : "Smokimap",
				version : "0.5",
				options : {},
				_create : function() {
					// 创建前事件
					this._super();
					this._keys = [];
					// 用来快速查找，不用从_array中查找
					this._map = {};
					this._array = [];
				},
				/**
				 * map的长度
				 */
				length : function() {
					return this._array.length;
				},
				/**
				 * 新增对象
				 * 
				 * @param {Object}
				 *            key 主键
				 * @param {Object}
				 *            value 对象
				 */
				add : function(key, value) {
					this._array.push(value);
					this._keys.push(key);
					this._map[key] = value;
				},
				/**
				 * 根据key获取索引号，没有找到为-1
				 * 
				 * @param {Object}
				 *            key 主键
				 * @return {Int} 对象索引号，没有找到为-1
				 */
				indexOf : function(key) {
					for (var i = 0; i < this._keys.length; i++) {
						if (this._keys[i] == key) {
							return i;
						}
					}
					return -1;
				},

				/**
				 * 获取索引号所在对象
				 * 
				 * @param {Int}
				 *            i 索引号
				 * @return {Object} 对象
				 */
				itemAt : function(i) {
					return this._array[i];
				},
				/**
				 * 获取key的对应值，没有找到为null
				 * 
				 * @param {Object}
				 *            key 主键
				 * @return {Object} 对象，没有找到为null
				 */
				getValue : function(key) {
					return this._map[key];
				},
				/**
				 * 是否包含key
				 * 
				 * @param {Object}
				 *            key 主键
				 */
				contains : function(key) {
					return this.indexOf(key) != -1;
				},
				/**
				 * 清空map
				 */
				clear : function() {
					if (this._array.length > 0) {
						this._array.splice(0, this._array.length);
						this._keys.splice(0, this._keys.length);
						this._map = {};
					}
				},
				/**
				 * 删除索引号所在元素
				 * 
				 * @param {Int}
				 *            p_index 索引号
				 */
				removeAt : function(p_index) {
					if (p_index >= 0 && p_index < this._array.length) {
						this._array.splice(p_index, 1);
						var _key = this._keys[p_index];
						delete this._map[_key];
						this._keys.splice(p_index, 1);
					} else {
						return false;
					}
				},
				/**
				 * 删除key对应元素
				 * 
				 * @param {Object}
				 *            key 主键
				 */
				remove : function(key) {
					return this.removeAt(this.indexOf(key));
				},
				/**
				 * 在索引号位置插入值
				 * 
				 * @param {Int}
				 *            p_startIndex 位置索引号
				 * @param {Object}
				 *            key 主键
				 * @param {Object}
				 *            value 对象
				 * 
				 */
				insert : function(p_startIndex, key, value) {
					this._array.splice(p_startIndex, 0, value);
					this._keys.splice(p_startIndex, 0, key);
					this._map[key] = value;
				},
				/**
				 * 清除对象
				 */
				clear : function() {
					// 数据对象复位
					this._keys = [];
					this._map = {};
					this._array = [];
				},
				/**
				 * 获取全部的Key
				 */
				getKeys : function() {
					return this._keys;
				},
				/**
				 * 获取全部Values对象
				 */
				getValues : function() {
					return this._array;
				},
				/**
				 * 遍历Value元素
				 */
				each : function(fn, scope) {
					var items = [].concat(this._array); // each safe for removal
					for (var i = 0, len = items.length; i < len; i++) {
						if (fn.call(scope || items[i], items[i], i, len) === false) {
							break;
						}
					}
				}
			});
})(jQuery);
/*
 * 定义全局变量
 * 
 * @type
 */
var smokiMap = $.smoki.Smokimap;

// 防止出现匿名代码段
//@ sourceURL=src/util/jquery.smoki.map.js
//# sourceURL=src/util/jquery.smoki.map.js
