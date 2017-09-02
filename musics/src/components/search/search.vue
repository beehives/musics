<template>
   <div class="search">
	   <div class="search-wrapper">
	      <searchBox ref="searchBox" @query="onchangeQuery"></searchBox>
	   </div>
       <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
           <Scroll class="shortcut" :data="shortcuts" ref="sc">
               <div>
				   <div class="hot-key">
			            <h1 class="title">热门搜索</h1>
			            <ul>
			              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
			                <span>{{item.k}}</span>
			              </li>
			            </ul>
			       </div>
			       <div class="search-history" v-show="searchHistory.length">
	                  <h1 class="title">
	                     <span class="text">搜索历史</span>
	                     <span class="clear" @click="showConfirm()">
	                         <i class="icon-clear"></i>
	                     </span>
	                  </h1>
	                  <searchList @delete="shanchu" @select="addQuery" :searchs="searchHistory"></searchList>
			       </div>
		       </div>
	       </Scroll>
       </div>
       <div class="search-result" v-show="query" ref="searchResult">
          <suggest @setHistory="saveSearch"  :query="query" ref="suggests"></suggest>
       </div>
       <confirm ref="confirms" text="亲！再三思考" @confirm="clearSearchHistory"></confirm>
       <router-view></router-view>
   </div>
</template>


<script>
import searchBox from "../../base/search-box/search-box"
import suggest from "../../components/suggest/suggest"
import {getHotKey} from "../../api/search"
import {ERROR_OK} from "../../api/config"
import {mapActions,mapGetters} from "vuex"
import searchList from "../../base/search-list/search-list"
import confirm from "../../base/confirm/confirm"
import Scroll from "../../base/scroll/scroll"
import {playListMixin,searchMixin} from "../../common/js/mixin"

export default{
     mixins:[playListMixin,searchMixin],
     data(){
       return{
          hotKey:[]
       }
     },
	 created(){
        this._getHotKey();
	 }, 
	 components:{
	   searchBox,suggest,searchList,confirm,Scroll
	 },
	 computed:{
	    shortcuts(){
	      return this.searchHistory.concat(this.hotKey);  //这里是将历史记录和热门搜素绑在了一起
	    }  
	 },
	 methods:{
	   handlePlaylist(playlist){
         let bottom = playlist.length>0? "60px" : "";
           
           //这里是搜素页
          this.$refs.shortcutWrapper.style.bottom=bottom;
          this.$refs.sc.refresh();
          //搜素结果
          this.$refs.searchResult.style.bottom=bottom;
          this.$refs.suggests.refresh();
	   },
	   shanchu(item){  //删除历史操作一项
	     this.deleteSearchHistory(item);
	   },
	   //获取当前搜索热门关键词
	   _getHotKey(){
	     getHotKey().then((res)=>{
	        if(res.code === ERROR_OK){
		         console.log(res.data.hotkey);
		         this.hotKey=res.data.hotkey.slice(0,10);
	        }
	     });
	   },
       showConfirm(){
         this.$refs.confirms.show();  //弹出框的展现
	   },
	   ...mapActions([
          "clearSearchHistory"
	   ])
	 },
	 watch:{
          query(newval){
            if(!newval){
              setTimeout(()=>{
               this.$refs.sc.refresh();
              },20);
            }
          }
	 }
}
</script>


<style scoped>
.search-wrapper{
	margin:20px;
}
.shortcut-wrapper{
	  position:fixed;
      top:178px;
      bottom:0;
      width:100%;
}
.shortcut{
	 height:100%;
     overflow:hidden;
}
.hot-key{
	margin:0 20px 20px 20px;
}
.hot-key .title{
	 margin-bottom:20px;
     font-size:14px;
     color:#dc4e08;
}
.hot-key .item{
	display:inline-block;
    padding:5px 8px;
    margin:0 20px 10px 0;
    border-radius:6px;
    background:#544f4f;
    font-size:14px;
    color:#e4dddd;
}
.search-result{
	position:fixed;
    width:100%;
    top:178px;
    bottom:0;  
}
 .search-history{
  position:relative;
  margin:0 20px;
 }
 .title{
    display:flex;
    align-items:center;
    height:40px;
    font-size:14px;
    color:#fff;
 }
 .text{
    flex:1;
    font-family:"宋体";
 }
.clear{
	 position: relative;
}
.icon-clear{
	   font-size:14px;
       color:#fff;
       display:inline-block;
       background:url("../../assets/rbg.png") no-repeat 0 0;
       width:16px;
       height:16px;
       background-size:100%;          
}      
            
</style>