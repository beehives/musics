import jsonp from "../common/js/jsonp"
import {commonParams,options} from "./config"

export function getSinger(){
   const url="https://c.y.qq.com/v8/fcg-bin/v8.fcg";

   var data=Object.assign({},commonParams,{
       channel:"singer",
       page:"list",
       key:"all_all_all",
       pagesize:100,
       pagenum:1,
       loginUin:0,
       hostUin:0,
       platform:"yqq",
       needNewCode:0
   });
   return jsonp(url,data,options);
}


export function getSingerDetail(singerId){
   const url="https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg";

   var data=Object.assign({},commonParams,{
     begin:0,
     order:'listen',
     uin:0,
     platform:'h5page',
     from:'h5',
     singerid:singerId
   });

   return jsonp(url,data,options);
}