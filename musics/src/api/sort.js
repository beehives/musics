import {commonParams,options} from "./config"
import jsonp from "../common/js/jsonp"

//获取总榜单
export function getTopSongList(){
   const url="https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg";

   const data=Object.assign({},commonParams,{
   	 platform:'h5',
   	 needNewCode:1,
   	 _:new Date().getTime()
   });

   return jsonp(url,data,options);

}

//获取每个榜单的详情信息
export function getTopListDetail(topid){
  const url="https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg";

  const data=Object.assign({},commonParams,{
  	platform:"h5",
  	needNewCode:1,
  	tpl:3,
  	page:"detail",
  	type:"top",
  	_:new Date().getTime(),
  	topid:topid
  });

    //console.log(data);
   return jsonp(url,data,options);
}