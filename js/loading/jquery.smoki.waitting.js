/**
 * Created by sherfer on 2016/9/30.
 * for loading
 * 加载等待
 * 覆盖调用生成方法的jquery对象。。。。
 * 所以使用的时候使用你要加载等待的块级元素进行调用，显示在改该元素中间
 * 遮罩自己生成吧
 * 如果时整个页面加载时使用，请使用$(document.body)去调用
 */

(function ($) {
    /**
     * @class waitting
     * @extends core.widget
     */
    $.widget("smoki.waitting", $.smoki.Widget, {
        options : {
            /**
             * 图标大小
             * 注意：只能设置单位为px的像素值
             */
            size: 16 ,
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
                var height = $el.height() < p.size? p.size: $el.height();
                var width = $el.width() < p.size-(-100) ? p.size-(-100) : $el.width();
                
            }
        }
    })


})(jQuery);


