/**
 * Created by sherfer on 2016/9/18.
 * dialogjs 对话框控件
 * 请务必使用新的元素去调用dialog方法，并将新元素加入到body中
 * 比如说 var $a = $("<div></div>"); $a.dialog(); $(document.body).append($a);
 * 推荐使用已经编写好的方法，比如说$.fn.smokiDialog.alert()等等
 */

// smoki.importJS("js/core/jquery.smoki.widget.js");

(function ($) {
    /**
     * @class dialog
     * @extends core.Widget 弹框
     */
    $.widget("smoki.dialog", $.smoki.Widget, {
        options: {
            /**
             * 弹出框宽度，默认20%
             *
             * @type string(css的width属性)
             */
            width: '20%',
            /**
             * 弹出框最小宽度，默认20%
             *
             * @type string(css的width属性)
             */
            minWidth: '20%',
            /**
             * 弹出框最大宽度，默认20%
             *
             * @type string(css的width属性)
             */
            maxWidth: '100%',
            /**
             * 弹出框高度，默认auto
             *
             * @type string(css的height属性)
             */
            height: 'auto',
            /**
             * 阴影设置
             * 为‘none’的时候没有阴影
             *
             * @type string(css的box-shadow属性)
             */
            boxShadow: '0 0 15px black',
            /**
             * dialog打开时的动画效果
             *
             * 'normal' 默认值，渐变显示
             * 'none' 没有动画效果
             * 'slide-left' 从左边侧滑
             * 'slide-right' 从右边侧滑
             * 'slide-top' 从上边侧滑
             * 'slide-bottom' 从下边侧滑
             *
             * @type string
             */
            openAnimateType: "normal",
            /**
             * dialog关闭时的动画效果
             *
             * 同上
             */
            closeAnimateType: "normal",
            /**
             * 动画执行的毫秒数
             */
            animateTime: 100,
            /**
             * dialog是否有关闭键
             */
            isCloseBtn: true,
            /**
             * 是否支持快速关闭（点击dialog之外的情况下会关闭dialog， 仅当isMask为true是可以使用）
             */
            isQuickClose: false,
            /**
             * dialog的内容（为html结构的字符串）
             */
            content: null,
            /**
             * dialog的背景颜色
             * （支持"#000" 和 rgba(0，0，0，0.3)两种格式，但是为了IE，推荐第一种方式）
             */
            dialogBgColor: '#fff',
            /**
             * dialog的透明度
             */
            dialogOpacity: 1,
            /**
             * 是否添加遮罩（添加遮罩可以在dialog弹出时，阻止用户点击dialog以外的元素）
             */
            isMask: false,
            /**
             * 遮罩颜色
             */
            maskColor: "rgba(55, 58, 71, 1)",
            /**
             * 遮罩透明度
             */
            maskOpacity: 0.7,
            /**
             * dialog是否圆角
             */
            isRadius: false,
            /**
             * 圆角设置（仅当isRadius为true时有效）
             */
            borderRadius: '5px, 5px, 5px, 5px',
            /**
             * 是否固定位置
             */
            isFixed: false,

            /**
             * event
             * dialog关闭前（返回false则阻止关闭动作的执行）
             */
            onBeforeClose: null,
            /**
             * event
             * dialog关闭
             */
            onClose: null,
            /**
             * event
             * dialog关闭后
             */
            onAfterClose: null

        },

        _render: function () {
            var g = this, p = g.options, el = g.el, $el = $(el);
            $el.css({
                'width': p.width,
                'min-width': p.minWidth,
                'max-width': p.maxWidth,
                'height': p.height,
                'opacity': p.dialogOpacity,
                'background-color': p.dialogBgColor,
                'position': 'absolute',
                'z-index': $.fn.highestZindex + 2,
                'box-shadow': p.boxShadow
            });
            if (p.isFixed) {
                $el.css('position', 'fixed');
            }
            if (p.isRadius) {
                $el.css('border-radius', p.borderRadius);
            }
            if (p.isCloseBtn) {
                $el.append("<a class = 'closeABtn icon-red icon-fs16 icon-cross' id='dialog_closeBtn' href='javascript:void(0);'></a>")
            }
            g.resizeDialog();
            g.showDialog();
        },

        resizeDialog: function () {
            var g = this, p = g.options, el = g.el, $el = $(el);
            var wHeight = $(window).height(),
                wWidth = $(window).width(),
                eWidht = el.width(),
                eHeight = el.height();
            $el.css({
                left: (wWidth - eWidht) / 2 + "px",
                top: (wHeight - eHeight) / 2 + "px"
            })
        },

        showDialog: function () {
            var g = this, p = g.options, el = g.el, $el = $(el);
            var $mask = null;
            if (p.isMask) {
                $mask = $("<div class='com-mask' id='dialog_mask'></div>");
                var bHeight = $(document.body).height() > $(window).height() ? $(document.body).width() : $(window).height();
                $mask.css({
                    "z-index": $.fn.highestZindex + 1,
                    'height': bHeight + "px",
                    'width': '100%',
                    'opacity': 0,
                    'background-color': p.maskColor
                });
                $(document.body).append($mask);
                if(p.isQuickClose){
                    $mask.bind("click" , function () {
                        g.closeDialog();
                    })
                }
            }
            if (!!p.content) {
                $el.html($el.html() + p.content);
            }
            switch (p.openAnimateType) {
                case 'none':
                    $el.css('display', 'block');
                    break;
                case 'normal':
                    $el.fadeIn(p.animateTime);
                    break;
                case 'slide-top':
                    $el.css({
                        top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - 24 ) + 'px',
                        display: "block",
                        opacity: 0
                    });
                    setTimeout(function () {
                        $el.animate({
                            top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - (-24) ) + 'px',
                            opacity: 1
                        }, p.animateTime)
                    }, 10);
                    setTimeout(function () {
                        $mask.animate({
                            opacity: p.maskOpacity
                        }, p.animateTime)
                    }, 9);
                    break;
                case 'slide-bottom' :
                    $el.css({
                        top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - (-32) ) + 'px',
                        display: "block",
                        opacity: 0
                    });
                    setTimeout(function () {
                        $el.animate({
                            top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - 32) + 'px',
                            opacity: 1
                        }, p.animateTime);
                    }, 10);
                    setTimeout(function () {
                        $mask.animate({
                            opacity: p.maskOpacity
                        }, p.animateTime)
                    }, 9);
                    break;
                case 'slide-left' :
                    $el.css({
                        left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - 24) + 'px',
                        display: "block",
                        opacity: 0
                    });
                    setTimeout(function () {
                        $el.animate({
                            left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - (-24)) + 'px',
                            opacity: 1
                        }, p.animateTime);
                    }, 10);
                    setTimeout(function () {
                        $mask.animate({
                            opacity: p.maskOpacity
                        }, p.animateTime)
                    }, 9);
                    break;
                case 'slide-right' :
                    $el.css({
                        left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - (-32) ) + 'px',
                        display: "block",
                        opacity: 0
                    });
                    setTimeout(function () {
                        $el.animate({
                            left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - 32) + 'px',
                            opacity: 1
                        }, p.animateTime)
                    }, 10);
                    setTimeout(function () {
                        $mask.animate({
                            opacity: p.maskOpacity
                        }, p.animateTime)
                    }, 9);
                    break;
            }
            $('#dialog_closeBtn').bind("click.dialog", function (event) {
                event.preventDefault();
                g.closeDialog();
            });
        },

        closeDialog: function () {
            var g = this, p = g.options, el = g.el, $el = $(el);
            switch (p.closeAnimateType) {
                case "none" :
                    $el.remove();
                    $('#dialog_mask').remove();
                    break;
                case "normal" :
                    $el.fadeOut(p.animateTime, function () {
                        $el.remove();
                        $("#dialog_mask").remove();
                    });
                    break;
                case "slide-top" :
                    setTimeout(function () {
                        $el.animate({
                            top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - 24) + 'px',
                            opacity: 0
                        }, p.animateTime, function () {
                            $el.remove();
                            $("#dialog_mask").remove();
                        });
                    }, 10);
                    setTimeout(function () {
                        $("#dialog_mask").animate({
                            opacity: 0
                        })
                    }, 9);
                    break;
                case "slide-bottom":
                    setTimeout(function () {
                        $el.animate({
                            top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - (-24)) + 'px',
                            opacity: 0
                        }, p.animateTime, function () {
                            $el.remove();
                            $("#dialog_mask").remove();
                        });
                    }, 10);
                    setTimeout(function () {
                        $("#dialog_mask").animate({
                            opacity: 0
                        })
                    }, 9);
                    break;
                case "slide-left":
                    setTimeout(function () {
                        $el.animate({
                            left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - 32) + 'px',
                            opacity: 0
                        }, p.animateTime, function () {
                            $el.remove();
                            $("#dialog_mask").remove();
                        });
                    }, 10);
                    setTimeout(function () {
                        $("#dialog_mask").animate({
                            opacity: 0
                        })
                    }, 9);
                    break;
                case "slide-right" :
                    setTimeout(function () {
                        $el.animate({
                            left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - (-32)) + 'px',
                            opacity: 0
                        }, p.animateTime, function () {
                            $el.remove();
                            $("#dialog_mask").remove();
                        });
                    }, 10);
                    setTimeout(function () {
                        $("#dialog_mask").animate({
                            opacity: 0
                        })
                    }, 9);
                    break;
                default:
                    $el.remove();
                    $("#dialog_mask").remove();
                    break;
            }
        }
    });


    //定义几个自己的dialog

    /**
     * @type {{alert: jQuery.smokiDialog.alert}}
     */
    $.fn.smokiDialog = {

        /**
         * @function 警告框，只支持显示文字
         * @param msg 要显示的文字
         * @param opt 修改的配置项
         */
        alert: function (msg, opt) {
            var $box = $("<div></div>");
            var g = $box.dialog($.extend(true, {}, {
                isCloseBtn: true,
                isMask: true,
                height: '200px',
                openAnimateType: 'slide-left',
                closeAnimateType: 'slide-right',
                animateTime: 150,
                content: "<p style='line-height:200px; text-align: center;'>" + msg + "</p>"
            }, opt));
            $(document.body).append($box)
        },

        /**
         * @function 回答框，根据用户输入的信息判断正误（可用来登录和修改密码等等）
         * @param content 使用者传入的html代码
         * @param opt 配置项
         * @param callback 点击确定的时候执行的函数
         *                 返回false的时候会执行错误动画并执行falseCallback函数
         *                 返回true的时候执行弹出框关闭并执行trueCallback函数
         */
        answer: function (content, opt, callback, falseCallback, trueCallback) {
            var $box = $("<div></div>");
            var $container = $("<div></div>");
            debugger;
            $container.appendTo($box).addClass('dialog_container').html(content);
            var $btnContainer = $("<div></div>");
            var $yesBtn = $("<button>确认</button>");
            $yesBtn.appendTo($btnContainer).addClass("dialog_yesBtn");
            $btnContainer.appendTo($box).addClass('dialog_btnContainer');
            var g= $box.dialog($.extend(true, {}, {
                isCloseBtn: true,
                width: 'auto',
                minWidth: '200px',
                isMask: true,
                openAnimateType: 'slide-left',
                closeAnimateType: 'slide-right',
                animateTime: 150
            }, opt));
            $(document.body).append($box);
            $yesBtn.bind('click.dialog', function () {
                if (!callback.call(this)) {
                    var btop = $box.css('top');
                    var bleft = $box.css('left');
                    $box.animate({
                        top: btop.substring(0, btop.lastIndexOf("px")) - (2) + "px",
                        left: bleft.substring(0, bleft.lastIndexOf("px")) - (2) + "px"
                    }, 50, function () {
                        $box.animate({
                            top: btop.substring(0, btop.lastIndexOf("px")) - (2) + "px",
                            left: bleft.substring(0, bleft.lastIndexOf("px")) - (-2) + "px"
                        }, 50, function () {
                            $box.animate({
                                top: btop.substring(0, btop.lastIndexOf("px")) - (-2) + "px",
                                left: bleft.substring(0, bleft.lastIndexOf("px")) - (2) + "px"
                            }, 50, function () {
                                $box.animate({
                                    top: btop.substring(0, btop.lastIndexOf("px")) - (-2) + "px",
                                    left: bleft.substring(0, bleft.lastIndexOf("px")) - (-2) + "px"
                                }, 50, function () {
                                    $box.animate({
                                        top: btop,
                                        left: bleft
                                    }, 50, function () {
                                        falseCallback.call(this)
                                    })
                                })
                            })
                        })
                    });
                } else {
                    $box.dialog("closeDialog");
                    trueCallback.call(this)
                }
            })
        },

        /**
         * @function 弹出新页面
         * 根据使用者传入的路径参数完成页面展示
         * 不能和主页面进行交互，如果有需求，请通过后台或者本地存储。
         * @param url iframe 路径（绝对相对）
         * @param opt 配置项
         */
        iframeDialog: function (url, opt) {
            var $iframe = $("<iframe></iframe>"),
                $box = $("<div></div>");

            $iframe[0].setAttribute("src", url);

            $iframe.css({
                'height': "100%",
                'width': "100%"
            });
            //$box.append($iframe);

            $box.dialog($.extend(true, {
                isCloseBtn: true,
                width: '80%',
                minWidth: '300px',
                isMask: true,
                openAnimateType: 'slide-left',
                closeAnimateType: 'slide-right',
                animateTime: 150,
                height: '600px'
            }, opt));

            $box.waiting({
                msg : 'just waiting'
            });
            $(document.body).append($box);
        },

        /**
         * @function tips 小提示
         * @param msg 显示的内容(内容不要太多)
         * @param showTime tips显示时间 (毫秒)
         * @param opt 配置项
         * 支持快速关闭
         */
        tips : function (msg , showTime, opt) {
            var $box = $("<div></div>");
            var g= $box.dialog($.extend(true, {}, {
                isCloseBtn: false,
                isMask: true,
                height: '100px',
                isQuickClose : true,
                openAnimateType: 'slide-left',
                closeAnimateType: 'slide-right',
                animateTime: 150,
                dialogBgColor : "rgba(202,228,182,0.6)",
                content: "<p style='line-height:100px; text-align: center; color: #c94e50 ;'><b>" + msg + "</b></p>"
            }, opt));
            $(document.body).append($box);
            setTimeout(function () {
                $box.dialog("closeDialog");
            }, showTime)
        }

    };


})(jQuery);