import {mapGetters,mapActions,mapMutations} from "vuex"

export const playListMixin={
  computed:{
     ...mapGetters([
         'playlist'
     	])
  },
  mounted(){
  	this.handlePlaylist(this.playlist);
  },
  activated(){
  	this.handlePlaylist(this.playlist);
  },
  watch:{
  	 playlist(newval){
  	 	this.handlePlaylist(newval);
  	 }
  },
  methods:{
  	handlePlaylist(){
  		 throw new Error("no methods deal with playlist");
  	}
  }

}

//search和addsong公用
export const searchMixin={
   data() {
      return {
        query: ''
      }
   },
   computed:{
      ...mapGetters([
           "searchHistory"  //获取到vuex中的serachHistoryshux
      ])
   },
   methods:{
         onchangeQuery(value){
           this.query=value;   //这里是当seachbox的query变化去调用
         },
         saveSearch(){
           this.saveSearchHistory(this.query);  //保存历史记录一项
         },
         clearBlur(){  //让input框失去焦点
           this.$refs.searchBox.blur();
         },
         addQuery(query){  //改变query值
           //console.log(this.$refs.searchBox);
           this.$refs.searchBox.setQuery(query);
         },
          ...mapActions([
            "saveSearchHistory",  //保存历史记录
            "deleteSearchHistory"  //删除历史记录 
           ])
   }
}