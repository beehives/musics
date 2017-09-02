<template>
  <transition name="confirm-fade">
      <div class="confirm" v-show="showFlag" @click.stop>
         <div class="confirm-wrapper">
              <div class="confirm-content">
                 <p class="text">{{text}}</p>
                 <div class="operate">
                     <div @click="cancle" class="operate-btn left">{{cancelText}}</div>
                     <div @click="confirm" class="operate-btn">{{confirmText}}</div>
                 </div>   
              </div>
         </div>
      </div>
  </transition>

</template>


<script>
export default{
     props:{
       text:{
         type:String,
         default:""
       },
       confirmText:{
         type:String,
         default:"确定"
       },
       cancelText:{
         type:String,
         default:"取消"
       }
     },
	 data(){
	   return{
	     showFlag:false
	   }
	 },
	 methods:{
	    show(){
	      this.showFlag=true;
	    },
	    hidden(){
	      this.showFlag=false;
	    },
	    cancle(){
	      this.hidden();
	      this.$emit("cancel");
	    },
	    confirm(){
	      this.hidden();
	      this.$emit("confirm");
	    }

	 }
}
</script>


<style scoped>
 .confirm{
    position:fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    z-index:1200;
 }
.confirm-fade-enter-active{
	transition:all 0.3s;
}
.confirm-fade-enter{
	opacity:0;
}
.confirm-content{
	 animation:confirm-zoom 0.3s;
}
.confirm-wrapper{
	  position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%, -50%);
      z-index:999;
}
.confirm-content{
	width:270px;
    border-radius:13px;
    background:#464242;
}
.text{
    padding:19px 15px;
    line-height:22px;
    text-align:center;
    font-size:14px;
    color:#fff;
}
.operate{
     display:flex;
     align-items:center;
     text-align:center;
     font-size:16px;
}
.operate-btn{
	 flex:1;
     line-height:22px;
     padding:10px 0;
     border-top:1px solid $color-background-d;
     color:#fff;
}
.left{
	   border-right: 1px solid #6f6a6a;
}
@keyframes confirm-fadein{
	0%{
	 opacity:0;
	}
    100%{
       opacity:1;
    }
}
@keyframes confirm-zoom{
	0%{
	  transform:scale(0);
	}
    50%{
      transform:scale(1.1);
    }
    100%{
      transform:scale(1);
    }
}
   

</style>