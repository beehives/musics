<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hidden">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text">歌曲列表</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <Scroll class="list-content" :data="list" ref="listContent"> 
          <transition-group name="list"  tag="ul">
            <li :key="item.id" ref="listItemLi" class="item" v-for="(item,index) in list" @click="selectItem(item,index)">
              <i class="current" :class="getCurrentItem(item)">{{item.name}}</i>
              <span class="text"></span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div class="add" @click="showAddSong">
            <i class="icon-add"></i>
            <span class="text" >添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hidden">
          <span>关闭</span>
        </div>
      </div>
       <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
       <addSong ref="addSong"></addSong>
    </div>
    </transition>
</template>



<script>
import {mapGetters,mapMutations,mapActions} from "vuex";
import Scroll from "../../base/scroll/scroll"
import confirm from "../../base/confirm/confirm"
import addSong from "../addSong/addSong"
export default{
	data(){
	  return{
	    showFlag:false
	  }
	},
	components:{
	  Scroll,confirm,addSong
	},
	computed:{
	  list(){
	     return this.sequenselist ? this.sequenselist :[];
	  },
      ...mapGetters([
        "sequenselist",
        "currentSong",
        "playlist",
        "mode"
      ])
	},
	methods:{
	  show(){
	    this.showFlag=true;
	    setTimeout(()=>{
	       this.$refs.listContent.refresh();
	       this.scrollCurrent(this.currentSong);
	    },20);
	  },
	  hidden(){
	    this.showFlag=false;
	  },
	  getCurrentItem(item){
	    if(item.id == this.currentSong.id){
	      return "icon-play";
	    }
	     return "";
	  },
	  selectItem(item,index){
	   //如果是顺序播放和单曲循环则是当前的index,若是随机播放则从playlist中去找到index的值
          if(this.mode == 2){
             index=this.playlist.findIndex((song)=>{
                return song.id == item.id;
             });
          }
          this.setCurrentIndex(index);
          this.setPlayState(true);
	  },
	  scrollCurrent(current){
	     let index=this.sequenselist.findIndex((song)=>{
	        return song.id==current.id;
	     });
	     this.$refs.listContent.scrollElement(this.$refs.listItemLi[index],300);
	  },
	  deleteOne(item){
           this.deleteSong(item);
           if(!this.playlist.length){
              this.hidden();	
           }
	  },
	  showConfirm(){
          this.$refs.confirm.show(); //确认框的展示
	  },
	  confirmClear(){
	      this.deleteAllSong(); //删除所有歌曲
	  },
    showAddSong(){
        this.$refs.addSong.show();  
    },
	  ...mapMutations({
	    setCurrentIndex:"SET_CURRENTINDEX",
	    setPlayState:"SET_PLAYING_STATE"
	  }),
	  ...mapActions([
          'deleteSong',
          "deleteAllSong"
	  ])
	},
	watch:{
	  currentSong(newval,oldval){

        if(!this.showFlag || newval.id==oldval.id){
           return;
        }
        this.scrollCurrent(newval);
	  }
	}
}

</script>


<style scoped>
 .playlist{
   position:fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    z-index:1001;
 }
 .list-fade-enter-active, .list-fade-leave-active{
  transition:opacity 0.3s;
 }
    
  .list-fade-enter-active .list-wrapper,.list-fade-leave-active .list-wrapper{
   transition:all 0.3s;
 }
 .list-fade-enter,.list-fade-leave-to{
  opacity:0;
 }
  .list-fade-enter .list-wrapper,.list-fade-leave-to .list-wrapper{
  transform: translate3d(0, 100%, 0)
       
 }
 .list-wrapper{
      position:absolute;
      left:0;
      bottom:0;
      width:100%;
      background-color:#211f1f;
 }
 .list-header{
      position:relative;
      padding:20px 30px 10px 20px;
 }
.title{
      display:flex;
      align-items:center;	
}
 .icon{
      margin-right:10px;
      font-size:30px;
      color:red;
 }
 .icon-play{
    background:url("../../assets/music_play.png") no-repeat 0 0;
      background-size:100%;
      width:22px;
      height:22px;
      display:inline-block;
 }
 .text{
      flex:1;
      font-size:14px;
      color:#fff;
 }      
 .icon-clear{
      font-size:14px;
      color:#fff;
      background:url("../../assets/rbg.png") no-repeat 0 0;
      background-size:100%;
      width:22px;
      height:22px;
      display:inline-block;
 }
 .list-content{
      max-height:240px;
      overflow:hidden;
 }
 .item{
      display:flex;
      align-items:center;
      height:40px;
      padding:0 30px 0 20px;
      overflow:hidden;
      text-overflow:ellipsis;
      overflow:hidden;
      white-space:nowrap;
      font-size:16px;
      font-family:cursive;
 }
.current{
	 flex:0 0 20px;
     width:20px;
     font-size:14px;
     color:#fff;
     text-indent:22px;
}
 .list-content  .text{
   flex:1;
   font-size:14px;
   color:#fff;
 }  
 .like{
   margin-right:15px;
   font-size:14px;
   color:#fff;
   width:22px;
   height:22px;
 }
 .like i.icon-not-favorite{
   display:inline-block;
   width:22px;
   height:22px;
   background:url("../../assets/favorate.png") no-repeat 0 0;
   background-size:100%;
 }
 .icon-favorite{
   color:blue;
 }
 .delete{
  font-size:14px;
  color:#fff;
 }
 i.icon-delete{
   display:inline-block;
   width:22px;
   height:22px;
   background:url("../../assets/rgb1.png") no-repeat 0 0;
   background-size:100%;
 }
.list-operate{
	 margin:20px auto 30px auto;
	 width:140px;
}
.add{
	   display:flex;
       align-items:center;
       padding:8px 16px;
       border:1px solid #fff;
       border-radius:100px;
       color:#fff;
}
 .icon-add{
       margin-right:5px;
       font-size:14px;
 }
  .icon-add  .text{
    font-size:12px;
  }
.list-close{
        text-align:center;
        line-height:50px;
        background:#171414;
        font-size:14px;
        color:#fff;
}
.list-enter-active,.list-leave-active{
	transition:all 0.3s;
}
.list-enter,.list-leave-active{
	height:0;
}

</style>