<template>
   <div class="rank">
      <ul>
        <li class="item">
          <div class="icon">
            <img width="100" height="100"/>
          </div>
          <ul class="songlist">
            
          </ul>
        </li>
      </ul>
   </div>
</template>



<script>

</script>


<style scoped>
.rank{
	position:fixed;
    width:100%;
    top:88px;
    bottom:0;
}
.toplist{
      height:100%;
      overflow:hidden;	
}
.toplist .item{
       display:flex;
        margin:0 20px;
        padding-top:20px;
        height:100px;	
}
.item:last-child{
	 padding-bottom:20px;
}
.icon{
         flex:0 0 100px;
          width:100px;
          height:100px;

}
.songlist{
	
          flex:1;
          display:flex;
          flex-direction:column;
          justify-content:center;
          padding:0 20px;
          height:100px;
          overflow:hidden;
          background:#ccc;
          color:#fff;
          font-size:14px;
}
.song{
	line-height:26px;
}

</style>