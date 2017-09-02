<template>
   <transition name="slide">
	     <div class="add-song" v-show="showFlag" @click.stop>
		        <div class="header">
		           <h1 class="title">添加歌曲列表</h1>
		           <div class="close" @click="hide">
		              <i class="icon-close"></i>
		           </div>
		        </div>
		        <div class="search-box-wrapper">
                   <searchBox ref="searchBox" placeholder="搜索歌曲" @query="onchangeQuery"></searchBox>
		         </div>
		        <div class="shortcut" v-show="!query">
                    <switchs :currentIndex="currentIndex" :switches="switchs" @switch="switchItem"></switchs>
                    <div class="list-wrapper">
	                       <Scroll ref="songlist" class="list-scroll" v-if="currentIndex===0" :data="playHistory">
	                          <div class="list-inner">
	                             <songlist :songs="playHistory" @select="selectSong"></songlist>
	                          </div>
	                       </Scroll>
	                       <Scroll ref="seachlist" class="list-scroll" v-if="currentIndex==1" :data="searchHistory">
                              <div clas="list-inner" style="padding:20px;">
                                 <seachList :searchs="searchHistory" @delete="deleteSearchHistory" @select="addQuery"></seachList>
                              </div>
	                       </Scroll>
                     </div>
		        </div>
		        <div class="search-result" v-show="query">
                     <suggest :query="query" :zhida="showSinger" @setHistory="selectItem"></suggest>
		        </div>
		        <topTip ref="tip">
                   <div class="tip-title">
                      <i class="icon-ok"></i>
                      <span class="text">1首歌曲添加到播放队列</span>
                   </div>
		        </topTip>
	     </div>
   </transition>
</template>

<script>
import searchBox from "../../base/search-box/search-box"
import suggest from "../suggest/suggest"
import {searchMixin} from "../../common/js/mixin"
import switchs from "../../base/switchs/switchs"
import Scroll from "../../base/scroll/scroll"
import {mapGetters,mapActions} from "vuex"
import songlist from "../../base/song_list/song_list"
import Song from "../../common/js/songe"
import seachList from "../../base/search-list/search-list"
import topTip from "../../base/top-tip/top-tip"

export default{ 
    mixins:[searchMixin],
	data(){
	  return{
	    currentIndex:0,
	    switchs:[
	     {name:"最近播放"},
	     {name:"搜素历史"}
	    ],
	    showFlag:false,    //是否展示模块
	    showSinger:false  //是否搜索歌手
	  }
	},
	computed:{
	   ...mapGetters([
         "playHistory"
	   ])
	},
	methods:{
	   show(){
	     this.showFlag=true;
	     setTimeout(()=>{
	        if(this.currentIndex==0){
	          this.$refs.songlist.refresh();
	        }else{
	           this.$refs.serachlist.refresh();
	        }
	     },20)
	   },
	   hide(){
	     this.showFlag=false;
	   },
	   selectItem(){
	     this.saveSearch(); //保存历史记录
	      this.showTip();
	   },
	   switchItem(index){
	      this.currentIndex=index;
	   },
	   selectSong(item,index){
	     if(index!=0){
             this.insertSong(new Song(item));
             this.showTip();
	     }
	   },
	   showTip(){
	      this.$refs.tip.show();
	   },
	   ...mapActions([
          "insertSong"
	   ])
	},
	components:{
       searchBox,suggest,switchs,Scroll,songlist,seachList,topTip
	}
}

</script>


<style scoped>
 .add-song{
    position:fixed;
    top:0;
    bottom:0;
    width:100%;
    z-index:1022;
    background:#222;
 }
.slide-enter-active, .slide-leave-active{
	  transition:all 0.3s;
}
.slide-enter, .slide-leave-active{
	transform:translate3d(100%, 0, 0);
}
.header{
	 position:relative;
      height:44px;
      text-align:center;
}
.title{
	  line-height:44px;
      font-size:18px;
      color:#fff;
}
.close{
      position:absolute;
      top:8px;
      right:8px;
}
.icon-close{
	  display:block;
      padding:12px;
      font-size:20px;
      color:#ffcd32;
      background:url("../../assets/rgb1.png") no-repeat 0 0;
      background-size:100%;
}
.search-box-wrapper{
	margin:20px;
}
.shortcut  .list-wrapper{
	  position:absolute;
      top:165px;
      bottom:0;
      width:100%;
}
.list-scroll{
	height:100%;
    overflow:hidden;
}
.list-inner{
	 padding:20px 30px;
}        
.search-result{
      position:fixed;
      top:124px;
      bottom:0;
      width:100%;	

}
.tip-title{
	  text-align:center;
      padding:18px 0;
      font-size:0;
}
.icon-ok{
	 font-size:14px;
     color:#ffcd32;
     margin-right:4px;
     margin-top:5px;
     background:url("../../assets/ok.png") no-repeat 0 0;
     background-size:100%;
     display:inline-block;
     width:16px;
     height:16px;
}
.text{
     font-size:14px;
     color:#fff;
	
}  
</style>