<template>
   <div class="header">
      <div class="icon"></div>
      <h1 class="text">{{name}}</h1>
   </div>
</template>


<script>
 export default{
	data(){
      return {
        name:"lr_music"
      }
   }
 }
</script>


<style scoped>
 .header{
   position:relative;
   height:44px;
   text-align:center;
   color:#fff;
   font-size:0px;
   width:100%;
 } 
 .icon{
   display:inline-block;
   vertical-align:top;
   margin-top:6px;
   margin-right:9px;
   width:32px;
   height:32px;
   background-size:32px 32px; 
   background:url("logo.png") no-repeat 0 0;
 }
 .text{
   display:inline-block;
   vertical-align:top;
   line-height:44px;
   font-size:15px;
   font-family:Arial;
   letter-spacing:2px;
 }
</style>