<template>
   <transition name="slide">
      <musicList :rank="rank" :title="title" :bgImage="bgImage" :songs="songs"></musiclist>
   </transition>
</template>


<script>
import musicList from "../music_list/music_list"
import {mapGetters} from "vuex"
import {getTopListDetail} from "../../api/sort"
import {createSong} from "../../common/js/songe"
import {ERROR_OK} from "../../api/config"

export default{ 
   data(){ 
     return{
        songs:[],
        rank:true  //排序为true，展示序号出来
     }
   },
   computed:{
     title(){
       return this.toplist.topTitle;
     },
     bgImage(){
       if(this.songs.length){
         return this.songs[0].image;
       }
       return "";
     },
     ...mapGetters([
        "toplist"
     ])
   },
   created(){
        this._getTopListDetail();
   },
   methods:{
      _getTopListDetail(){
         //折判断是为了防止再次刷新时，获取不到数据，这时调到sort总榜单界面
        if(!this.toplist.id){         
          this.$router.push("/sort");
          return ;
        }
        //获取排行榜的具体歌曲
        getTopListDetail(this.toplist.id).then((res)=>{
           if(res.code ===ERROR_OK){
              //console.log(res.songlist);
              this.songs=this._normal(res.songlist);
           }
        });
      },
      _normal(list){
              let ret=[];
              list.forEach((item)=>{
                 const musicdata=item.data;
                 //这里是将歌曲按照song类的形式创建
                 //如果有专辑id,歌曲id才创建
                 if(musicdata.albumid && musicdata.songid){
                   ret.push(createSong(musicdata));
                 }
              });
              return ret;
      }
   },
   components:{
     musicList
   }
}
</script>


<style scoped>
.slide-enter-active,.slide-leave-active{
	 transition:all 0.3s;
}
.slide-enter,.slide-leave-active{
	 transform:translate3d(100%,0,0);
}

</style>