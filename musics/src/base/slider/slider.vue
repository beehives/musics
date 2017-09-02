<template>
   <div class="slider" ref="slider">
     <div class="sliderGroup" ref="sliderGroup">
        <slot>
        </slot>
     </div>
     <div class="dots">
        <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}">
        </span>
     </div>
   </div>
</template>


<script>
import Bscroll from "better-scroll"
import {addClass} from "../../common/js/dom"

export default{
	props:{
	   loop:{
	      type:Boolean,
	      default:true
	   },
	   autoPlay:{
	      type:Boolean,
	      default:true
	   },
	   interval:{
	      type:Number,
	      default:2000
	   }
	},
	data(){
	  return{
           currentPageIndex:0,
           child:[],
           dots:[]
	  }
	},
	mounted(){
	  setTimeout(()=>{
	    this.setWidth();
	    this.init_dot();
	    this.init();
      if(this.autoPlay){
         this.play();
      }
	  },20)

    window.addEventListener('resize',()=>{
       if(!this.slider){
         return;
       }
       this.setWidth(true);
       this.slider.refresh();
    });

	},
  destroy(){
    clearTimeout(this.timer);
  },
	methods:{

      //这个setWidth方法是初始化slidergroup的大小，若loop则是宽度则是(孩子节点数+2)*slider的宽度
      //this.refs.name 可以获取到有ref且名为name的节点
      //init_dot方法是初始化点，这里点跟sliderGroup中的子孩子节点数量有关
      // init()方法是初始化slider，这里用到better-scroll这个组件，这里需要是将图片左右滚动，若是loop绑定的
      // 对象的宽度必须是子孩子节点数+2,因为是加了后一个在最前，和多加了前一个在最后
      // 这里在滚动时，可以触发一个事件叫scrollEnd事件，绑定返回的对象可以通过getCurrentPage().pageX得到
      // 索引，若这里是Loop循环的话，则要-1,因为前面多加了一张最后的图片

     	setWidth(reset){
	         let groupWidth=0; 

            let width=this.$refs.slider.clientWidth;
            //获取到slider的宽度
            console.log(width)

            this.child=this.$refs.sliderGroup.children;
            //获取到sliderGroup中的子孩子节点，赋值给vm中child
            for(let i=0;i<this.child.length;i++){
                this.child[i].style.width=width+'px';
                addClass(this.child[i],"slider_item");
            }
            //这里是添加一个slider_item类，调用了dom.js中的addClass方法
            //如果是重新加载的话需要判断是否reset为true，因为这时的this.child.length已经多了两个
            groupWidth=width*this.child.length;
            if(this.loop && !reset){
              groupWidth=groupWidth+(2*width);
            }
            this.$refs.sliderGroup.style.width=groupWidth+"px";
            //给包裹图片的大层一个宽度
	   },
	   init_dot(){
	       this.dots=new Array(this.child.length);
	   },
	   init(){
           this.slider=new Bscroll(this.$refs.slider,{
            scrollX:true, //左右滚动
            scrollY:false, //上下滚动
            momentum:false, //缓存
            snap:true, //快速
            snapLoop:this.loop, //无缝
            snapThreshold:0.3,
            snapSpeed:400
           })
           this.slider.on("scrollEnd",()=>{
                let page=this.slider.getCurrentPage().pageX; //可以获取到当前索引值
                if(this.loop){      //若是无缝的话，则要减1,减去前面，这个组件添加的一张图片
                   page -=1;
                }  
                this.currentPageIndex=page;
                if(this.autoPlay){     //如果是自动播放，则调用play()方法，play则会动态去获取currenIndex
                   clearTimeout(this.timer);
                   this.play();
                }
           })
	   },
     play(){  //自动播放
          let pageIndex=this.currentPageIndex+1;
          if(this.loop){
              pageIndex++;
          }
          this.timer=setTimeout(()=>{
             this.slider.goToPage(pageIndex,0,400);  
          },this.interval);
     }
	}
}
</script>


<style scoped>
.slider{
	min-height:1px;

}
.sliderGroup{
	position:relative;
	overflow:hidden;
	white-space:nowrap;
}
 .slider_item{
	float:left;
	box-sizing:border-box;
	overflow:hidden;
	text-align:center;
}
.sliderGroup .slider_item a{
	display:block;
	width:100%;
	overflow:hidden;
	text-decoration:none;

}
.sliderGroup .slider_item img{
	display:"block";
	width:100%;
}
.dots{
	position:absolute;
	right:0;
	left:0;
	bottom:12px;
	text-align:center;
}
.dot{
    margin:0px 4px;
    display:inline-block;
    width:8px;
    height:8px;
	border-radius:50%;
	background-color:rgba(144,144,144,0.8);
}
.dots .active{
	background-color:#fff;
}
</style>