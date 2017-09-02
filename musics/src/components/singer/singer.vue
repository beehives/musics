<template>
   <div>
      <div class="singer" ref="singers">
         <listView :data="singers" @select="select" ref="listviews"></listView>
      </div>
      <router-view></router-view>
   </div>
</template>


<script>
import {getSinger} from "../../api/singer"
import {ERROR_OK}  from "../../api/config"
import singer from "../../common/js/singer"
import listView  from "../../base/listview/listview"
const HOT_TITLE="热门";
const HOT_LENGTH=10;
import {mapMutations} from "vuex"
import {playListMixin} from "../../common/js/mixin"

  export default{
      mixins:[playListMixin],
      data(){
         return{
           singers:[]
         }
      },
      components:{
         listView
      },
      created(){
          this.init_singer();
      },
      methods:{
         handlePlaylist(playlist){
           const bottom=playlist.length>0?"60px":"";
           this.$refs.singers.style.bottom=bottom;
           this.$refs.listviews.refresh();
          },
          select(singer){
             this.$router.push({
               path:`/singer/${singer.id}`
             });
             this.setsinger(singer);
          },
          init_singer(){
             getSinger().then((res)=>{
                 if(res.code === ERROR_OK){
                    this.singers=this.construct_singer(res.data.list);
                    console.log(this.construct_singer(res.data.list));
                 }
             })
          },
          construct_singer(list){
              let map={
                 hot:{
                   title:HOT_TITLE,
                   items:[]
                 }
              };
              //遍历数组存入相应的地方
              list.forEach((item,index)=>{
                 if(index<HOT_LENGTH){
                   map.hot.items.push(new singer({
                       id:item.Fsinger_id,
                       mid:item.Fsinger_mid,
                       name:item.Fsinger_name
                   }));
                 }
                 let key=item.Findex;
                 if(!map[key]){
                     map[key]={
                       title:key,
                       items:[]
                     }
                 }
                 map[key].items.push(new singer({
                       id:item.Fsinger_id,
                       mid:item.Fsinger_mid,
                       name:item.Fsinger_name
                 }));
              })

              //得到未经排序的数组
              console.log(map);
              
              //处理数组，按照热门,a,b,c来排序
              // 先遍历数组，按title进行分组
              let hot=[];
              let res=[];
              for(let key in map){
                  let value=map[key];
                   if(value.title.match(/[a-zA-Z]/)){
                       res.push(value);
                   }else if(value.title == HOT_TITLE){
                       hot.push(value);
                   }
              }
              //这里是根据unicode大小来进行排序，按照a-z的方式，升序的方式
              res.sort((a,b)=>{
                   return a.title.charCodeAt(0)-b.title.charCodeAt(0);
              });
              //返回热门在前面，其他a-z的在后面
              return hot.concat(res);

          },
          ...mapMutations({
             setsinger:"SET_SINGER"
          })
      }

  }
</script>


<style scoped>
.singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
    overflow:hidden;
}


</style>