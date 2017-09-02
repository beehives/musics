// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload  from "vue-lazyload"

import "common/stylus/index.styl"

import fastClick from "fastclick"
import store from "./store/index"
//快速点击
fastClick.attach(document.body);

//懒加载组件,preload比例为1.3倍，加载图片（loading）
Vue.use(VueLazyload,{
   preLoad:1.3,
   loading:require("./assets/default.png")
});


Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
