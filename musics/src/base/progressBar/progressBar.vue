<template>
   <div class="progress-bar" ref="progressBar" @click="clickChangePrecent">
       <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" 
                 @touchstart.prevent="progressTouchStart" 
                 @touchmove.prevent="progressTouchMove"
                 @touchend="progressTouchEnd"
                 >
               <div class="progress-btn" ref="progressBtn"></div>
            </div>
       </div>
   </div>
</template>




<script>
const BTNWIDTH=14;
export default{
	props:{
    precent:{
       type:Number,
       default:0
    }
  },
  created(){
    this.touch={};
  },
  methods:{
     progressTouchStart(e){
         //点击开始
         console.log(e);
         this.touch.inited=true;
         this.touch.startX=e.touches[0].pageX;
         this.touch.left=this.$refs.progress.clientWidth;        
     },
     progressTouchMove(e){
     //点击拖动
         if(!this.touch.inited){
          return ;
         }
         let detailX= e.touches[0].pageX-this.touch.startX;
         let offsetWidth= Math.min(this.$refs.progressBar.clientWidth - BTNWIDTH,Math.max(0,detailX+this.touch.left));
         this.offsetLeft(offsetWidth);
     },
     progressTouchEnd(){
     //点击结束
         this.touch.inited=false;
         this._toggleChangePrecent();
     },
     clickChangePrecent(e){
         console.log(e);
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this.offset(e.offsetX)
         let react=this.$refs.progressBar.getBoundingClientRect();
         let offsetLeft = e.pageX -react.left;
         this.offsetLeft(offsetLeft);
         this._toggleChangePrecent();
     },
     _toggleChangePrecent(){
        //这里是根据点击后progress的宽度去计算，当前的百分比，把去触发父组件的事件，并提供它参数precent
        let allWidth=this.$refs.progressBar.clientWidth - BTNWIDTH;
        let precent=this.$refs.progress.clientWidth/allWidth;
        this.$emit("changePrecent",precent);  
     },
     offsetLeft(offsetWidth){
           //这里是让按钮和进度走的函数
          this.$refs.progress.style.width = offsetWidth+'px';
          this.$refs.progressBtn.style.left=offsetWidth+"px";
     }
  },
  watch:{
    precent(newPrecent){
         if(newPrecent >=0 && !this.touch.inited){
          let allWidth=this.$refs.progressBar.clientWidth - BTNWIDTH;
          let offsetWidth=allWidth * newPrecent;
          this.offsetLeft(offsetWidth);
         }
    }
  }
}
</script>


<style scoped>
.progress-bar{
height:30px;
}
.bar-inner{
position:relative;
top:13px;
height:4px;
background-color: rgba(0, 0, 0, 0.3);
}
.progress{
position:absolute;
left:0px;
top:0px;	
width:30px;
height:4px;
background-color:#ffcd32;
}
.progress-btn{
position:relative;
top:-5px;
left:2px;
box-sizing:border-box;
width:14px;
height:14px;
border-radius:50%;
background-color:#ffcd32;
border:3px solid #fff;
}



</style>
