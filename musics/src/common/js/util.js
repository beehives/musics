function getRandom(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

//这是一个数组打乱函数
export function RandomArray(arr){
	let arr1=arr.slice();
    for(let i=0;i<arr1.length;i++){
    	let index=getRandom(0,i);
        let value=arr1[i];
        arr1[i]=arr1[index];
        arr1[index]=value;
    }
    return arr1;
}