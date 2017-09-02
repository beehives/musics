import jsonp from "../common/js/jsonp"
import jsonps from "jsonp"
import {commonParams,options} from "./config"
import axios from "axios"

//轮播图请求的api
export function getRecommend(){
	const url="https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
	const data=Object.assign({},commonParams,{
		platform:"h5",
		uin:0,
		needNewCode:1,
		_:new Date().getTime()
	})
    return jsonp(url,data,options)
}

//获取歌单的方法，这里由于是Json获取，在qq那边设置了请求限制，这里用了axios先请求服务器
//在从服务器去伪造主机和域名去请求数据
export function getSongList(){
    const data=Object.assign({},commonParams,{
		platform:"h5",
		uin:0,
		needNewCode:1,
		_:new Date().getTime(),
		format:'json'
	})
    return axios.get("/api/getGelist",{
		    	params:data
		    }).then((datas)=>{
                return  Promise.resolve(datas.data.data.songList);
		    }).catch((e)=>{
		    	console.log("error");
		    })
 
}


//歌单信息
export function getGeDan(disstid){
   
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';

  const data = Object.assign({}, commonParams, {
    platform:"h5",
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    nosign:1,
    platform: 'h5',
    needNewCode: 1,
    new_format:1,
    _:new Date().getTime(),
    disstid
  })

 return jsonp(url,data,options);

}

