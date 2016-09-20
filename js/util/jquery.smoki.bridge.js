/**
 * @class util.bridge 扩展jquery的一些内置方法，此类中的所有方法可以通过 $.fn.XXX 进行调用
 */
(function($) {
	/**
	 * 判断某个元素是否是另一个元素的子元素
	 */
	$.fn.highestZindex = 0;
	$.fn.within = function(e, el) {
		if (el) {
			var t = e.target;
			return t && ($(el).get(0).contains(t));
		}
		return false;
	};
	/**
	 * 属性复制
	 */
	$.fn.apply = function(o, c, defaults) {
		// no "this" reference for friendly out of scope calls
		if (defaults) {
			$.fn.apply(o, defaults);
		}
		if (o && c && typeof c == 'object') {
			for (var p in c) {
				o[p] = c[p];
			}
		}
		return o;
	};
	/**
	 * 追加属性
	 */
	$.fn.applyIf = function(o, c) {
		if (o) {
			for (var p in c) {
				if (!$.fn.isDefined(o[p])) {
					o[p] = c[p];
				}
			}
		}
		return o;
	}
	/**
	 * 过滤正则表达式中特殊的字符串
	 */
	$.fn.escapeRe = function(s) {
		return s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
	};
	/**
	 * 是否数字
	 */
	$.fn.isNumber = function(v) {
		return typeof v === 'number' && isFinite(v);
	};
	/**
	 * 格式化成数字
	 */
	$.fn.num = function(v, defaultValue) {
		v = Number($.fn.isEmpty(v) || $.isArray(v) || typeof v == 'boolean'
				|| (typeof v == 'string' && v.trim().length == 0) ? NaN : v);
		return isNaN(v) ? defaultValue : v;
	};
	/**
	 * 是否为空
	 */
	$.fn.isEmpty = function(v, allowBlank) {
		return v === null || v === undefined || (($.isArray(v) && !v.length))
				|| (!allowBlank ? v === '' : false);
	};
	/**
	 * 取得值
	 */
	$.fn.value = function(v, defaultValue, allowBlank) {
		return $.fn.isEmpty(v, allowBlank) ? defaultValue : v;
	};
	/**
	 * 是否定义过
	 */
	$.fn.isDefined = function(v) {
		return typeof v !== 'undefined';
	};
	$.fn.isPrimitive = function(v) {
		return $.fn.isString(v) || $.fn.isNumber(v) || $.fn.isBoolean(v);
	};
	$.fn.isString = function(v) {
		return typeof v === 'string';
	};
	$.fn.isBoolean = function(v) {
		return typeof v === 'boolean';
	};
	/**
	 * 延时函数
	 */
	$.fn.delayedTask = function(fn, scope, args) {
		/**
		 * 创建对象
		 */
		var me = this, id, call = function() {
			clearInterval(id);
			id = null;
			fn.apply(scope, args || []);
		};
		/**
		 * 延时执行
		 */
		me.delay = function(delay, newFn, newScope, newArgs) {
			me.cancel();
			fn = newFn || fn;
			scope = newScope || scope;
			args = newArgs || args;
			id = setInterval(call, delay);
		};
		/**
		 * 取消执行
		 */
		me.cancel = function() {
			if (id) {
				clearInterval(id);
				id = null;
			}
		};
	};
	/**
	 * 格式化字符串（钱币和百分比专用）
	 */
	$.fn.numberFieldFormatHandler = function(v, alwaysShowCents, numberDelim,
			decimalPrecision, prefixChar, suffixChar) {
		if ($.fn.isEmpty(v))
			return '';
		v = String(v);
		var vSplit = v.split('.');
		var cents = (vSplit[1]) ? '.' + vSplit[1] : '';
		if (alwaysShowCents && cents == '')
			cents = '.00';
		if (numberDelim && decimalPrecision) {
			var negative = false;
			var numbers = vSplit[0].split('') || [];
			var c = 0;
			if (numbers[0] == '-') {
				negative = true;
				numbers.removeAt(0);
			}
			var sNumbers = [];
			while (numbers.length > 0) {
				c++;
				if (c > decimalPrecision)
					c = 1;
				sNumbers.unshift(numbers.pop());
				if (c == decimalPrecision && numbers.length > 0)
					sNumbers.unshift(numberDelim);
			}
			if (negative)
				v = "-" + sNumbers.join('') + cents;
			else
				v = sNumbers.join('') + cents;
		} else {
			v = vSplit[0] + cents;
		}
		if (prefixChar)
			v = prefixChar + String(v);
		if (suffixChar)
			v = String(v) + suffixChar;
		return v;
	};
	/**
	 * 函数拦截方法
	 */
	Function.prototype.createInterceptor = function(fcn, scope) {
		var method = this;
		return !$.isFunction(fcn) ? this : function() {
			var me = this, args = arguments;
			fcn.target = me;
			fcn.method = method;
			return (fcn.apply(scope || me || window, args) !== false) ? method
					.apply(me || window, args) : null;
		};
	};
	/**
	 * 函数回调方法
	 */
	Function.prototype.createCallback = function(/* args... */) {
		// make args available, in function below
		var args = arguments, method = this;
		return function() {
			return method.apply(window, args);
		};
	};
	/**
	 * 函数代理方法
	 */
	Function.prototype.createDelegate = function(obj, args, appendArgs) {
		var method = this;
		return function() {
			var callArgs = args || arguments;
			if (appendArgs === true) {
				callArgs = Array.prototype.slice.call(arguments, 0);
				callArgs = callArgs.concat(args);
			} else if ($.fn.isNumber(appendArgs)) {
				callArgs = Array.prototype.slice.call(arguments, 0);
				var applyArgs = [appendArgs, 0].concat(args);
				Array.prototype.splice.apply(callArgs, applyArgs);
			}
			return method.apply(obj || window, callArgs);
		};
	};
	/**
	 * 延时执行函数
	 */
	Function.prototype.defer = function(millis, obj, args, appendArgs) {
		var fn = this.createDelegate(obj, args, appendArgs);
		if (millis > 0) {
			return setTimeout(fn, millis);
		}
		fn();
		return 0;
	};
	/**
	 * 创建顺序执行的函数
	 */
	Function.prototype.createSequence = function(fcn, scope) {
		var method = this;
		return (typeof fcn != 'function') ? this : function() {
			var retval = method.apply(this || window, arguments);
			fcn.apply(scope || this || window, arguments);
			return retval;
		};
	}
}(jQuery));
// 防止出现匿名代码段
//@ sourceURL=src/util/jquery.f1.bridge.js
//# sourceURL=src/util/jquery.f1.bridge.js
