import * as types from "./mutations_type"

const mutations={
  [types.SET_SINGER](state,singer){
        state.singer=singer;
  },
  [types.SET_PLAYING_STATE](state,flag){
       state.playing=flag;
  },
  [types.SET_FULLSCREEN](state,flag){
  	  state.fullScreen=flag;
  },
  [types.SET_PLAYLIST](state,list){
  	 state.playlist=list;
  },
  [types.SET_SEQUENCELIST](state,list){
  	 state.sequenselist=list;
  },
  [types.SET_PLAYMODE](state,status){
     state.mode=status;
  },
  [types.SET_CURRENTINDEX](state,index){
  	 state.currentIndex=index;
  },
  [types.SET_DISC](state,disc){
     state.disc=disc;
  },
  [types.SET_TOPLIST](state,toplist){
     state.toplist=toplist;
  },
  [types.SET_SEARCH_HISTORY](state,history){
      state.searchHistory=history;
  },
  [types.SET_PLAY_HISTORY](state,history){
      state.playHistory=history;
  }

  

}
export default mutations
 