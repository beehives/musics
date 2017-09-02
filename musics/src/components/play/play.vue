<template>
   <div class="player" v-show="playlist.length>0" >
      <transition name="noarmal" 
			      @enter="enter" 
			      @after-enter="afterEnter" 
			      @leave="leave"
			      @after-leave="afterLeave">
      <div class="normal_player" v-show="fullScreen">
          <div class="background">
             <img width="100%" height="100%" :src="currentSong.image">
          </div>
          <div class="top">
             <div class="back" @click="shou">
                <i class="icon-back"></i>
             </div>
             <h1 class="title" v-html="currentSong.name"></h1>
             <h2 class="subtitle" v-html="currentSong.singer"></h2>
          </div>
          <div class="middle" @touchstart.prevent="middleTouchStart"
                              @touchmove.prevent="middleTouchMove"
                              @touchend="middleTouchEnd"
          >
               <div class="middle-l" ref="middleL">
	                <div class="cd-wrapper" ref="cdWrapper">
			              <div class="cd">
			                <img :class="imgRound" class="image" :src="currentSong.image"> 
			              </div>
                    <div class="playing-lyric-wrapper">
                         <div class="playig-lyric">
                            {{plyinglyric}}
                         </div>
                    </div>
	                </div>
               </div> 
               <Scroll class="middle-r" ref="lyricScroll" :data="currentLyric && currentLyric.lines">
                   <div class="lyric-wrapper">
                      <div v-if="currentLyric">
                        <p ref="lyricLine"
                           class="text"
                           :class="{'lyric_current': currentLineNum ===index}"
                           v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                      </div>
                  </div>   
              </Scroll>
          </div>
          <div class="bottom">
                <div class="dot-wrapper">
                     <span class="dot" :class="{'active':currentShow == 'cd'}"></span>
                     <span class="dot" :class="{'active':currentShow == 'lyric'}"></span>
                </div>
                <div class="progress-wrapper">
                   <span class="time time-l">{{formate(currentTime)}}</span>
                   <div class="progress-bar-wrapper">
                      <progressBar :precent="precent" @changePrecent="onChangePrecent"></progressBar>
                   </div>
                   <span class="time time-r">{{formate(currentSong.duration)}}</span>
                </div>
  	            <div class="operators">
  		            <div class="icon i-left" @click="changeMode">
  		              <i :class="iconMode"></i>
  		            </div>
  		            <div class="icon i-left">
  		              <i @click="prev" class="icon-prev" :class="disableClass"></i>
  		            </div>
  		            <div @click="stopPlay" class="icon i-center" >
  		              <i :class="[iconPlay,disableClass]"></i>
  		            </div>
  		            <div class="icon i-right">
  		              <i @click="next" class="icon-next" :class="disableClass"></i>
  		            </div>
  		            <div class="icon i-right">
  		              <i class="icon icon-not-favorite"></i>
  		            </div>
  	          </div>
          </div>
      </div>
      </transition>
      
      <transition name="mini">
	      <div class="mini-player" v-show="!fullScreen" @click="open">
	           <div class="icon">
	             <img :class="imgRound" width="40" height="40" :src="currentSong.image">
	           </div>
	           <div class="text">
	             <h2 class="name" v-html="currentSong.name"></h2>
	             <p class="desc" v-html="currentSong.singer"></p>
	           </div>
	           <div class="control">
                  <progressCircle :precent="precent" :radius="radius">
		              <i :class="xiaoIconPlay"  class="icon-mini" @click.stop="toggleStatePlay"></i>
	              </progressCircle>
	           </div>
		       <div class="control" @click.stop="showPlayList">
		          <i class="icon-playlist"></i>
		       </div>
	      </div>
      </transition>
      <playlist ref="playlist"></playlist>
      <audio ref="audio" :src="currentSong.url" @canplay="readyPlay" @error="error" @timeupdate="updatatime"  @ended="end"></audio>
   </div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from "vuex"
import animations from "create-keyframe-animation"
import progressBar from "../../base/progressBar/progressBar"
import progressCircle from "../../base/progressCircle/progressCircle"
import {RandomArray} from "../../common/js/util"
import lyricParser from "lyric-parser"
import Scroll from "../../base/scroll/scroll"
import playlist from "../playlist/playlist"
export default{
   created(){
     this.touch={};
   },
   data(){
     return {
       songReady:false, //标志位，用来限制多次点击，音频出错
       currentTime:0, //当前时间
       radius:36,
       currentLyric:null,
       currentLineNum:0,
       currentShow:"cd",
       plyinglyric:""
     }
   },
   components:{
     progressBar,progressCircle,Scroll,playlist
   },
   computed:{
       iconMode(){
         return this.mode == 0 ? "icon_sequence" : this.mode === 1 ? "icon_loop" : "icon_random";
       },
       precent(){
         return this.currentTime / this.currentSong.duration ;
       },
       disableClass(){
         return this.songReady ? "":"disbaleCl";
       },
       imgRound(){
          return this.playing ? 'play' : "pause";  
       },
       iconPlay(){
          return this.playing ? "icon-playing":"icon-pause";
       },
       xiaoIconPlay(){
          return this.playing ? "icon-playing-x":"icon-pause-x";
       },
      ...mapGetters([
        "playlist",
        "fullScreen",
        "currentSong",
        "playing",
        "currentIndex",
        "mode",
        "sequenselist"
      ])
   },
   methods:{
      showPlayList(){
        this.$refs.playlist.show();
      },
      middleTouchStart(e){
          this.touch.init=true;
          console.log(e);
          const touch=e.touches[0];
          this.touch.startX = touch.pageX;
          this.touch.startY = touch.pageY;
      },
      middleTouchMove(e){
         if(!this.touch.init){
           return ;
         }
         const touch=e.touches[0];
         let deltX= touch.pageX - this.touch.startX;
         let deltY= touch.pageY -this.touch.startY;
         //若是y的距离大于x，则不执行
         if(Math.abs(deltX)<Math.abs(deltY)){
            return ;
         }    
         const left = this.currentShow === 'cd' ? 0 : -window.innerWidth 
         const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltX))  //移动距离
         this.touch.precent = Math.abs(offsetWidth / window.innerWidth); //获取到移动占屏幕的比例
         this.$refs.lyricScroll.$el.style.transitionDuration = 0 ; //过渡时间
         this.$refs.lyricScroll.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`; //歌词移动
         this.$refs.middleL.style.opacity = 1- this.touch.precent;
         this.$refs.middleL.style.transitionDuration = 0; 
      },
      middleTouchEnd(e){
         let offsetWidth;
         let opacity;
         //从右往左 大于10%屏幕宽度，转到lyric界面，否则保持不变
         if(this.currentShow === 'cd'){
            if(this.touch.precent > 0.1){
                offsetWidth = -window.innerWidth;
                this.currentShow= 'lyric';
                opacity = 0;
            }else{
               opacity=1;
               offsetWidth = 0;
            }
         }else{  //从左往右  也是大于10%时，就转到cd界面
            if(this.touch.precent<0.9){
              offsetWidth = 0;
              this.currentShow = 'cd';
              opacity = 1;
            }else{
              opacity = 0;
              offsetWidth = -window.innerWidth;
            }
         }
         const time =300;
         this.$refs.lyricScroll.$el.style.transitionDuration = `${time}ms`; //过渡时间300ms
         this.$refs.lyricScroll.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`; 
          this.$refs.middleL.style.opacity = opacity;
         this.$refs.middleL.style.transitionDuration = `${time}ms`; 
      },
      changeMode(){
          //改变播放模式，三种播放模式所以去模3
          //console.log(this.mode);
          let mode= (this.mode+1)%3;
          //console.log(mode);
          this.setPlayMode(mode);
          let list=[];
          if(mode == 2){
              list=RandomArray(this.sequenselist); //去打乱数组
          }else{
              list=this.sequenselist;  
          }
          let index=this.getNewCurrentIndex(list);  
          //这里是防止模式改变后，当前歌曲会改变，所去找当前歌曲对于新数组的位置
          console.log(index); 
          this.setCurrentIndex(index);
          this.setPlayList(list);
      },
      getNewCurrentIndex(list){
          let i=list.findIndex((item)=>{
            return item.id == this.currentSong.id;
          })
          return i;
      },
      end(){
         //audio自带了一个ended事件，模式为循环时去调用loop
         if(this.mode == 1){
            this.loop();
         }else{
           this.next();
         }
      },
      loop(){
          //把时间重新设置为0,播放
          this.$refs.audio.currentTime = 0;
          this.$refs.audio.play();
          if(this.currentLyric){
            this.currentLyric.seek(0);
          }
      },
      shou(){
         this.fullScreens(false);
      },
      open(){
         this.fullScreens(true);
      },
      stopPlay(){
        if(!this.songReady){
          return ;
        }
        this.setPlayState(!this.playing);
        if(this.currentLyric){
         this.currentLyric.togglePlay();  //这个方法是改变歌词状态
        }
      },
      toggleStatePlay(){
        if(!this.songReady){
          return ;
        }
       this.setPlayState(!this.playing);
        if(this.currentLyric){
         this.currentLyric.togglePlay();
        }
      },
      next(){
        if(!this.songReady){
          return ;
        }
        let index=this.currentIndex+1;
        if(index>this.playlist.length){
          index=0;
        }
        this.setCurrentIndex(index); 
        if(!this.playing){
          this.toggleStatePlay();
        }
         this.songReady=false;  
      },
      prev(){
	     if(!this.songReady){
	          return ;
	     }
         let index=this.currentIndex-1;
         if(index<0){
          index=this.playlist.length-1;
         }
         this.setCurrentIndex(index);
         if(!this.playing){
          this.toggleStatePlay();
         }
         this.songReady=false;    
      },
      readyPlay(){
         this.songReady=true;  //标志位做限制，防止多次点击，音频还没有加载完
         this.saveplayhistory(this.currentSong);
      },
      error(){
        //防止没有网或是url地址出错后，歌曲不能再往下和往上点击，这里也要设置下标志位的变化
        this.songReady=true;
      },
      updatatime(e){
         //获取到当前播放了多少秒(注意是秒)
         this.currentTime=e.target.currentTime;
      },
      formate(interval){
         //格式化时间，这里时间是秒
         let minutes=Math.floor(interval/60);
         let seconds=this._paddingZero(Math.floor(interval%60));
         return `${minutes}:${seconds}`;
      },
      _paddingZero(num){
         //补零函数
         let len=num.toString().length;
         if(len<2){
           num ='0'+num;
           len++;
         }
         return num;
      },
      onChangePrecent(precent){
         //当比例改变时，去给音频DOM的currentTime去赋值
         const currentTime=precent * this.currentSong.duration;
         this.$refs.audio.currentTime=currentTime;
         if(!this.playing){
           this.toggleStatePlay();
         }
         if(this.currentLyric){
           this.currentLyric.seek(currentTime * 1000 );
         }
      },
      enter(el,done){
         //动画进入后执行
         const {x,y,scale}=this._getPosAndScale();
         let animation={
            0:{
               transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            60:{
               transform:`translate3d(0,0,0) scale(1.1)`
            },
            100:{
               transform:`translate3d(0,0,0) scale(1)`
            }
         };
         //注册动画
         animations.registerAnimation({
            name:"move",
            animation,
            presets:{
              duration:600,
              easing:"linear"
            }
         })
         //调用动画，done是回调函数，是可以让afterEnter去执行的
         animations.runAnimation(this.$refs.cdWrapper,"move",done);
      },
      afterEnter(){
        //注销动画,并清空cdwrapper的animation CSS样式
        animations.unregisterAnimation("move");
        this.$refs.cdWrapper.style.animation="";
      },
      leave(el,done){
         this.$refs.cdWrapper.style.transition="all 0.4s";
         let {x,y,scale}=this._getPosAndScale();
         this.$refs.cdWrapper.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`;
         //过渡事件,transitionend
         this.$refs.cdWrapper.addEventListener("transitionend",done,false);       
      },
      afterLeave(){
         this.$refs.cdWrapper.style.transition="";
         this.$refs.cdWrapper.style.transform="";
      },
      _getPosAndScale(){
         //获取到图片到小图标的位置x,y,scale
         const  targetWidth=40;
         const  paddingleft=20;
         const  paddingtop=80;
         const  paddingbottom=10;
         const  width=window.innerWidth*0.8;
         const  scale=targetWidth/width;
         const  y=window.innerHeight-paddingtop-width/2-paddingbottom;
         const  x=-(window.innerWidth/2-paddingleft);
         return{
          x,
          y,
          scale
         }
      },
      getLyric(){
          //得到歌词，且将歌词播放
          this.currentSong.getLyric().then((res)=>{
              this.currentLyric=new lyricParser(res,this.hanler);
              if(this.playing){
                 this.currentLyric.play(); //如果当前为播放状态，就开始播放歌词
              }
              console.log(this.currentLyric);
          }).catch(()=>{
             this.currentLyric = null;
             this.currentLineNum = 0;
             this.playinglyric = "";
          });
         
      },
      hanler({lineNum,txt}){ 
       //这个函数当歌词开始时，就会一直调用这个回调函数,它有两个参数一个当前行数，一个是文本
           this.currentLineNum=lineNum;
           //这里的处理逻辑是为了让文本一直居中
           if(lineNum>5){
              let ele=this.$refs.lyricLine[lineNum - 5];
              this.$refs.lyricScroll.scrollElement(ele,1000);
           }else{
              this.$refs.lyricScroll.scrollTo(0,0,1000);
           }
           this.plyinglyric =txt 
      },
      ...mapMutations({
		     fullScreens:"SET_FULLSCREEN",
		     setPlayState:"SET_PLAYING_STATE",
		     setCurrentIndex:"SET_CURRENTINDEX",
		     setPlayMode :"SET_PLAYMODE",
         setPlayList:"SET_PLAYLIST"
       }),
      ...mapActions([
            "saveplayhistory"
      ])
   },
   watch:{
     currentSong(newSong,oldSong){
     if(!newSong.id){
       return;  //这里是当删除列表中唯一一首歌时，newsong为undefined，阻止下面得操作
     }
     //防止模式改变后，相同的歌曲会触发，会防止这种情况，如果相同，则return
     if(newSong.id== oldSong.id){
       return ;
     }
     //当currentsong更新了，则把原来的歌词定时器，关掉且把行数设为零
     if(this.currentLyric){
        this.currentLyric.stop();
        this.currentLineNum = 0;
        this.currentTime =0;
     }
      //这里的$nextTick相当于等待一定时间后执行
      //  this.$nextTick(function(){
      //  this.$refs.audio.play();
      //  this.getLyric();
      //  });
      // 这里用setTimeout是为了防止从后台切到前端，造成歌曲不播放
       setTimeout(()=>{
         this.$refs.audio.play();
          this.getLyric();
       })
     },
     playing(newval){
        const oaudio=this.$refs.audio;
        if(newval){
           this.$nextTick(function(){
              oaudio.play();
           })
        }else{
          this.$nextTick(function(){
              oaudio.pause();
           })
        }
       
     }
   }
  
}
</script>



<style scoped>
.player .normal_player{
  position:fixed;
  left:0;
  right:0;
  top:0;
  bottom:0;
  z-index:300;
  background:#333;
}
.mini-player{
  display:flex;
  align-items:center;
  position:fixed;
  left:0;
  bottom:0;
  z-index:1000;
  width:100%;
  height:60px;
  background:#1d1c1a;
}
.background{
   position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:-1;
    opacity:0.6;
    filter:blur(20px);
}
.top{
    position:relative;
    margin-bottom:25px;
}   
.top .back{
  position:absolute;
  top:10px;
  left:6px;
  z-index:50;	
}   
.top .back .icon-back{
    display:block;
    padding:10px;
    font-size:16px;
    background-image:url("../../assets/down.png");
    background-size:cover;
}
.top .title{
  width:70%;
  margin:0 auto;
  line-height:40px;
  text-align:center;
  text-overflow:ellipsis;
  overflow:hidden;
  white-space:nowrap;
  font-size:22px;
  font-family:"宋体";
  font-weight:200;
  color:#fff;
}
 .top .subtitle{
	  line-height:20px;
	  text-align:center;
	  font-size:14px;
	  color:#fff;
	  font-family:"宋体";
      font-weight:200;
 }         
 .middle{
	position:fixed;
	width:100%;
	top:80px;
	bottom:240px;
	white-space:nowrap;
	font-size:0;
 }
 .middle-l{
  display:inline-block;
  vertical-align:top;
  position:relative;
  width:100%;
  height:0;
  padding-top:80%;
 }       
 .cd-wrapper{
	position:absolute;
	left:10%;
	top:0;
	width:80%;
	height:100%;
 }      
 .cd{
      width:100%;
      height:100%;
      box-sizing:border-box;
      border:10px solid rgba(255, 255, 255, 0.1);
      border-radius:50%;
 }     
.cd .play{
  animation:rotate 20s linear infinite;	
}
              
.cd .pause{
 animation-play-state:paused;      
}
.cd .image{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    border-radius:50%;	
}     
 .playing-lyric-wrapper{
    width:80%;
    margin:50px auto 0 auto;
    overflow:hidden;
    text-align:center;
 }   
.playing-lyric-wrapper .playig-lyric{
  height:20px;
  line-height:20px;
  font-size:18px;
  color:#b5acac;
 }    
 .middle-r{
   display:inline-block;
   vertical-align:top;
   width:100%;
   height:100%;
   overflow:hidden;
 }  
 .lyric-wrapper{
    width:80%;
    margin:0 auto;
    overflow:hidden;
    text-align:center;
 }              

.lyric-wrapper .text{
  line-height:32px;
  color:#fff;
  font-size:14px;
 } 
.lyric-wrapper .lyric_current{
   color:#e2b713;
}               
.bottom{
    position:absolute;
    bottom:50px;
    width:100%;	
}
.bottom .dot-wrapper{
	text-align:center;
    font-size:0;
} 
.bottom .dot-wrapper .dot{
    display:inline-block;
    vertical-align:middle;
    margin:0 4px;
    width:8px;
    height:8px;
    border-radius:50%;
    background:#fff;
}   
.bottom .dot-wrapper .active{
    width:20px;
    border-radius:5px;
    background:#e2b713;
 }        
.progress-wrapper{
  display:flex;
  align-items:center;
  width:80%;
  margin:0px auto;
  padding:10px 0;
}
 .progress-wrapper .time{
    color:#fff;
    font-size:16px;
    flex:0 0 30px;
    line-height:30px;
    width:30px;
 }
.time-l{
  text-align:left;
}
.time-r{
  text-align:right;
}
.progress-bar-wrapper{
    flex:1;
 }           
.operators{
 display:flex;
 align-items:center;
}
.operators .icon{
   flex:1;
   color:#333;
}
.i-left{
text-align:right;
line-height:22px;
}          
.i-center{
padding:0 20px;
text-align:center;
}
.i-right{
text-align:left;

}
.icon-favorite{
 color:blue;
    
}
.icon_random{
	background-image:url("../../assets/random.png");
	display:inline-block;
	width:32px;
	height:32px;
	background-size:100%;
}
.icon_sequence{
	background-image:url("../../assets/sequence.png");
	display:inline-block;
	width:32px;
	height:32px;
	background-size:100%;
}
.icon_loop{
	background-image:url("../../assets/loop.png");
	display:inline-block;
	width:32px;
	height:32px;
	background-size:100%;
}
.icon-next{
	background-image:url("../../assets/next.png");
	display:inline-block;
	width:32px;
	height:32px;
	background-size:100%;
}
.icon-not-favorite{
	background-image:url("../../assets/favorate.png");
	display:inline-block;
	width:32px;
	height:32px;
	background-size:100%;
}
.icon-playing{
	background-image:url("../../assets/startPlay.png");
	display:inline-block;
	width:40px;
	height:40px;
	background-size:100%;
}
.icon-pause{
	background-image:url("../../assets/stop.png");
	display:inline-block;
	width:40px;
	height:40px;
	background-size:100%;
}
.icon-prev{
	background-image:url("../../assets/prev.png");
	display:inline-block;
	width:32px;
	height:32px;
	background-size:100%;
}

/*这里是常规播放器的透明度变化*/       
 .noarmal-enter-active,.noarmal-leave-active{
    transition:all 0.4s;
 } 
.noarmal-enter, .noarmal-leave-active{
	opacity:0;
}
/*这里是top,bottom变化，top从上面下来，bottom从下面上来*/
.noarmal-enter-active .top,.noarmal-leave-active .top{
	 transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.noarmal-enter-active .bottom,.noarmal-leave-active .bottom{
	 transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
 .noarmal-enter .top,.noarmal-leave-active .top{
   transform: translate3d(0, -100px, 0)
 }
 .noarmal-enter .bottom,.noarmal-leave-active .bottom{
   transform :translate3d(0,100px,0);
 }    

/*这里是Mini的透明度的变化*/
 .mini-enter-active, .mini-leave-active{
  transition:all 0.4s;
 }
.mini-enter,.mini-leave-active{
	 opacity:0;
}
.icon-playing-x{
	background-image:url("../../assets/startPlay.png");
	display:inline-block;
	width:30px;
	height:30px;
	background-size:100%;
}
.icon-pause-x{
	background-image:url("../../assets/stop.png");
	display:inline-block;
	width:30px;
	height:30px;
	background-size:100%;
}

.mini-player .icon{
        flex:0 0 40px;
        width:40px;
        padding:0 10px 0 20px;
}    
.mini-player img{
	border-radius:50%;
}     
.mini-player .text{
    display:flex;
    flex-direction:column;
    justify-content:center;
    flex:1;
    line-height:22px;
    overflow:hidden;
}
.mini-player .name{
  margin-bottom:2px;
  text-overflow:ellipsis;
  overflow:hidden;
  white-space:nowrap;
  color:#fff;
  font-size:15px;
  font-weight:200;
  font-fmaily:"宋体";
}
 .mini-player .desc{
 text-overflow:ellipsis;
  overflow:hidden;
  white-space:nowrap;
  font-size:15px;
  color:#9a9393;
 }
 .mini-player .control{
        flex:0 0 30px;
        width:30px;
        padding:0 10px;
 }
 .icon-playlist{
 background-image:url("../../assets/music_play.png");
 display:inline-block;
 width:100%;
 height:32px;
 background-size:cover;
 }
 .icon-play-mini, .icon-pause-mini,.icon-playlist{
  font-size:30px;
  color:#333;
 }
 .icon-mini{
  font-size:32px;
  position:absolute;
  left:2px;
  top:2px;
 }
 
.cd img.play,.mini-player img.play{
	animation:rotate 10s linear infinite;
}
.cd img.pause{
animation-play-state:paused;
}
.mini-player img.pause{
	animation-play-state:paused;	
}
 @keyframes rotate{
   0%{
     transform:rotate(0);
   }
   100%{
     transform:rotate(360deg);
   }
 } 

 .disbaleCl{
   background-color:rgba(130,19,3,0.5);
 }     
</style>