/**
 * Created by sherfer on 2016/9/14.
 * this is the base of the whole plugin project
 * like smoki.base.js
 * like ext.util.observable.js
 */

(function ($, undefined) {

    var uuid = 0, slice = Array.prototype.slice, _cleanData = $.cleanData;

    $.uuid = function () {
        return uuid++
    };

    $.cleanData = function (elems) {
        for (var i = 0, elem; (elem = elems[i]) != null; i++) {
            try {
                $(elem).triggerHandler("remove");
                // http://bugs.jquery.com/ticket/8235
            } catch (e) {
            }
        }
        _cleanData(elems);
    };
    // jquery 1.9以后，$.browser取消了
    if (!$.browser) {
        var userAgent = navigator.userAgent.toLowerCase();
        $.browser = {
            version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [
                0, '0'])[1],
            safari: /webkit/.test(userAgent),
            opera: /opera/.test(userAgent),
            msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
            mozilla: /mozilla/.test(userAgent)
            && !/(compatible|webkit)/.test(userAgent)
        };
    }
    ;
    // jquery 1.10以后，$.support取消了
    $.support.boxModel = document.compatMode === "CSS1Compat";

    // widget:插件工厂 name:控件名，一般为：命名空间+"."+控件名，如smoki.button
    // base:基类，如果没有，默认从$.Widget集成 prototype:插件原型，一般为一个Json对象
    $.widget = function (name, base, prototype) {
        var fullName, existingConstructor, constructor, basePrototype,
            // proxiedPrototype allows the provided prototype to remain unmodified
            // so that it can be used as a mixin for multiple widgets (#8876)
            proxiedPrototype = {}, namespace = name.split(".")[0];
        // 插件名,如button
        name = name.split(".")[1];
        // 插件全称，smoki-button
        fullName = namespace + "-" + name;
        // 如果只有两个参数，base默认为$.Widget
        if (!prototype) {
            prototype = base;
            base = $.Base;
        }
        // create selector for plugin
        $.expr[":"][fullName.toLowerCase()] = function (elem) {
            return !!$.data(elem, fullName);
        };

        $[namespace] = $[namespace] || {};
        existingConstructor = $[namespace][name];
        constructor = $[namespace][name] = function (options, element) {
            // allow instantiation without "new" keyword
            // 当不存在_createWidget方法时，使用$[ namespace ][ name ]创建对象
            if (!this._createWidget) {
                return new constructor(options, element);
            }

            // options=base时，表示是通过语句basePrototype = new
            // base("base")执行，这时只是创建原型对象，
            // 不需要调用_createWidget方法
            if (options != "base") {
                this._createWidget(options, element);
            }
        };
        // extend with the existing constructor to carry over any static
        // properties
        $.extend(constructor, existingConstructor, {
            version: prototype.version,
            // copy the object used to create the prototype in case we
            // need to
            // redefine the widget later
            _proto: $.extend({}, prototype),
            // track widgets that inherit from this widget in case this
            // widget is
            // redefined after a widget inherits from it
            _childConstructors: []
        });

        // 原型为一个新的基类对象
        basePrototype = new base("base");
        // we need to make the options hash a property directly on the new
        // instance
        // otherwise we'll modify the options hash on the prototype that we're
        // inheriting from
        basePrototype.options = $.widget.extend({}, basePrototype.options);
        $.each(prototype, function (prop, value) {
            if (!$.isFunction(value)) {
                proxiedPrototype[prop] = value;
                return;
            }
            proxiedPrototype[prop] = (function () {
                var _super = function () {
                    return base.prototype[prop].apply(this, arguments);
                }, _superApply = function (args) {
                    return base.prototype[prop].apply(this, args);
                }, _superclass = function (args) {
                    return base.prototype;
                };
                return function () {
                    var __super = this._super, __superApply = this._superApply, __superclass = this._superclass, returnValue;

                    this._super = _super;
                    this._superApply = _superApply;
                    this._superclass = _superclass;

                    returnValue = value.apply(this, arguments);

                    this._super = __super;
                    this._superApply = __superApply;
                    this._superclass = __superclass;

                    return returnValue;
                };
            })();
        });
        constructor.prototype = $.widget.extend(basePrototype, {
            // TODO: remove support for widgetEventPrefix
            // always use the name + a colon as the prefix, e.g.,
            // draggable:start
            // don't prefix for widgets that aren't DOM-based
            widgetEventPrefix: existingConstructor
                ? basePrototype.widgetEventPrefix
                : name
        }, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        });

        // If this widget is being redefined then we need to find all widgets
        // that
        // are inheriting from it and redefine all of them so that they inherit
        // from
        // the new version of this widget. We're essentially trying to replace
        // one
        // level in the prototype chain.
        if (existingConstructor) {
            $.each(existingConstructor._childConstructors, function (i, child) {
                var childPrototype = child.prototype;

                // redefine the child widget using the same prototype
                // that was
                // originally used, but inherit from the new version of
                // the base
                $.widget(childPrototype.namespace + "."
                    + childPrototype.widgetName,
                    constructor, child._proto);
            });
            // remove the list of existing child constructors from the old
            // constructor
            // so the old child constructors can be garbage collected
            delete existingConstructor._childConstructors;
        } else {
            base._childConstructors.push(constructor);
        }

        $.widget.bridge(name, constructor);
    };

    $.widget.extend = function (target) {
        var input = slice.call(arguments, 1), inputIndex = 0, inputLength = input.length, key, value;
        for (; inputIndex < inputLength; inputIndex++) {
            for (key in input[inputIndex]) {
                value = input[inputIndex][key];
                if (input[inputIndex].hasOwnProperty(key)
                    && value !== undefined) {
                    // Clone objects
                    if ($.isPlainObject(value)) {
                        target[key] = $.isPlainObject(target[key]) ? $.widget
                            .extend({}, target[key], value) :
                            // Don't extend strings, arrays, etc. with
                            // objects
                            $.widget.extend({}, value);
                        // Copy everything else by reference
                    } else {
                        target[key] = value;
                    }
                }
            }
        }
        return target;
    };

    $.widget.bridge = function (name, object) {
        var fullName = object.prototype.widgetFullName || name;
        var namespace = fullName.split("-")[0];
        var _callback = function (options) {
            var isMethodCall = typeof options === "string", args = slice.call(
                arguments, 1), returnValue = this;

            // allow multiple hashes to be passed on init
            options = !isMethodCall && args.length ? $.widget.extend.apply(
                null, [options].concat(args)) : options;
            // options是一个方法
            if (isMethodCall) {
                this.each(function () {
                    var methodValue, instance = $.data(this, fullName);
                    if (!instance) {
                        return $.error("cannot call methods on " + name
                            + " prior to initialization; "
                            + "attempted to call method '" + options + "'");
                    }
                    if (!$.isFunction(instance[options])
                        || options.charAt(0) === "_") {
                        return $.error("no such method '" + options + "' for "
                            + name + " widget instance");
                    }
                    // 执行方法，如果方法没有返回值，返回false
                    methodValue = instance[options].apply(instance, args);
                    if (methodValue !== instance && methodValue !== undefined) {
                        returnValue = methodValue && methodValue.jquery
                            ? returnValue.pushStack(methodValue.get())
                            : methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function () {
                    // 如果不是方法，执行option方法进行赋值，
                    var instance = $.data(this, fullName);
                    if (instance) {
                        instance.option(options || {})._init();
                    } else {
                        $.data(this, fullName,
                            new object(options, this));
                    }
                });
            }

            return returnValue;
        };
        // 区分命名空间
        if (namespace === 'smoki' || namespace === 'portal') {
            $.fn[name] = _callback;
        } else if (namespace === 'desiginer') {
            $.fn[namespace] = $.fn[namespace] || function () {
                };
            $.fn[namespace][name] = _callback;
        }
    };

    /**
     * @class core.Base 插件基类 所有插件都继承直接或间接继承此类
     *
     */
    $.Base = function () {
    };// options, element

    $.Base._childConstructors = [];

    $.Base.prototype = {

        options: {

            /**
             * @event onCreate 创建事件
             * @param {}
             *            e 浏览器默认事件
             * @param {}
             *            args 由具体插件的_getCreateEventData()方法提供具体参数
             */
            onCreate: null
        },
        /**
         * 取得实例对象
         *
         * @return {Object}
         */
        getInstance: function () {
            var fullName = object.prototype.widgetFullName || name;
            return $.data(this, fullName);
        },
        /**
         * 增加绑定事件
         *
         * @param {String}
         *            types 事件类型，如click
         * @param {}
         *            selector jquery 元素选择器，通过代理方式绑定事件时需要提供
         * @param {}
         *            data
         * @param {}
         *            fn 事件处理函数
         */
        on: function (types, selector, data, fn, one) {
            // Types can be a map of types/handlers
            if (typeof types === "object") {
                // ( types-Object, selector, data )
                if (typeof selector !== "string") {
                    data = data || selector;
                    selector = undefined;
                }
                for (type in types) {
                    var _type = (type === this.widgetEventPrefix
                        ? type
                        : this.widgetEventPrefix + type).toLowerCase();
                    this.element.on(_type, selector, data, fn, one);
                }
                return this;
            } else {
                var _types = (types === this.widgetEventPrefix
                    ? types
                    : this.widgetEventPrefix + types).toLowerCase();
                return this.element.on(_types, selector, data, fn, one);
            }
        },
        /**
         * 解除绑定事件
         *
         * @param {String}
         *            types 事件类型，如click
         * @param {}
         *            selector jquery 元素选择器，通过代理方式绑定事件时需要提供
         * @param {}
         *            fn 事件处理函数
         */
        off: function (types, selector, fn) {
            if (typeof types === "object") {
                return this.element.off(types, selector, fn);
            } else {
                var _types = (types === this.widgetEventPrefix
                    ? types
                    : this.widgetEventPrefix + types).toLowerCase();
                return this.element.off(_types, selector, fn);
            }
        },
        _createWidget: function (options, element) {
            element = $(element || this.defaultElement || this)[0];
            this.element = $(element);
            this.uuid = uuid++;
            // 判断ID是否存在（如果是HTML元素）
            if (this.element[0].toString() === "[object HTMLDivElement]") {
                var _pre = this.ctype || 'widget';
                var id = this.element.attr('id');
                if (!$.fn.isDefined(id)) {
                    id = _pre + "_" + this.uuid;
                    this.element.attr('id', id);
                }
            }
            // 同一个元素，同一个插件只能初始化一次
            var plugs = this.element.attr("plugs");
            if (typeof(plugs) == "undefined") {
                plugs = "";
            }
            if ((plugs.indexOf(" " + this.widgetName) > -1)
                && (!this.element[0].isCt))
                return;
            plugs = plugs + " " + this.widgetName;
            this.element.attr("plugs", plugs);
            this.eventNamespace = "." + this.widgetName + this.uuid;
            var ops = this.options = $.widget.extend({}, this.options,this
                ._getCreateOptions() , options);
            this._create(element);
            this._init();
        },
        _getCreateOptions: $.noop,
        _getCreateEventData: $.noop,
        _create: function () {
            this._trigger("onCreate", null, this._getCreateEventData());
        },
        _init: $.noop,

        // 批量设置配置项参数
        _setOptions: function (options) {
            var key;
            for (key in options) {
                this._setOption(key, options[key]);
            }
            return this;
        },
        // 单个设置配置项参数
        _setOption: function (key, value) {
            this.options[key] = value;
        },

        /*
         * 延时执行方式 @param {} handler 方法体 @param {} delay 延时时间，单位为ms
         */
        _delay: function (handler, delay) {
            function handlerProxy() {
                return (typeof handler === "string"
                    ? instance[handler]
                    : handler).apply(instance, arguments);
            }

            var instance = this;
            return setTimeout(handlerProxy, delay || 0);
        },
        /*
         * 触发事件： @param {String} type 事件名称，如onCreate,onClick @param {} event
         * 浏览器事件参数，如果是dom的事件，传入dom的事件，否则传入null @param {} data
         * 事件中传递的数据，使用json对象传递，必须提供data.sender，为插件本身
         */
        _trigger: function (type, event, data) {
            var prop, orig, callback = this.options[type];

            data = data || {};
            event = $.Event(event);
            event.type = (type === this.widgetEventPrefix
                ? type
                : this.widgetEventPrefix + type).toLowerCase();
            // the original event may come from any element
            // so we need to reset the target on the new event
            if (this.element) {
                event.target = this.element[0];

                // copy original event properties over to the new event
                orig = event.originalEvent;
                if (orig) {
                    for (prop in orig) {
                        if (!(prop in event)) {
                            event[prop] = orig[prop];
                        }
                    }
                }
                this.element.trigger(event, data);
                return !($.isFunction(callback)
                && callback
                    .apply(this.element[0], [event].concat(data)) === false || event
                    .isDefaultPrevented());
            } else {
                return !($.isFunction(callback) && callback.apply(this, [event]
                    .concat(data)));
            }

        },
        _destroy: $.noop,
        /**
         * 插件销毁方法
         */
        destroy: function () {
            // 删除plugs标志
            if (this.element) {
                var plugs = this.element.attr("plugs");
                if (plugs) {
                    var reg = new RegExp(this.widgetName, "g");
                    var newPlugs = plugs.replace(reg, "");
                    this.element.attr("plugs", newPlugs);
                }
            }
            this._destroy();

        },
        /**
         * 获取或设置属性值，无参数时，返回options，不传入value时，获取key的值
         *
         * @param {String}
         *            key 要设置的参数名
         * @param {}
         *            value 要设置的参数值
         */
        option: function (key, value) {
            var options = key, parts, curOption, i;

            if (arguments.length === 0) {
                // don't return a reference to the internal hash
                return $.widget.extend({}, this.options);
            }
            if (typeof key === "string") {
                // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                options = {};
                parts = key.split(".");
                key = parts.shift();
                if (parts.length) {
                    curOption = options[key] = $.widget.extend({},
                        this.options[key]);
                    for (i = 0; i < parts.length - 1; i++) {
                        curOption[parts[i]] = curOption[parts[i]] || {};
                        curOption = curOption[parts[i]];
                    }
                    key = parts.pop();
                    if (value === undefined) {
                        return curOption[key] === undefined
                            ? null
                            : curOption[key];
                    }
                    curOption[key] = value;
                } else {
                    if (value === undefined) {
                        return this.options[key] === undefined
                            ? null
                            : this.options[key];
                    }
                    options[key] = value;
                }
            }
            this._setOptions(options);
            return this;
        },
        /**
         * 获取插件ID
         *
         * @return {String}
         */
        getId: function () {
            return this.options.id
                || (this.options.id = 'smoki-comp-' + (this.uuid));
        }
    };
})(jQuery);
