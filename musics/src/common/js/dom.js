export function addClass(el,classNamez){
  if(hasClass(el,classNamez)){
  	return
  }
  let classNames=el.className.split(" ");
  classNames.push(classNamez);
  el.className=classNames.join(" ");
}

//判断是否有这个属性，el.className获取到所有该元素的类名
export function hasClass(el,classNamez){
  let text=new RegExp("(^|\\s)"+classNamez+"($|\\s)"); //这是判断开头，结尾或是隔着空格则在该类名
  if(text.test(el.className)){
  	return true;
  }
}


export function getClassValue(el,name,val){
   const prefix="data-";
   let names=prefix+name;
   if(val){
       return el.setAttribute(names,val);
   }else{
       return el.getAttribute(names);
   }
}