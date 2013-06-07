var Viewer={

    getTopHeight:function(){
        return {
            pTop:window.pageYOffset || document.documentElement.scrollTop,
            pHeight:window.innerHeight || document.documentElement.clientHeight
        }
    },

    /**
   * 判断元素是否在可视区域（或者指定区域）内，是则执行回调
	 * @param ele
	 * @param options {iScreens:2,pTop:100,pHeight:200，handle:function(){}}
	 */
    inViewPort:function(ele,options){
        var me=this,
            iScreens=1,//1=当前屏;2=下一屏
            pTop = options.pTop,//scrollTop
            pHeight=options.pHeight,//clientHeight
            pBottom;

        if(options.iScreens){
           iScreens=options.iScreens;
        }

        if(!pTop){
           pTop =me.getTopHeight().pTop;
        }

        if(!pHeight){
            pHeight=me.getTopHeight().pHeight;
        }

        pBottom=pTop + pHeight*iScreens;

        var fn=function(){
            if(typeof(options.handle)=="function"){
                 options.handle();
            }
        };

        if(ele.getBoundingClientRect){
            var eleTop = ele.getBoundingClientRect().top + pTop,
                eleBottom = eleTop + ele.clientHeight;
            //可视区域范围(eleTop > pTop && eleTop < pBottom) && (eleBottom > pTop && eleBottom < pBottom)
            //浏览过的视图范围 eleTop>=0 && pBottom-eleBottom>=0
            if((eleTop > pTop && eleTop < pBottom) && (eleBottom > pTop && eleBottom < pBottom)) {
                fn();
            }
        }else{
            fn();
        }
    }
};
