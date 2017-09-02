<template>
   <div class="tab">
     <router-link :to="{path:'/recommend'}" tag="div" class="tab_item">
         <span class="tab_link"> 推荐</span>
     </router-link>
      <router-link :to="{path:'/singer'}" tag="div" class="tab_item">
         <span class="tab_link">歌手</span>
     </router-link>
      <router-link :to="{path:'/sort'}" tag="div" class="tab_item">
         <span class="tab_link">排行</span>
     </router-link>
      <router-link :to="{path:'/search'}" tag="div" class="tab_item">
         <span class="tab_link">搜索	</span>
     </router-link>
   </div>
</template>


<script>

</script>

<style scoped>
.tab{
  height:44px;
  line-height:44px;
  font-size:14px;
  display:flex;	
  z-index:4;
  overflow:hidden;
}
.tab .tab_item{
	display:inline-block;
	flex:1;
	text-align:center;
	padding-bottom:5px;
	color:#fff;
}
.router-link-active{
	color:#ffcd32;
	border-bottom:2px solid  #ffcd32;
}
</style>