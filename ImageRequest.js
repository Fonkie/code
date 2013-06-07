var ImageRequest={
    arrImg:[],//用于工作的Image对象以及状态
    maxLength:4,//同时工作的Image对象最大个数
    taskQueue:[],//需要排队等候的任务
    send:function(url){

        //如果参数为空，则不处理
        if(typeof(url)=="undefined" || url=="") return;

        var me=this,img,imgHandler,arrImg,len=0,index=-1;

        arrImg=me.arrImg;
        len=arrImg.length;

        //查询可用的Image对象
        for(var i=0;i<len;i++){
            if(arrImg[i].f==0){
                index=i;
                break;
            }
        }

        //取出或者生成Image对象
        if(index==-1){
            if(len==me.maxLength){
                me.taskQueue.push(url);
                return ;
            }
            img=new Image();
            arrImg.push({f:1,img:img});
            index=(len==0?0:len);
        }else{
            img=arrImg[index].img;
        }

        //标记Image对象为正在使用状态
        arrImg[index].f=1;

        //记录所使用的Image对象的位置
        img.setAttribute("vid",index);

        imgHandler = function(){
            var vid=this.getAttribute("vid");
            if(vid>=0){
                arrImg[vid].f=0;
            }
            if(me.taskQueue.length>0){
                me.send(me.taskQueue.shift());
            }
        };
        img.onload=img.onerror=imgHandler;
        img.src=url;
    }
};
