<template>
   <transition name="fade">
	   <div class="singer"> 
	        <music_list :title="title" :bgImage="bgImage" :songs="song"></music_list>
	   </div>
	</transition> 
</template>


<script>
import {mapGetters} from "vuex"
import {getSingerDetail} from "../../api/singer"
import {ERROR_OK} from "../../api/config"
import {createSong} from "../../common/js/songe"
import music_list from "../music_list/music_list"
export default{      
  data(){
    return {
      song:[]
    }
  },
  created(){
     console.log(this.singer);
     this._getSingerDetail();
  },
  computed:{
     title(){
        return this.singer.name;
     },
     bgImage(){
        return this.singer.img;
     },
     ...mapGetters([
        'singer'
     ])
  },
  methods:{
     _getSingerDetail(){
         if(!this.singer.id){
            this.$router.push({path:'/singer'});
            return ;
         }
         getSingerDetail(this.singer.id).then((res)=>{
             if(res.code === ERROR_OK){
                 console.log(this.normalizeSong(res.data.list));
                 this.song=this.normalizeSong(res.data.list);
             }
         })          
     },
     normalizeSong(list){
        let res=[];
        if(!list){
           return '';
        }
        list.forEach((item)=>{
           let musicData=item.musicData;
           if(musicData.songmid && musicData.albummid){
             res.push(new createSong(musicData));
           }
        })
        return res;
     }
  },
  components:{
     music_list
  }
}
</script>


<style scoped>
.singer{
    position:fixed;
    z-index:200;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background-color:#222;
}
.fade-enter-active,.fade-leave-active{
	 transition:all 0.3s;
}
.fade-enter,.fade-leave-active{
	  transform:translate3d(100%,0,0);
}
</style>