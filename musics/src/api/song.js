import jsonps from "jsonp"

export function getLyric(id){
   const url=`https://api.darlin.me/music/lyric/${id}`;  //这里是音乐歌词的api
   return new Promise((resolve,reject)=>{
   	  jsonps(url,{},(err,res)=>{
   	  	if(!err){
   	     resolve(res);
   	  	}
   	  	reject(err);
   	  })
   })
}