<template>
    <div ref="wrapper">
        <slot>
        </slot>
    </div>
</template>
<script>
import BScroll from "better-scroll"
   export default{
      props:{
         probeType:{
            type:Number,
            default:1
         },
         click:{
            type:Boolean,
            default:true
         },
         data:{
            type:Array,
            default:null
         },
         listenScroll:{
            type:Boolean,
            default:false
         },
         pullup:{
            type:Boolean,
            default:false
         },
         beforeScroll:{
            type:Boolean,
            default:false
         }
      },
      mounted(){
           setTimeout(()=>{
	           this.init_scroll();
           },20);
      },
      methods:{
          init_scroll(){
              if(!this.$refs.wrapper){
                  return;
              }
              this.scroll=new BScroll(this.$refs.wrapper,{
                 probeType:this.probeType,
                 click:this.click   
              });
              if(this.listenScroll){
                   this.listen();
              }
              if(this.pullup){
                 this.scroll.on("scrollEnd",()=>{
                    if(this.scroll.y<=(50+this.scroll.maxScrollY)){
                        this.$emit("scrollEnd");
                    }
                 })
                
              }
              if(this.beforeScroll){
                this.scroll.on("beforeScrollStart",()=>{
                     this.$emit("beforeScroll");
                });
              }
          },
          enable(){
             this.scroll && this.scroll.enable();
          },
          disable(){
             this.scroll && this.scroll.disable();
          },
          refresh(){
             this.scroll && this.scroll.refresh();
          },
          scrollTo(){
               this.scroll &&  this.scroll.scrollTo.apply(this.scroll,arguments);
          },
          scrollElement(){
              this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments);
          },
          listen(){
              this.scroll.on("scroll",(pos)=>{
                
                 this.$emit("scroll",pos);
             })
          }
      },
      watch:{
          data(){
             setTimeout(()=>{
               this.refresh();
             },20);
          }
      }

   }

</script>

<style>
</style>