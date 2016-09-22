/**
 * Created by zhbr on 2016/9/18.
 * dialogjs 对话框控件
 * 请务必使用新的元素去调用dialog方法，并将新元素加入到body中
 * 比如说 var $a = $("<div></div>"); $a.dialog(); $(document.body).append($a);
 * 推荐使用已经编写好的方法，比如说$.fn.smokiDialog.alert()等等
 */

// smoki.importJS("js/core/jquery.smoki.widget.js");

(function ($) {
    /**
     * @class layout.accordion
     * @extends core.Widget 手风琴控件
     */
    $.widget("smoki.dialog", $.smoki.Widget, {
        options: {
            /**
             * 弹出框宽度，默认20%
             */
            width: '20%',
            /**
             * 弹出框高度，默认auto
             */
            height: 'auto',
            /**
             * dialog打开时的动画效果
             *
             * 'normal' 默认值，渐变显示
             * 'none' 没有动画效果
             * 'slide-left' 从左边侧滑
             * 'slide-right' 从右边侧滑
             * 'slide-top' 从上边侧滑
             * 'slide-bottom' 从下边侧滑
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
            animateTime: 250,
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
            maskColor: "#000",
            /**
             * 遮罩透明度
             */
            maskOpacity: 0.3,
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
                'height': p.height,
                'opacity': p.dialogOpacity,
                'background-color': p.dialogBgColor,
                'position': 'absolute',
                'z-index': $.fn.highestZindex + 2
            });
            if (p.isFixed) {
                $el.css('position', 'fixed');
            }
            if (p.isRadius) {
                $el.css('border-radius', p.borderRadius);
            }
            if (p.isCloseBtn) {
                $el.append("<a class = 'closeABtn icon-dark icon-fs16 icon-cross' id='dialog_closeBtn' href='javascript:void(0);'></a>")
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
            if (p.isMask) {
                var $mask = $("<div class='mask' id='dialog_mask'></div>");
                var bHeight = $(document.body).height() > $(window).height() ? $(document.body).width() : $(window).height(),
                    bWidth = $(document.body).width();
                $mask.css({
                    "z-index": $.fn.highestZindex + 1,
                    'height': bHeight + "px",
                    'width': bWidth + "px",
                    'opacity': p.maskOpacity,
                    'background-color': p.maskColor
                });
                $(document.body).append($mask);
            }
            if(!!p.content){
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
                    }).animate({
                        top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - (-24) ) + 'px',
                        opacity: 1
                    }, p.animateTime);
                    break;
                case 'slide-bottom' :
                    $el.css({
                        top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - (-32) ) + 'px',
                        display: "block",
                        opacity: 0
                    }).animate({
                        top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - 32) + 'px',
                        opacity: 1
                    }, p.animateTime);
                    break;
                case 'slide-left' :
                    $el.css({
                        left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - 24) + 'px',
                        display: "block",
                        opacity: 0
                    }).animate({
                        left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - (-24)) + 'px',
                        opacity: 1
                    }, p.animateTime);
                    break;
                case 'slide-right' :
                    $el.css({
                        left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - (-32) ) + 'px',
                        display: "block",
                        opacity: 0
                    }).animate({
                        left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - 32) + 'px',
                        opacity: 1
                    }, p.animateTime);
                    break;
            }
            $('#dialog_closeBtn').bind("click.dialog" , function (event) {
                event.preventDefault();
                switch(p.closeAnimateType){
                    case "none" :
                        break;
                    case "normal" :
                        $el.fadeOut(p.animateTime, function () {
                            $el.remove();
                            $("#dialog_mask").remove();
                        });
                        break;
                    case "slide-top" :
                        $el.animate({
                            top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - 24) + 'px',
                            opacity: 0
                        }, p.animateTime , function () {
                            $el.remove();
                            $("#dialog_mask").remove();
                        });
                        break;
                    case "slide-bottom":
                        $el.animate({
                            top: ($el.css('top').substring(0, $el.css('top').indexOf('px')) - (-24)) + 'px',
                            opacity: 0
                        }, p.animateTime, function () {
                            $el.remove();
                            $("#dialog_mask").remove();
                        });
                        break;
                    case "slide-left":
                        $el.animate({
                            left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - 32) + 'px',
                            opacity: 0
                        }, p.animateTime, function () {
                            $el.remove();
                            $("#dialog_mask").remove();
                        });
                        break;
                    case "slide-right" :
                        $el.animate({
                            left: ($el.css('left').substring(0, $el.css('left').indexOf('px')) - (-32)) + 'px',
                            opacity: 0
                        }, p.animateTime, function () {
                            $el.remove();
                            $("#dialog_mask").remove();
                        });
                        break;
                }
            });
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
            $box.dialog($.extend(true, {}, {
                isCloseBtn: true,
                isMask: true,
                height: '200px',
                openAnimateType: 'slide-left',
                closeAnimateType : 'slide-right',
                animateTime : 400,
                content: "<p style='line-height:200px; text-align: center;'>" + msg + "</p>"
            }, opt));
            $(document.body).append($box)
        },

        /**
         * @function 回答框，根据用户输入的信息判断正误（可用来登录和修改密码等等）
         * @param content 使用者传入的html代码
         * @param opt 配置项
         * @param falseCallback 点击确定的时候返回false时的执行函数，此时默认会有一个动画效果（不可关）然后继续显示弹窗
         * @param trueCallback 点击确定的时候返回true时的执行函数，默认会关闭弹窗
         */
        answer: function (content , opt, falseCallback, trueCallback) {
            var $box = $("<div></div>");
            var $container = $("<div></div>")
            debugger;
            $container.appendTo($box).addClass('dialog_container').html(content);
            var $btnContainer = $("<div></div>");
            var $yesBtn = $("<button>确认</button>");
            $yesBtn.appendTo($btnContainer).addClass("dialog_yesBtn");
            $btnContainer.appendTo($box).addClass('dialog_btnContainer');
            $box.dialog($.extend(true, {}, {
                isCloseBtn: true,
                isMask: true,
                openAnimateType: 'slide-left',
                closeAnimateType : 'slide-right',
                animateTime : 400
            }, opt));
            $(document.body).append($box)
        }
    };





})(jQuery);