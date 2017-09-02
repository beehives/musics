import {playMode} from "../common/js/config"
import {loadSearch,readPlayHistory} from "../common/js/cache"

const state={
	singer:{},
	playing:false,
	playlist:[],
	sequenselist:[],
	fullScreen:false,
	currentIndex:-1,
	mode:playMode.sequence,
	disc:{},
	toplist:{},
	searchHistory:loadSearch(),
	playHistory:readPlayHistory()
}

export default state