<template>
	   <div class="song_list"> 
	       <ul>
	          <li @click="selectItem(item,index)" v-for="(item,index) in songs" class="item" >
              <div v-show="rank" class="rank">
                    <span :class="getClass(index)" v-text="getText(index)"></span>
               </div>
	             <div class="content">
	                 <h2 class="name">{{item.name}}</h2>
	                 <p class="desc">{{getDesc(item)}}</p>
	             </div>
	          </li>
	       </ul>
	    </div>
</template>





<script>
   export default{
     props:{
       songs:{
           type:Array,
           default:[]
       },
       rank:{  //是够展示序号
           type:Boolean,
           default:false
       }
     },
     methods:{
        selectItem(item,index){
           this.$emit('select',item,index);
        },
        getDesc(song){
           return `${song.singer}.${song.album}`;
        },
        getClass(index){
          //如果小于，等于2的话，设置样式为icon icon1,icon2,icon3
          //否则则是text
          if(index<=2){
            return `icon icon${index+1}`;
          }else{
            return 'text'; 
          }
        },
        getText(index){
           //如果大于2的话，则返回序列+1
           if(index>2){
             return index+1;
           } 
        }
     }
   }

</script>


<style scoped>
.song_list .item{
   display:flex;
   align-items:center;
   box-sizing:border-box;
   height:64px;	
}
.song_list .item .content{
	flex:1;
	line-height:20px;
  overflow:hidden;
  border-bottom:1px solid rgba(0,0,0,0.3);
}
.song_list .item .content .name{
  text-overflow:ellipsis;
  overflow:hidden;
  white-space:nowrap;
  font-size:16px;
  color:#fff;
  font-weight: 300;
  font-family:"宋体";
}
.song_list .item .content .desc{
  margin-top: 4px;
  text-overflow:ellipsis;
  overflow:hidden;
  white-space:nowrap;
  color:grey;
}
.rank{
   flex:0 0 25px;
   width:25px;
   margin-right:30px;
   text-align:center;
}
.text{
  color:#84817c;
  font-size:14px;
}
.icon{
    display:inline-block;
    width:25px;
    height:24px;
}
.icon1{
   background:url("./first.png") no-repeat 0 0;
   background-size:100%;
}
.icon2{
   background:url("./second.png") no-repeat 0 0;
   background-size:100%;
}
.icon3{
   background:url("./third.png") no-repeat 0 0;
   background-size:100%;
}
</style>