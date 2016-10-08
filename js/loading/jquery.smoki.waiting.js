/**
 * Created by sherfer on 2016/9/30.
 * for waiting
 * 加载等待
 * 覆盖调用生成方法的jquery对象。。。。
 * 所以使用的时候使用你要加载等待的块级元素进行调用，显示在改该元素中间
 * 遮罩自己生成吧
 * 如果时整个页面加载时使用，请使用$(document.body)去调用
 */

(function ($) {
    /**
     * @class waiting
     * @extends core.widget
     */
    $.widget("smoki.waiting", $.smoki.Widget, {
        options : {
            /**
             * 图标大小
             * 注意：只能设置单位为px的像素值
             * @type number
             */
            size: 32 ,
            /**
             * 等待时显示的内容
             */
            msg : '' ,
            /**
             * 图标及颜色
             */
            color : '#2255a4'
        },

        _render: function () {
            var g = this, p = g.options, el = g.el, $el = $(el);
            if(!isNaN(p.size)){
                var $container = $('<div></div>');
                var $mask = $('<div class="com-mask" id="waiting-mask"></div>');
                var $img = $('<li class="com-li-clean icon-spinner6 com-rotate"></li>');
                var $msg = $('<li class="com-li-clean">' + p.msg + '</li>');

                $el.append($mask).append($container);

                $mask.css({
                    'width' : '100%',
                    'height' : $el.height() + 'px',
                    'z-index' : $.fn.highestZindex + 1
                });

                $container.append($img).append($msg);

                $container.css({
                    'text-align' : 'center' ,
                    'z-index' : $.fn.highestZindex + 2 ,
                    'position' : 'absolute' ,
                    'left' : '0' ,
                    'right' : '0'
                });

                $img.css({
                    'color' : p.color,
                    'font-size' : p.size
                });

                $msg.css({

                });

            }else{
                console.error("您设置的size为非number类型数值，请修改")
            }
        }
    })


})(jQuery);


