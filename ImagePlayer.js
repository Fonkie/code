/**
 * 图片播放器，只有两种常用效果切换：渐变，滑动
 * @author fonkie.c@gmail.com
 * @date 2012-7-11
 * @example：
    var p=$("#player1").ImagePlayer({auto:2000,size:1});
    p.go(2);//从第二张开始播放
 *
 */
(function ($, window) {
	  var ImagePlayer = function(ele,opt){
        var me=this;
		    me.ele = ele;
		    me.opt = $.extend({
            auto:0,  //auto=0，图片不自动播放；auto=n（n>0），图片在n毫秒后自动切换
			      size:1, //每页展示的图片数
            width:0,//每页图片（一张或多张）的宽度。width=0:自动计算每页展示图片的总宽度
			      disClass:'dis',//设置上一页,下一页不可用时的class
            onClass:'on',  //正在播放的图片所使用的class
            hideClass:"", //设置图片隐藏的class(如:noDis),默认使用hide()方法隐藏。
            effect:"",//opacity:图片进行渐变效果切换；scroll:图片进行向右滑动效果切换
            eType:"click" //设置触发切换图片方式（eType="mouseover":鼠标悬浮mouseover,eType="click":鼠标点击click)
		    },opt||{});
	  	  me.list = me.ele.find('[data-pager = list]');
        me.title = me.ele.find('[data-pager = title]');
		    me.next = me.ele.find('[data-pager = next]');
		    me.prev = me.ele.find('[data-pager = prev]');
        me.numList = me.ele.find('[data-pager = numList]');  //页码列表
        me.curNum = me.ele.find('[data-pager = curNum]'); // 显示当前页码
        me.totalNum = me.ele.find('[data-pager = totalNum]'); // 显示总页码
		    me.curpager = 1;
        me.isplaying=0;
        me.isStop=0;
		    me.totalsize = Math.ceil(me.list.children().size()/me.opt.size);

        me._init();
		    me._bindEvent();

	  }

	  ImagePlayer.prototype = {
        _init:function(){
            var me=this;
    
            //初始化渐变效果切换
            if(me.opt.effect!="scroll"){
                if(me.opt.hideClass){
                    me.list.children().addClass(me.opt.hideClass).slice(0,me.opt.size).removeClass(me.opt.hideClass);
                }else{
                    me.list.children().hide().slice(0,me.opt.size).show();
                }
            }
            me.title.children().hide().slice(0,me.opt.size).show();
    
            me.curNum.html(me.curpager);
            me.totalNum.html(me.totalsize);
    
            if(me.curpager==1){
                me.prev.addClass(me.opt.disClass);
            }
            if(me.curpager==me.totalsize){
                me.next.addClass(me.opt.disClass);
            }
    
            //初始化页码列表
            if(me.numList.length>0 ){
                var i=0,len=me.totalsize,per,tem;
                per=me.numList.children(":eq(0)");
                for(i=1;i<len;i++){
                    tem=per.clone().removeClass(me.opt.onClass);
                    if(tem.html()){tem.html(i+1);}
                    me.numList.append(tem);
                }
    
                me.numList.children().each(function(i){
                    var ele=$(this);
                    ele.bind(me.opt.eType,function(){
                        clearTimeout(me.timeEId);
                        me.timeEId=setTimeout(function(){
                            me.go(i+1);
                        },500);
                    });
                });
    
            }
    
            //初始化自动播放
            if(me.opt.auto){
                me.ele.mouseenter(function(){
                    me.isStop=1;
                }).mouseleave(function(){
                    me.isStop=0;
                });
                me._auto(me.opt.auto);
            }
    
        },
    
    		_bindEvent : function(){
    			  var me = this;
    			  me.next.click(function(){
    				    me._next();
    				    return false;
    			  });
    			  me.prev.click(function(){
    				    me._prev();
    				    return false;
    			  });
    		},
    
    		_next : function(){
            var me=this;
    			  if(!me.next.hasClass(me.opt.disClass)){
                var n=parseInt(me.curpager)+1;
                me.go(n);
    			  }
    		},
    
    		_prev : function(){
            var me=this;
    			  if(!me.prev.hasClass(me.opt.disClass)){
                var n=parseInt(me.curpager)-1;
                me.go(n);
    			  }
    		},
    
        _auto:function(time){
            var me=this;
            clearTimeout(me.timeId);
            me.timeId=setTimeout(function(){
                if(me.isStop){
                    me._auto(time);
                    return;
                }
                var n=me.curpager+1;
                n=n>me.totalsize?1:n;
                me.go(n,function(){
                    me._auto(time);
                });
            },time);
        },
    
        play:function(){
            var me=this;
            me.isStop=0;
            if(!me.opt.auto){
                me._auto(1000);
            }
        },
    
        stop:function(){
            var me=this;
            me.isStop=1;
        },
    
        go:function(num,fn){
    	      var me=this;
            if(num==me.curpager || me.isplaying==1){
                return;
            }
            me.isplaying=1;
    
            var distance,start=parseInt(me.list.css('text-indent'));
            distance=start+(me.curpager-num)*(me.opt.width?me.opt.width:me.ele.width());
    
            var items,len,sIndex,eIndex;
    
            items=me.list.children();
            len=items.size();
    
            sIndex=(num-1)*me.opt.size;
            eIndex=sIndex+me.opt.size;
            eIndex=eIndex>len?len:eIndex;
    
            me.title.children().hide().slice(sIndex,eIndex).show();
    
            switch(me.opt.effect){
                case "opacity":
                    //渐变切换，items是对象集，需要最后一个对象播放完毕之后才继续执行下一操作
                    items.animate({opacity:0.5},function(){
                        items.hide();
                        if(--len==0){
                            len=eIndex-sIndex;
                            items.slice(sIndex,eIndex).show().animate({opacity:1},function(){
                                if(--len==0){
                                    me._update(num,fn);
                                }
                            });
                        }
                    });
                    break;
                case "scroll":
                    me.list.animate({textIndent: distance+'px'}, "normal",null,function(){
                        me._update(num,fn);
                    });
                    break;
                default:
                    if(me.opt.hideClass){
                        items.addClass(me.opt.hideClass).slice(sIndex,eIndex).removeClass(me.opt.hideClass);
                    }else{
                        items.hide().slice(sIndex,eIndex).show();
                    }
                    me._update(num,fn);
            }
        },
    
        //更新列表翻页控制器的状态
        _update:function(num,fn){
            var me=this;
            me.curpager = num;
            //更新当前页码数字状态
            me.curNum.html(num);
    
            //更新页码列表当前页码状态
            me.numList.children().removeClass(me.opt.onClass);
            me.numList.children(":eq("+(num-1)+")").addClass(me.opt.onClass);
    
            if(num==1){
                me.prev.addClass(me.opt.disClass);
            }
    
            if(num>1){
                me.prev.removeClass(me.opt.disClass);
            }
    
            if(num < me.totalsize){
                me.next.removeClass(me.opt.disClass);
            }
    
            if(num==me.totalsize){
                me.next.addClass(me.opt.disClass);
            }
    
            if(typeof(fn)=="function"){
                fn(num);
            }
            me.isplaying=0;
    
        }
	  };
	
	  $.fn.ImagePlayer = function(options) {
        return $(this).each(function(){
            $(this).removeData("ImagePlayer").data("ImagePlayer", new ImagePlayer(this, options));
        });
    };
	
}(jQuery, window));
