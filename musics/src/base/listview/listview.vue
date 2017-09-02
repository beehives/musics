<template>
  <scroll  :data="data"  class="listview" ref="listview" :listenScroll="listenScroll" @scroll="liandong" :probeType="probeType">
     <ul>
        <li v-for="group in data" class="list-group" ref="groups">
             <h2 class="list-group-title">{{group.title}}</h2>
             <ul>
                <li v-for="item in group.items" @click="selectItem(item)" class="list-group-item">
                   <img  v-lazy="item.img" class="img" />
                   <span class="name">{{item.name}}</span>
                </li>
             </ul>
        </li>
     </ul>
     <div class="list-shortcut" @touchstart="moveTo($event)" @touchmove.stop.prevent="Tmove">
        <ul>
            <li v-for="(item,index) in shortIcon" class="item" :data-index="index" :class="{'current':currentIndex === index}"> 
               {{item}}
            </li>
        </ul>
     </div>
     <div class="list-fixed" v-show="fixedTtile" ref="fixedTtile">
          <div class="fixed-title">{{fixedTtile}}</div>
     </div>
     <loading class="loading-container" v-show="!data.length">
     </loading>
  </scroll>
</template>

<script>
import scroll from "../scroll/scroll"
import {getClassValue} from "../../common/js/dom"
import loading from "../loading/loading"
export default{
    created(){
        this.touch={};    //存放touch事件的值
        this.listenScroll=true;  //是否监听滚动
        this.height=[];    //这是存放所有group高度的地方
        this.probeType=3;  //当值为3的时可以快速滚动
    },
    data(){
       return{
         scrollY:-1,
         currentIndex:0,
         diffY:-1
       }
    },
	props:{
	  data:{
	     type:Array,
	     default:[]
	  }
	},
	components:{
	  scroll,loading
	},
	computed:{
       shortIcon(){
          return this.data.map((group)=>{
              return group.title.substr(0,1);
          });
       },
       fixedTtile(){
          if(this.scrollY>=0){
            return "";
          }
          return this.data[this.currentIndex]?this.data[this.currentIndex].title:"";
       }  
	},
	methods:{
        refresh(){
          this.$refs.listview.refresh();
        },
	      selectItem(item){
             this.$emit("select",item);
	      },
          moveTo(e){
              //获取到当前index
              let anotherIndex=parseInt(getClassValue(e.target,"index"));
              //获取到当前y轴距离
              this.touch.y1=e.touches[0].pageY;
              this.touch.index=anotherIndex;
              //console.log(e.touches[0].pageY);
            
              //console.log(this.height);
              //console.log(this.height[anotherIndex]);
              //滚动到那个元素位置
              this._move(anotherIndex);
           },
           Tmove(e){
               this.touch.y2=e.touches[0].pageY;
               let distant=this.touch.y2-this.touch.y1;
               //console.log(e.touches[0].pageY);
               //计算距离有几个标签
               let oindex=parseInt(this.touch.index)+Math.floor(distant/20);
               //console.log(oindex);
               this._move(oindex);
           },
           _move(index){
                 if(!index&&index!==0){
                    return ;
                 }
                 if(index<0){
                   index=0;
                 }else if(index>this.height.length-2){
                   index=this.height.length-2;
                 }

                 console.log(index);
                 this.scrollY=-this.height[index];
                 this.$refs.listview.scrollElement(this.$refs.groups[index],0);
           },
           liandong(pos){
                //这里的pos有两个值一个是x,y
                this.scrollY=pos.y;
          },
          calculateHeight(){
               this.height=[];
               let height=0;
               let list=this.$refs.groups;
               this.height.push(height);
               //这里数组长度是23,实际长度为22，下标是从零开始0-21个
               for(let i=0;i<list.length;i++){
                  height+=list[i].clientHeight;
                  this.height.push(height);
               }
               //console.log(this.height);
          }
          },
          watch:{
             data(){
               setTimeout(()=>{
	               this.calculateHeight();  //当有数据时，才开始算每个group的高度
               },20);
             },
             scrollY(newY){
               // console.log(newY);   
                //监听scrollY的变化,由于滚动是负值，所以要加-来比较，当到顶部后，在往上拉，则是正数
                const listHeight=this.height;
                if(newY>0){
                   this.currentIndex=0;
                   return;
                }
                for(let i=0;i<listHeight.length-1;i++){
                  let height1=listHeight[i];
                  let height2=listHeight[i+1];
                  if(-newY>=height1&&-newY<height2){
                    console.log(i);
                    this.diffY=height2+newY;  //这里算的是那个下限距离顶置的东西的距离
                    this.currentIndex=i;
                    return ;
                  }
                  this.currentIndex=listHeight.length-2;  //这个是右边条的个数
                }
             },
             diffY(newVal){
                 let WY=0;
                 //当小于它的样式距离了，开始向上走
                 if(newVal>0&&newVal<30){
                    WY=newVal-30;
                 }else{
                    WY=0;
                 }
                 //这里是防止多次去走动画
                 if(this.wy == WY){
                   return ;
                 }
                 this.wy=WY;
                 this.$refs.fixedTtile.style.transform=`translate3d(0,${this.wy}px,0)`;
             }

          }
}

</script>



<style scoped>
.listview{
	position:relative;
	width:100%;
	height:100%;
	overflow:hidden;
} 
.listview .list-group{
	padding-bottom:30px;
}
.listview .list-group .list-group-title{
	height:30px;
	line-height:30px;
    padding-left:20px;
    font-size:16px;
    color:rgba(255, 255, 255, 0.5);
    background-color:#333;
    font-family:"宋体";
}
.list-group-item{
	display:flex;
    align-items: center;
    padding: 20px 0 0 30px;
}
.list-group-item .img{
	width: 50px;
    height: 50px;
    border-radius: 50%;
}
.list-group-item .name{
	 margin-left:20px;
     color:rgba(255, 255, 255, 0.5);
    font-size:14px;
}
.list-shortcut{
  position: absolute;
  z-index: 30;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background:rgba(0, 0, 0, 0.3);
  font-family: Helvetica;
  list-style:none;
}
.list-shortcut .item{
    padding: 3px;
    line-height: 1;
    color:rgba(255, 255, 255, 0.5);
    font-size:14px;
    list-style:none;

}      
 .list-shortcut .current{
  color:#ffcd32;
 }
         
.list-fixed{
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
}
.fixed-title{
    height: 30px;
    line-height:30px;
    padding-left:20px;
    font-size:16px;
    color:rgba(255, 255, 255, 0.5);
    background-color:#333;
}    
.loading-container{
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
 }
  
</style>