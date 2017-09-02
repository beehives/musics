import {commonParams,options} from "./config"
import jsonp from "../common/js/jsonp"

//获取当前搜索热门关键词
export function getHotKey(){
	const url="https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg";
    
    const data=Object.assign({},commonParams,{
    	platform:'h5',
    	needNewCode:1,
    	notice:0
    });

    return jsonp(url,data,options);
}


//通过热门关键词进行查询

export function search(query,page,zhida) {
	 const url="https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp";

	 const data=Object.assign({},commonParams,{
	 	platform:"h5",
		needNewCode:1,
		w:query,
		zhidaqu:1,
		catZhida: zhida?1:0,
		t:0,
		flag:1,
		ie:"utf-8",
		sem:1,
		aggr:0,
		perpage:20,
		n:20,
		p:page,
		remoteplace:'txt.mqq.all'
	 });

	 return jsonp(url,data,options);
}