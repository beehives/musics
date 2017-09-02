<template>
    <div class="loading">
      <img  width="24" height="24" src="./loading.gif"  alt="qw">
	    <p class="desc">{{title}}</p>
    </div>
</template>


<script>
export default{
	props:{
	   title:{
	      type:String,
	      default:"小龙为你拼命加载中....."
	   }
	}
}
</script>


<style scoped>
 .loading{
    width:100%;
    text-align:center;
 }
 .loading .desc{
   line-height:20px;
   font-size:16px;
   color:#fff;
 }
</style>