<template>
   <div class="recommend" ref="recommend">
     <scroll class="recommend_content" :data="gelist" ref="scroll">
        <div>
        <div v-if="recommends.length" class="slider_wrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                  <img @load="loadImage()" :src="item.picUrl"/>
              </a>
            </div>
          </slider>
        </div>

        <div class="recommend_list">
           <h1 class="list_title">热门歌单推荐</h1>
              <ul>
	             <li @click="selectItem(song)" v-for="song in gelist" class="item">
	                  <div class="icon">
	                     <img height="60px" width="60px"  v-lazy="song.picUrl"/> 
	                  </div>
	                  <div class="text">
	                    <h2 class="name">{{song.songListAuthor}}</h2>
	                    <p class="desc">{{song.songListDesc}}</p>
	                  </div>
	             </li>
	              <li v-for="song in gelist" class="item">
	                  <div class="icon">
	                     <img height="60px" width="60px" v-lazy="song.picUrl"/> 
	                  </div>
	                  <div class="text">
	                    <h2 class="name">{{song.songListAuthor}}</h2>
	                    <p class="desc">{{song.songListDesc}}</p>
	                  </div>
	             </li>
             </ul>
        </div>
        </div>
        <div class="loading_now" v-show="!gelist.length">
             <loading>
             </loading>
        </div>
      </scroll>
      <router-view></router-view>
   </div>
</template>


<script>
import {getRecommend,getSongList} from "../../api/recommend"
import {ERROR_OK} from "../../api/config"
import slider from "../../base/slider/slider"
import scroll from "../../base/scroll/scroll"
import loading from "../../base/loading/loading"
import {playListMixin} from "../../common/js/mixin"
import {mapMutations} from "vuex"

//getRecommend是请求api数据的方法,error_ok是成功状态（0）

export default{
     mixins:[playListMixin],
    //创建时调用该方法,请求数据,赋值给recommends
	created(){
       this._getRecomend();

       setTimeout(()=>{
       getSongList().then((res)=>{
            this.gelist=res;
            console.log(this.gelist);
       });  
       },20)
	},
	data(){
      return{
       recommends:[],
       gelist:[]
      }
	},
	components:{
      slider,scroll,loading
	},
	methods:{
	  handlePlaylist(playlist){
	     const bottom = playlist.length > 0 ? "60px" : "";
	     this.$refs.recommend.style.bottom = bottom;
	     this.$refs.scroll.refresh();
	  },
	  selectItem(item){
	    this.$router.push({
	       path:`/recommend/${item.id}`
	    });
	    this.setDisc(item);
	  },
	  _getRecomend(){
	     getRecommend().then(res=>{
	       if(res.code == ERROR_OK){
                  this.recommends=res.data.slider;
	       }
	     })
	  },
	  loadImage(){
	  //这里是轮播图和歌单都是异步加载不知道哪个先后加载，防止页面没有被撑开用了,load事件，去刷新下滚动条
	      if(!this.checkLoaded){    
	          this.$refs.scroll.refresh();
	          this.checkLoaded=true;
	      }
        
	  },
	  ...mapMutations({
	    setDisc : "SET_DISC"
	  })
	}
}
</script>


<style scoped>
.recommend{
	position:fixed;
	width:100%;
	top:88px;
	bottom:0px;
}
.recommend_content{
	height: 100%;
    overflow: hidden;
}
.slider_wrapper{
	position:relative;
    width:100%;
    overflow:hidden;
}
.recommend_list .list_title{
	heigth:65px;
    line-heigth:65px;
	text-align:center;	
	width:100%;
	color:#fff;
	font-weight:normal;
}
.recommend_list .item{
	display:flex;
	box-sizing:border-box;
    padding:0 20px 20px 20px;
    align-items:center;
}
.item .icon{
	flex:0 0 60px;
	width:60px;
	padding-right:20px;
}
.item .text{
	display:flex;
	flex:1;
	line-height:20px;
	overflow:hidden;
	flex-direction:column;
	justify-content:center;
	font-size:15px;
}
.item .text .name{
	 margin-bottom:10px;
	 color:#928787;
	 font-weight:normal;
	 font-size:15px;
}
.item .text .desc{
	 color:#fff;
}
.loading_now{
	position:absolute;
	width:100%;
	top:50%;
	transform:translateY(-50%);
}


</style>