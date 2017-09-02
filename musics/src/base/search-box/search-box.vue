<template>
  <div class="search-box">
   <i class="icon-search"></i>
   <input ref="inputQuery" v-model="query" :placeholder="placeholder" class="box"/>
   <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>


<script>
export default{
	props:{
	  placeholder:{
	     type:String,
	     default:"搜素歌曲，歌手"
	  }
	},
	data(){
	  return{
	    query:""
	  }
	},
	methods:{
	  blur(){
	     this.$refs.inputQuery.blur();
	  },
	  clear(){
	    this.query="";
	  },
	  setQuery(query){
	    this.query=query;
	  }
	},
	created(){
	   this.$watch("query",(newval)=>{
	      this.$emit("query",newval);
	   });
	}
}

</script>


<style scoped>
.search-box{
	display:flex;
	align-items:center; 
	box-sizing:border-box;
	width:100%;
	padding:0 8px;
    height:40px;
    background-color:rgba(109, 109, 115, 0.1);
    border-radius:8px;
}
.icon-search{
	font-size:24px;
	color:#383634;
	display:inline-block;
	width:16px;
	height:16px;
	background:url("../../assets/search.png") no-repeat 0 0;
	background-size:100%;
}
.box{
	flex:1;
	margin:0 5px;
	line-height:18px;
	background-color:#424141;
	color:#fff;
	font-size:14px;
	font-family:"宋体";
	border:none;
}
.box::placeholder{
	color:#cecece;
}
.icon-dismiss{
	font-size:16px;
	color:green;
	display:inline-block;
	width:16px;
	height:16px;
	background:url("../../assets/delete.png") no-repeat 0 0;
	background-size:100%;
}
</style>