<template>
   <div class="search-list">
      <transition-group name="list" tag="ul">
          <li :key="item" @click="selectItem(item)"  class="search-item"  v-for="(item,index) in searchs">
              <span class="text">{{item}}</span>
              <span class="icon" @click.stop="deleteItem(item)">
                  <i class="icon-delete"></i>
              </span>
          </li>
      </transition-group>
   </div>
</template>


<script>
  export default{
     props:{
        searchs:{
          type:Array,
          default:[]
        }
     },
     methods:{
       selectItem(item){
           console.log(item);
           this.$emit("select",item);
       },
       deleteItem(item){
           this.$emit("delete",item);
       }
     }
  }
</script>



<style scoped>
.search-list .search-item{
  display:flex;
  align-items:center;
  height:40px;
  overflow:hidden;
}
 .list-enter-active, .list-leave-active{
   transition: all 0.1s;
 }
 .list-enter, .list-leave-to{
	 height:0;
 }
.text{
	flex:1;
    color:#fff;
    font-size:14px;
}
.icon-delete{
   font-size:14px;
   color:#fff;
   display:inline-block;
   background:url("../../assets/rgb1.png") no-repeat 0 0;
   width:16px;
   height:16px;
   background-size:100%;   
}
.list-enter-active,.list-leave-active{
  transition:all 0.3s;
}
.list-enter,.list-leave-active{
   height:0px;
}



</style>