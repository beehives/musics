import storage  from "good-storage"

const SEARCH_KEY="__search__";
const search_length=15

const PLAY_HISTORY_KEY="__playhistory__";
const play_history=100;


function insertArray(arr,val,compare,maxLen){
   let index=arr.findIndex(compare);
    //如果是第一个不做任何操作
   if(index == 0){
   	  return ;
   }
   //如果不是第一个，删除掉
   if(index>0){
   	  arr.splice(index,1);
   }
   //把它放在数组的第一个
   arr.unshift(val);
   //如果超出范围，把数组末尾的一个值去掉
   if(maxLen && arr.length>maxLen){
   	 arr.pop();
   }

}

function deleteArray(arr,compare){
  let index=arr.findIndex(compare);
  if(index>-1){
     arr.splice(index,1);
  }
}


export function saveSearch(query){
   //这里的api是storage.get是获取到key为SEARCH_KEY,如果有的话,赋给变量,如果没有就返回一个空数组
   let searchCache = storage.get(SEARCH_KEY,[]);
   insertArray(searchCache,query,(item)=>{
   	return item==query;
   },search_length);
   storage.set(SEARCH_KEY,searchCache); //存入storage中
   return searchCache; //返回数组
}

export function loadSearch(){
	return storage.get(SEARCH_KEY,[]);
}

//删除数组中一项
export function deleteSearch(query){
   let searchCache=storage.get(SEARCH_KEY,[]);
   deleteArray(searchCache,(item)=>{
        return item===query;
   });
   storage.set(SEARCH_KEY,searchCache);
   return searchCache;
}


export function clearSearch(){
  storage.remove(SEARCH_KEY);  //清空数组
  return [];
}

//保存最近播放
export function savePlayHistory(song){
   let songs=storage.get(PLAY_HISTORY_KEY,[]);
   insertArray(songs,song,(item)=>{
    return item.id===song.id;
   },play_history);
   storage.set(PLAY_HISTORY_KEY,songs);
   return songs;
}

//读取最近播放
export function readPlayHistory(){
  return storage.get(PLAY_HISTORY_KEY,[]);
}

