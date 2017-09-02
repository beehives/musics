<template>
  <Scroll class="suggest" 
				  :data="result"  
				  :pullup="pullup"  
				  :beforeScroll="beforeScroll"
				  @scrollEnd="searchMore" 
				  @beforeScroll="listScroll"
				  ref="suggest">
       <ul  class="suggest-list">
          <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
	        <div class="icon" :class="getIconCls(item)">
	          <i></i>
	        </div>
	        <div class="name">
	          <p class="text" v-html="getDisplayName(item)"></p>
	        </div>
	      </li>
	      <loading v-show="hasMore" title="加载更多"></loading>
       </ul>
	   <div class="no-result-wrapper" v-show="!hasMore && !result.length">
	      <noResult title="没有相应结果"></noResult>
	   </div>
  </Scroll>
</template>


<script>
import {search} from "../../api/search"
import {ERROR_OK} from "../../api/config"
import {createSong} from "../../common/js/songe"
import Scroll from "../../base/scroll/scroll"
import loading from "../../base/loading/loading"
import singer from "../../common/js/singer"
import {mapMutations,mapActions} from "vuex"
import noResult from "../../base/no-result/no-result"
const TYPE_SINGER="singer"
const pageNumber = 20
  export default{
    props:{
       query:{
          type:String,
          default:""
       },
       zhida:{
          type:Boolean,
          default:true
       }
    },
    components:{
	    Scroll,loading,noResult
    },
    data(){
      return{
         page:1,
         result:[],
         pullup:true,  //是否可以往下滚动加载
         hasMore:true,  //标志位是否还能加载更多
         beforeScroll:true
      }
    },
    methods:{
      getMessage(){
         //console.log(this.query,this.page,this.zhida);
         this.hasMore=true;
         this.page=1;  //充置下页数防止多次加载后，在去改变query的时候除去
         this.$refs.suggest.scrollTo(0,0); //这里也是防止这种情况发生，把scroll组件滚动到顶部
         search(this.query,this.page,this.zhida).then((res)=>{
            if(res.code === ERROR_OK){
             //console.log(res.data);
              this.result=this._genresult(res.data);
              console.log(this.result);
              this.checkMore(res.data);
            }
         });
      },
       //这里的这个函数是处理结果result，如果有专辑和歌手Id,则加入一个对象到数组中
       //且对象中有一个属性值为type:singer的值，便于在渲染的时候样式的改变
      _genresult(data){
          let ret=[];
          if(data.zhida && data.zhida.singerid){
            ret.push({...data.zhida,...{type:TYPE_SINGER}});
          }
          if(data.song){
            ret=ret.concat(this.normalize(data.song.list));
          }
          return ret;
        },
       getIconCls(item){  //如果有type为singer的项，则给class为icon-mine,否则就是icon-music
          if(item.type == TYPE_SINGER){
            return 'icon-mine';
          }else{
            return 'icon-music'
          }
       },
       getDisplayName(item){ //如果有type为singer的项，则返回一个歌手名，若是歌曲则返回歌曲名和歌手名
          if(item.type == TYPE_SINGER){
              return item.singername;
          }else{
             return `${item.name}-${item.singer}`;
          }
       },
       normalize(list){
           let ret=[];
           list.forEach((musicdata)=>{
             ret.push(createSong(musicdata));
           });
           return ret;
       },
       searchMore(){
         if(!this.hasMore){
            return ;
         }
         this.page++; //下一页
         search(this.query,this.page,this.zhida).then((res)=>{
            if(res.code === ERROR_OK){
              //将数据和原有数据结合在一起
              this.result=this.result.concat(this._genresult(res.data));
              this.checkMore(res.data);
            }
         });
       },
       checkMore(data){  //检查是否还有数据
          const song=data.song;
          if(!song.list.length || (song.curpage*song.curnum+pageNumber)>song.totalnum){
            this.hasMore=false;
          }
       },
       refresh(){
           this.$refs.suggest.refresh();
       },
       listScroll(){
         this.$emit("listscroll");  //是给父组件传一个事件用于滚动时，input失去焦点
       },
       selectItem(item){
         if(item.type == TYPE_SINGER ){
            let singers=new singer({
               id:item.singerid,
               mid:item.singermid,
               name:item.singername
            });

            this.$router.push({
               path:`/search/${singers.id}`
            });
            this.setSinger(singers);  
         }else{
            this.insertSong(item);
         }
          this.$emit("setHistory");
       },
       ...mapMutations({
          setSinger:"SET_SINGER"
       }),
       ...mapActions([
            "insertSong"
        ])
      },
	  watch:{
	      query(){  //当query查询字符串发生变化时，则调用该方法去请求接口
		      this.getMessage();  
	      }
	    }
  }
</script>


<style scoped>
 .suggest{
    height:100%;
    overflow:hidden;
 }
.suggest-list{
  padding:0 30px;
}
 .suggest-item{
         display:flex;
        align-items:center;
        padding-bottom:20px;
 }    
.icon{
    flex:0 0 30px;
    width:30px;
}
.name{
	  flex:1;
      font-size:14px;
      color:#fff;
      overflow:hidden;
}
.text{
	
}
.no-result-wrapper{
	  position:absolute;
      width:100%;
      top:50%;
      transform:translateY(-50%);
}
.icon-mine i{
	display:inline-block;
	width:16px;
	height:16px;
	background:url("../../assets/singer.png") no-repeat 0 0;
	background-size:100%;
}  
.icon-music i{
	display:inline-block;
	width:16px;
	height:16px;
	background:url("../../assets/music1.png") no-repeat 0 0;
	background-size:100%;
}


</style>

