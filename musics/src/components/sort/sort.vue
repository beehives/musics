<template>
   <div class="rank" ref="rank">
      <Scroll class="toplist" :data="topList" ref="toplist">
	      <ul>
	        <li class="item" v-for="item in topList" @click="selectItem(item)">
	          <div class="icon">
	            <img width="100" height="100"  v-lazy="item.picUrl"/>
	          </div>
	          <ul class="songlist">
	            <li class="song" v-for="(song,index) in item.songList">
                   <span>{{index+1}}</span>
                   <span>{{song.songname}}--{{song.singername}}</span>
	            </li>
	          </ul>
	        </li>
	      </ul>
	      <loading v-show="!topList.length" class="loading_container"></loading>
      </Scroll>
      <router-view></router-view>
   </div>
</template>

<script>
import {getTopSongList} from "../../api/sort" 
import {ERROR_OK} from "../../api/config"
import Scroll from "../../base/scroll/scroll"
import {playListMixin} from "../../common/js/mixin"
import loading from "../../base/loading/loading"
import {mapMutations} from "vuex"

export default{
    mixins:[playListMixin],
	data(){
	  return{
	    topList:[]
	  }
	},
	components:{
	  Scroll,loading
	},
	created(){
	    this._getTopSongList();
	},
	methods:{
	  _getTopSongList(){
	      //获取总榜单
           getTopSongList().then((res)=>{
              if(res.code === ERROR_OK){
                  this.topList = res.data.topList;
              }
           })
	  },
	  selectItem(item){
	     this.$router.push({path:`/sort/${item.id}`}); //路由跳转到子路由去
	     console.log(item);
	     this.setTopList(item); //把vuex中的toplist进行改变
	  },
	  handlePlaylist(playlist){
	     const bottom = playlist.length>0 ? "60px" : "";
         this.$refs.rank.style.bottom=bottom;
         this.$refs.toplist.refresh();
	  },
	  ...mapMutations({
	    setTopList:"SET_TOPLIST"
	  })
	}
}
</script>


<style scoped>
.rank{
	position:fixed;
    width:100%;
    top:88px;
    bottom:0;
}
.toplist{
      height:100%;
      overflow:hidden;	
}
.item{
       display:flex;
        margin:0 20px;
        padding-top:20px;
        height:100px;	
}
.item:last-child{
	 padding-bottom:20px;
}
.icon{
         flex:0 0 100px;
          width:100px;
          height:100px;

}
.songlist{
          flex:1;
          display:flex;
          flex-direction:column;
          justify-content:center;
          padding:0 20px;
          height:100px;
          overflow:hidden;
          background:#171515;
          color:#fff;
          font-size:14px;
}
.song{
	line-height:26px;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
}
.loading_container{
	    position:absolute;
        width:100%;
        top:50%;
        transform:translateY(-50%);
}
</style>