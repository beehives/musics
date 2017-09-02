export const singer=(state)=> state.singer;


export const playing=state => state.playing;

export const playlist=state =>state.playlist;

export const fullScreen=state =>state.fullScreen;

export const currentIndex=state=>state.currentIndex;

export const mode=state=>state.mode;

export const sequenselist=state=>state.sequenselist;


export const currentSong = state=>{
	return state.playlist[state.currentIndex] || {};
}


export const disc =  state => state.disc;

export const toplist = state => state.toplist;

export const searchHistory=state=>state.searchHistory;

export const playHistory= state=>state.playHistory;
