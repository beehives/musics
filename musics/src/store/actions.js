import * as types from "./mutations_type"
import {RandomArray} from "../common/js/util"
import {saveSearch,deleteSearch,clearSearch,savePlayHistory} from "../common/js/cache"



function getIndex(list,song){
  return list.findIndex((item)=>{
  	  return item.id == song.id;
  });
}

export const selectPlay=function({commit,state},{list,index}){
  if(state.mode == 2){  //如果是随机播放的话，需要去随机化数组，且要得到该歌曲在随机数组的位置
    let list1=RandomArray(list);
    index=getIndex(list1,list[index]);
    commit(types.SET_PLAYLIST,list1);
  }else{
    commit(types.SET_PLAYLIST,list);
  }
  commit(types.SET_SEQUENCELIST,list);
  commit(types.SET_CURRENTINDEX,index);
  commit(types.SET_FULLSCREEN,true);
  commit(types.SET_PLAYING_STATE,true);
}

//随机播放列表的打乱
export const randomPlayMusic=function({commit,state},{list}){
  commit(types.SET_SEQUENCELIST,list);
  let randomList=RandomArray(list);
  commit(types.SET_PLAYMODE,2);
  commit(types.SET_PLAYLIST,randomList);
  commit(types.SET_CURRENTINDEX,0);
  commit(types.SET_FULLSCREEN,true);
  commit(types.SET_PLAYING_STATE,true);
}

export const insertSong=function({commit,state},song){
  //如果没有用slice的话，会报出警告，说不要在state外面去修改它，所有slice去赋值了一份
  let playlist=state.playlist.slice();
  let sequenceList=state.sequenselist.slice();
  let currentIndex=state.currentIndex;
  let currentSong=playlist[currentIndex];
  
  //查找是否有当前歌曲在播放列表中
  let fnindex=getIndex(playlist,song);
  
  currentIndex++;
  //把歌曲插入到播放列表中
  playlist.splice(currentIndex,0,song);
  if(fnindex>-1){
      //如果有歌曲在当前列表中，分两种情况一种是插入歌曲在后面的时候，则currentIndex--
      //一种是插入歌曲在前面的时候，因为已插入歌曲，所有fnindex++,在能找到
     if(currentIndex > fnindex){
        playlist.splice(fnindex,1);
        currentIndex--;
     }else{
        playlist.splice(fnindex+1,1);
     }
  }
  //找到当前歌曲在顺序列表中的位置+1
  let index=getIndex(sequenceList,currentSong)+1;
  //去查找在顺序列表中的song的索引值
  let fnindexs=getIndex(sequenceList,song);
  //添加进去
  sequenceList.splice(index,0,song);
  if(fnindexs>-1){
      if(fnindexs<index){
          sequenceList.splice(fnindexs,1);
      }else{
          sequenceList.splice(fnindexs+1,1);
      }
  }

  //提交mutations方法
  commit(types.SET_PLAYLIST,playlist);
  commit(types.SET_SEQUENCELIST,sequenceList);
  commit(types.SET_CURRENTINDEX,currentIndex);
  commit(types.SET_FULLSCREEN,true);
  commit(types.SET_PLAYING_STATE,true);

}


//保存历史
export const saveSearchHistory=function({commit},query){
  commit(types.SET_SEARCH_HISTORY,saveSearch(query));
}

//删除历史
export const deleteSearchHistory=function({commit},query){
   commit(types.SET_SEARCH_HISTORY,deleteSearch(query));
}
//清空所有历史
export const clearSearchHistory=function({commit}){
  commit(types.SET_SEARCH_HISTORY,clearSearch());
}

//删除歌曲
export const deleteSong=function({commit,state},song){
  let playlist=state.playlist.slice();
  let sequenceList=state.sequenselist.slice();
  let currentIndex=state.currentIndex;
  //从播放列表中删除
  let pindex=getIndex(playlist,song);
  playlist.splice(pindex,1);
  //从副本列表中删除
  let sindex=getIndex(sequenceList,song);
  sequenceList.splice(sindex,1);
  
  //如果当前索引大于歌曲的索引还要减一
  if(currentIndex>pindex || currentIndex ===playlist.length ){
     currentIndex--;
  }
  commit(types.SET_PLAYLIST,playlist);
  commit(types.SET_SEQUENCELIST,sequenceList);
  commit(types.SET_CURRENTINDEX,currentIndex);
  
  if(!playlist.length){
     commit(types.SET_PLAYING_STATE,false);
  }else{
    commit(types.SET_PLAYING_STATE,true);
  }
}


export const deleteAllSong=function({commit}){
  commit(types.SET_PLAYLIST,[]);
  commit(types.SET_SEQUENCELIST,[]);
  commit(types.SET_CURRENTINDEX,-1);
  commit(types.SET_PLAYING_STATE,false);
}

export const saveplayhistory=function({commit},song){
  commit(types.SET_PLAY_HISTORY,savePlayHistory(song));
}