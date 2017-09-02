<template>
    <transition name="slide">
	   <musiclist :title="title" :bgImage="bgImage"  :songs="songs"></musiclist>
    </transition>
</template>



<script>
import  musiclist from "../music_list/music_list"
import {mapGetters} from "vuex"
import {getGeDan} from "../../api/recommend"
import {ERROR_OK} from "../../api/config"
import {getSingerDetail} from "../../api/singer"
import {createSong}  from "../../common/js/songe"

export default{
    data(){
      return{
        songs:[]
      }
    },
    computed:{
      title(){
          return this.disc.songListDesc;
      },
      bgImage(){
          return this.disc.picUrl;
      },
      ...mapGetters([
          'disc'
        ])
    },
    created(){
       //this._getGeDan(); 这个获取歌单的方式老是报错
       let ret=[];
       getSingerDetail(5062).then((res)=>{
          console.log(res.data.list);
           let list=res.data.list;
           list.forEach((item) =>{
              let song=createSong(item.musicData);
              ret.push(song);
           })
       });
       this.songs=ret;
    },
    methods:{
      _getGeDan(){
         getGeDan(this.disc.id).then((res)=>{
	         if(res.code === ERROR_OK){
	            console.log(res.cdlist[0].songlist);
	         }
         })
      }
    },
    components:{
	  musiclist
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