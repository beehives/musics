import Vue from 'vue'
import Router from 'vue-router'
import Recommend from "../components/recommend/recommend"
import Singer from "../components/singer/singer"
import Sort from "../components/sort/sort"
import Search from "../components/search/search"
import singerDetail from　"../components/singer_detail/singer_detail"
import disc from "../components/disc/disc"
import topList from "../components/top_list/top_list"

Vue.use(Router)

export default new Router({
 mode:"history",
  routes: [
    {
      path:"/",
      redirect:"/recommend"
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children:[
          {
           path:':id',
           component:disc
          }
        ]
    },{
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children:[
        {
          path:":id",
          component:singerDetail
        }
      ]
    },{
      path: '/sort',
      name: 'Sort',
      component: Sort,
      children:[{
         path:':id',
         component:topList
      }]
    },{
      path: '/search',
      name: 'Search',
      component: Search,
      children:[
        {
          path:":id",
          component:singerDetail
        }
      ]
    }
  ]
})
