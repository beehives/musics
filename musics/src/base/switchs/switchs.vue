<template>
  <ul class="switches">
     <li @click="selectIndex(index)" class="switch-item" v-for="(item,index) in switches" :class="{'active':index===currentIndex}">
        <span>{{item.name}}</span>
     </li>
  </ul>
</template>


<script>
export default{
	props:{
	  switches:{
	    type:Array,
	    default:[]
	  },
	  currentIndex:{
	    type:Number,
	    default:0
	  }
	},
	methods:{
	  selectIndex(index){
	    this.$emit("switch",index);
	  }
	}
}

</script>


<style scoped>
.switches{
    list-style:none;
    display:flex;
    align-items:center;
    width:240px;
    margin:0 auto;
    border:1px solid #333;
    border-radius:5px;	
}
.switch-item{
	  flex:1;
      padding:8px;
      text-align:center;
      font-size:14px;
      color:#fff;
}
.active{
	background:#333;
    color:#fff;
}
        
</style>