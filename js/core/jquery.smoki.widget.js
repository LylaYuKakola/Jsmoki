/**
 * Created by sherfer on 2016/9/14.
 * like f1.widget.js
 */
(function ($, undefined) {

    var uuid = 0, slice = Array.prototype.slice, _cleanData = $.cleanData;

    $.uuid = function () {
        return uuid++
    }

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

    /**
     * @class core.Widget 界面插件基类
     * @extends core.Base 所有需要处理界面元素的插件继承于此类
     *
     */
    $.widget("smoki.Widget", {
        widgetName: "widget",
        version: "0.5",
        widgetEventPrefix: "",
        /**
         * 是否渲染
         *
         * @type Boolean
         */
        rendered: false,
        /**
         * 是否销毁
         *
         * @type Boolean
         */
        isDestroyed: false,
        /**
         * 是否获得焦点
         *
         * @type Boolean
         */
        hasFocus: false,
        defaultElement: "<div>",
        options: {
            /**
             * @cfg {Boolean} disabled 是否禁止
             */
            disabled: false,
            /**
             * @cfg {Boolean} hidden 是否隐藏
             */
            hidden: false,
            /**
             * @cfg {String} hint 提示信息
             */
            hint: "",
            // 事件
            /**
             * @event onBeforeRender 渲染前事件
             */
            onBeforeRender: null,
            /**
             * @event onAfterRender 渲染后事件
             */
            onAfterRender: null,
            /**
             * @event onDisable 插件禁止时触发
             */
            onDisable: null,
            /**
             * @event onEnable 插件开启时触发
             */
            onEnable: null,
            /**
             * @event onShow 显示时触发
             */
            onShow: null,
            /**
             * @event onHide 隐藏时触发
             */
            onHide: null
        },
        /**
         * 加载插件机制
         */
        _loadPlugins: function () {
            var p = this.options;
            // 如果存在插件
            if (p.plugins) {
                if ($.isArray(p.plugins)) {
                    for (var i = 0, len = p.plugins.length; i < len; i++) {
                        p.plugins[i] = this._initPlugin(p.plugins[i]);
                    }
                } else {
                    p.plugins = this._initPlugin(p.plugins);
                }
            }
        },
        /**
         * 初始化插件
         */
        _initPlugin: function (p) {
            p.init(this);
            return p;
        },
        // 插件创建方法
        _create: function (element) {
            // 创建前事件
            this.bindings = $();
            this.hoverable = $();
            this.focusable = $();

            if (element !== this) {
                $.data(element, this.widgetFullName, this);
                this._on(true, this.element, {
                    remove: function (event) {
                        if (event.target === element) {
                            this.destroy();
                        }
                    }
                });
                this.document = $(element.style ?
                    // element within the document
                    element.ownerDocument
                    :
                    // element is window or document
                element.document || element);
                this.window = $(this.document[0].defaultView
                    || this.document[0].parentWindow);
            }
            this._super();
            if (!this.rendered) {
                // 初始化插件
                this._loadPlugins();
                // 如果没有父类容器，则父类容器默认为Body
                if (this.element.parent().length === 0) {
                    this.container = $("body");
                    $("body").append(this.element);
                } else {
                    this.container = this.element.parent()[0];
                }
                // 增加ID属性
                // 指定el对象,即插件的JQuery对象
                this.el = this.element;
                // 插件包装的dom元素
                this.dom = this.element[0];
                var args = {
                    sender: this
                };
                // debugger
                // 触发渲染前事件
                this._trigger("onBeforeRender", null, args);
                // 调用子类渲染函数完成渲染
                this._render();
                // 渲染过
                this.rendered = true;
                // 触发渲染后事件
                this._trigger("onAfterRender", null, args);

            }
            // 存在提示信息
            if (this.options.hint) {
                this.el.powerFloat({
                    showDelay: 200,
                    hoverHold: false,
                    targetMode: "remind",
                    target: this.options.hint
                });
            }
            // 初始化事件
            this._initEvents();

            // 注册组件
            SmokiWidgetMgr.register(this);
        },
        // 渲染函数，子类需要覆盖
        _render: function () {

        },
        // 渲染后调用
        _init: function () {
            // 是否隐藏
            if (this.options.hidden) {
                this.hide();
            }
            // 是否禁用
            if (!this.options.disabled) {
                this.enable();
            } else {
                this.disable();
            }
        },

        _setDisabled: $.noop,
        // 插件绑定事件
        _initEvents: function () {
        },
        /**
         * 插件销毁事件
         */
        destroy: function () {
            // 注销组件
            SmokiWidgetMgr.unregister(this);
            // 调用父类方法
            this._super();
            // we can probably remove the unbind calls in 2.0
            // all event bindings should go through this._on()
            this.element
                .unbind(this.eventNamespace)
                // 1.9 BC for #7810
                // TODO remove dual storage
                .removeData(this.widgetName)
                .removeData(this.widgetFullName);

            this.widget().unbind(this.eventNamespace)
                .removeAttr("aria-disabled")
                .removeClass(this.widgetFullName + "-disabled "
                    + "ui-state-disabled");
            // clean up events and states
            this.bindings.unbind(this.eventNamespace);
            this.hoverable.removeClass("ui-state-hover");
            this.focusable.removeClass("ui-state-focus");
            this.isDestroyed = true;
        },
        /**
         * 获取插件的jquery对象
         *
         * @return {Object}
         */
        widget: function () {
            return this.element;
        },
        /**
         * 显示插件
         */
        show: function () {
            this._setOption("hidden", false);
            var args = {
                sender: this
            };
            this.element.show();
            this._trigger('onShow', null, args);
        },
        /**
         * 隐藏插件
         */
        hide: function () {
            this._setOption("hidden", true);
            var args = {
                sender: this
            };
            this.element.hide();
            this._trigger('onHide', null, args);
        },
        /**
         * 插件使能
         */
        enable: function () {
            this.options.disabled = false;
            this._setDisabled(false);
            // this._setOption("disabled", false );

            var args = {
                sender: this
            };
            this._trigger('onEnable', null, args);
        },
        /**
         * 插件禁止
         */
        disable: function () {
            this.options.disabled = true;
            this._setDisabled(true);
            // this._setOption("disabled", true );
            var args = {
                sender: this
            };
            this._trigger('onDisable', null, args);
        },

        _on: function (suppressDisabledCheck, element, handlers) {
            var delegateElement, instance = this;

            // no suppressDisabledCheck flag, shuffle arguments
            if (typeof suppressDisabledCheck !== "boolean") {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = false;
            }

            // no element argument, shuffle and use this.element
            if (!handlers) {
                handlers = element;
                element = this.element;
                delegateElement = this.widget();
            } else {
                // accept selectors, DOM elements
                element = delegateElement = $(element);
                this.bindings = this.bindings.add(element);
            }

            $.each(handlers, function (event, handler) {
                function handlerProxy() {
                    // allow widgets to customize the disabled handling
                    // - disabled as an array instead of boolean
                    // - disabled class as method for disabling individual parts
                    if (!suppressDisabledCheck
                        && (instance.options.disabled === true || $(this)
                            .hasClass("ui-state-disabled"))) {
                        return;
                    }
                    return (typeof handler === "string"
                        ? instance[handler]
                        : handler).apply(instance, arguments);
                }

                // copy the guid so direct unbinding works
                if (typeof handler !== "string") {
                    handlerProxy.guid = handler.guid = handler.guid
                        || handlerProxy.guid || $.guid++;
                }

                var match = event.match(/^(\w+)\s*(.*)$/), eventName = match[1]
                    + instance.eventNamespace, selector = match[2];
                if (selector) {
                    delegateElement.delegate(selector, eventName, handlerProxy);
                } else {
                    element.bind(eventName, handlerProxy);
                }
            });
        },

        _off: function (element, eventName) {
            eventName = (eventName || "").split(" ").join(this.eventNamespace
                    + " ")
                + this.eventNamespace;
            element.unbind(eventName).undelegate(eventName);
        },

        _hoverable: function (element) {
            this.hoverable = this.hoverable.add(element);
            this._on(element, {
                mouseenter: function (event) {
                    $(event.currentTarget).addClass("ui-state-hover");
                },
                mouseleave: function (event) {
                    $(event.currentTarget)
                        .removeClass("ui-state-hover");
                }
            });
        },
        _focusable: function (element) {
            this.focusable = this.focusable.add(element);
            this._on(element, {
                focusin: function (event) {
                    $(event.currentTarget).addClass("ui-state-focus");
                },
                focusout: function (event) {
                    $(event.currentTarget)
                        .removeClass("ui-state-focus");
                }
            });
        },
        /*
         * 私有方法，设置属性值， @param {} key 属性名称 @param {} value 属性值
         */
        _setOption: function (key, value) {
            this.options[key] = value;

            if (key === "disabled") {
                this.widget().toggleClass(
                    this.widgetFullName + "-disabled ui-state-disabled",
                    !!value).attr("aria-disabled", value);
                this.hoverable.removeClass("ui-state-hover");
                this.focusable.removeClass("ui-state-focus");
            }
            return this;
        }
    });

    $.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function (method, defaultEffect) {
        $.Base.prototype["_" + method] = function (element, options,
                                                   callback) {
            if (typeof options === "string") {
                options = {
                    effect: options
                };
            }
            var hasOptions, effectName = !options
                ? method
                : options === true || typeof options === "number"
                ? defaultEffect
                : options.effect || defaultEffect;
            options = options || {};
            if (typeof options === "number") {
                options = {
                    duration: options
                };
            }
            hasOptions = !$.isEmptyObject(options);
            options.complete = callback;
            if (options.delay) {
                element.delay(options.delay);
            }
            if (hasOptions && $.effects && $.effects.effect[effectName]) {
                element[method](options);
            } else if (effectName !== method && element[effectName]) {
                element[effectName](options.duration, options.easing,
                    callback);
            } else {
                element.queue(function (next) {
                    $(this)[method]();
                    if (callback) {
                        callback.call(element[0]);
                    }
                    next();
                });
            }
        };
    });

})(jQuery);

//@ sourceURL=jquery/src/core/jquery.smoki.widget.js
//# sourceURL=jquery/src/core/jquery.smoki.widget.js
