import {getLyric}  from "../../api/song"
import {ERROR_OK}  from "../../api/config"
import base64 from "js-base64"
export default class song {
  constructor({id,mid,singer,name,album,duration,image,url}){
  	this.id=id; 
  	this.mid=mid;
  	this.singer=singer;
  	this.name=name;
  	this.album=album;
  	this.duration=duration;  
    this.image=image;
  	this.url=url;
  }
   getLyric(){
     if(this.lyric){
       return Promise.resolve(this.lyric);
     }
     return new Promise((resolve,reject)=>{
         getLyric(this.id).then((res)=>{
               if(res.code == ERROR_OK){
                  let Base64=base64.Base64;
                  this.lyric=Base64.decode(res.lyric);
                  resolve(this.lyric); 
               }
               else{
                  reject("no lyric");
               }
         })
     })
    
  }
}

//这里是统一创建一个singer对象,image和url都是通过拼接出来的地址,所以一定要songmid和albummid
export function createSong(musicData){
  return new song({
  	id:musicData.songid,
  	mid:musicData.songmid,
    singer:filterSinger(musicData.singer),
    name:musicData.songname,
    album:musicData.albumname, 
    duration:musicData.interval,                    
    image:`https://y.gtimg.cn/music/photo_new/T002R150x150M000${musicData.albummid}.jpg?max_age=2592000`,
    url:`http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
} 

//这里是过滤singer歌唱者名字的函数
export function filterSinger(singer){
   let res=[];
   if(!singer){
   	 return '';
   }
   //singer为数组,去遍历数组，获取到对象中的name，由于歌曲有合唱歌曲，有多个或两个人，singer数组中不止一个对象，有多个对象
   singer.forEach((s)=>{
   	 res.push(s.name);
   })
   //这里是将歌唱者进行 薛之谦/王栎鑫 这样的展示出来
   console.log( res.join('/'));
   return res.join('/');
}