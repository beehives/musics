# musics  关于仿写慕课上面的音乐播放器
## 项目缺陷（由于个人技术有限，无法爬取到主页面的歌单api，以把它写死成请求同一个歌手形式）
## 此东西里面的api是QQ音乐的，请自行去爬取

 启动命令为 npm run dev
 
  打包为 npm run build

 
主要是用了vue-cli来搭建环境，vue-router处理路由，jsonp跨域请求,axios来进行refer仿造，vuex来进行状态管理
以及 base64来进行歌词转码，以及lyric-parse来进行歌词的滚动
 
项目的base文件下是基础组件,api下是请求，components下是处理业务逻辑的组件，store是状态管理仓库

main.js是主程序入口

index.html是主界面
 

  
