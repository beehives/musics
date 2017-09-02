<template>
   <div class="music_list">
      <div class="back" @click="go">
          <i class="icon-back"><</i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
         <div class="play-wrapper">
            <div class="play" v-show="songs.length>0" ref="play" @click="randomPlay">
               <i class="icon-play"></i>
               <span class="text">随机播放</span>
            </div>
         </div>
         <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="layer">
      </div>
      <scroll @scroll="scroll" :data="songs" class="list" ref="list" :listenScroll="listenScroll" :probeType="probeType">
	      <div class="song-list-wrapper">
	         <song_list :rank="rank" @select="selectItem" :songs="songs" ></song_list>
	      </div>
        <div v-show="!songs.length">
          <loading></loading>
        </div>
      </scroll>
   </div>
</template>



<script>
import song_list from "../../base/song_list/song_list"
import scroll from "../../base/scroll/scroll"
import {mapActions} from "vuex"
import loading from "../../base/loading/loading"
import {playListMixin} from "../../common/js/mixin"

//设置一个常量为预留高度
const obligate_height=40

  export default{
    mixins:[playListMixin],
    data(){
      return{
         probeType:3,
         listenScroll:true,
         scrollY:0
      }
    },
    props:{
      title:{
        type:String,
        defualt:""
      },
      bgImage:{
        type:String,
        defualt:""
      },
      songs:{
        type:Array,
        default:[]
      },
      rank:{  //这里是排序的字段
        type:Boolean,
        default:false
      }
    },
    computed:{
       bgStyle(){
         return  `background-image:url(${this.bgImage})`;
       }
    },
    components:{
	    song_list,scroll,loading
    },
    mounted(){
         this.height=this.$refs.bgImage.clientHeight;   //获取到背景图的高度
         this.minTranslateY=-this.height+obligate_height;  //设置下滚动最小高度
	     this.$refs.list.$el.style.top=this.$refs.bgImage.clientHeight+'px'; //把滚动往下走一个背景图的高度
    },
    methods:{
      //这个是mixin里面的函数，相当于去重写里面的方法
      handlePlaylist(playlist){
         const bottom=playlist.length>0 ? "60px" : "";
         this.$refs.list.$el.style.bottom=bottom;
         this.$refs.list.refresh();
      },
      scroll(pos){
        this.scrollY=pos.y;
      },
      go(){
        this.$router.back();
        //路由回退
      },
      selectItem(item,index){
        //当点击音乐列表中的li时，子组件会派发一个事件select，然后调用该方法，index是组件的索引值,song
        //就能改组件获取的
        this.selectPlay({
          list:this.songs,
          index:index
        });
      },
      randomPlay(){
          //点击随机播放按钮，可以去dispatch一个action(randomPlayMusic)
          this.randomPlayMusic({
             list:this.songs
          });
      },
      ...mapActions([
         "selectPlay",
         "randomPlayMusic"
      ])
    },
    watch:{
      scrollY(newValue){
         //由于向上滚动是负数，所以找哪个最大，一开始先是newValue，后面就是一直是minTranslateY
         let translateY=Math.max(this.minTranslateY,newValue);
         let zIndex=0;
         let precent=Math.abs(newValue/this.height);
         let blur=0;
         let scale=1;
         if(newValue>0){
            scale=1+precent;
            zIndex=10;
         }else{
            blur=Math.min(20*precent,20);
         }
          
          //图片在往下拉的时候会有伸缩效果
         this.$refs.bgImage.style.transform=`scale(${scale})`;
         //手机端高斯模糊ios
         this.$refs.filter.style["webkitBackdrop-filter"]= `blur(${blur}px)`
         this.$refs.filter.style["backdrop-filter"]= `blur(${blur}px)`

         this.$refs.layer.style.transform=`translate3d(0,${translateY}px,0)`;
         //通过设置层级和高度来使图片，去遮住列表
         if(newValue<this.minTranslateY){
            zIndex=10;
            this.$refs.bgImage.style.paddingTop=0;
            this.$refs.bgImage.style.height=obligate_height+'px';
            this.$refs.play.style.display="none";
         }else{
             this.$refs.play.style.display="";
            this.$refs.bgImage.style.paddingTop="70%";
            this.$refs.bgImage.style.height=0;
         }
          this.$refs.bgImage.style.zIndex=zIndex;
         
      }
    }
  }

</script>

<style scoped>
.music_list{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background-color:#222;
}
.back{
  position:absolute;
  top:0;
  left:6px;
  z-index:50;
}
.back .icon-back{
  display:block;
  padding:10px;
  font-size:22px;
  color:#ffcd32;

}
.title{
  position:absolute;
  top:0;
  left:10%;
  z-index:40;
  width:80%;
  text-align:center;
  line-height:40px;
  text-overflow:ellipsis;
  overflow:hidden;
  white-space:nowrap;
  font-size:22px;
  color:#fff;
 }
 .bg-image{
	  position:relative;
	  width:100%;
	  height:0;
	  padding-top:70%;
	  transform-origin:top;
	  background-size:cover;   
 }
 .bg-layer{
      position:relative;
      height:100%;
      background:#333;
 }
 .list{
      position:fixed;
      top:0;
      bottom:0;
      width:100%;
      background:#333;
 }
 .song-list-wrapper{
   padding:20px 30px;
 }
 .filter{
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background: rgba(7, 17, 27, 0.4);
 }       
 .play-wrapper{
    position:absolute;
    bottom:20px;
    z-index:50;
    width:100%;
 }
 .play-wrapper .play{
      box-sizing:border-box;
      width:135px;
      padding:7px 0;
      margin:0 auto;
      text-align:center;
      border:1px solid #a74b03;
      color:#fff;
      border-radius:100px;
      font-size:0;
 }
 .icon-play{
    display:inline-block;
    vertical-align:middle;
    margin-right:10px;
    background-image:url("../../assets/bofang.png");
    font-size:14px;
    width:16px;
    height:16px;
    background-size:100%;
 }
 .text{
    display:inline-block;
    vertical-align:middle;
    font-size:14px;
 }          
       
    
        
        
     
    
</style>