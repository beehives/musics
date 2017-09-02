import jsonps from "jsonp"

export default function jsonp(url,data,options){
   url+=(url.indexOf("?")<0?"?":"")+params(data);

   // 返回Promise对象，带有data
  return new Promise((resolve, reject) => {
    jsonps(url, options,(err,data)=>{
      if (!err) {
        resolve(data)
      }else {
        reject(err)
      }
    })
  })
}

//拼接data
function params (data) {
	var url="";
	for(var k in data){
      var value=data[k]!="undefined"?data[k]:"";
      url+=`&${k}=${data[k]}`;
	}
	url=url?url.substring(1):"";
	return url;
}
