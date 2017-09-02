<template>
  <div id="app">
      <headers></headers>
      <tabs></tabs>
      <keep-alive>
         <router-view></router-view>
      </keep-alive>
      <player></player>
  </div>
</template>

<script>
import headers from "../src/components/header/header"
import tabs from "../src/components/tab/tab"
import player from "../src/components/play/play"
export default {
  components:{
  headers,tabs,player
  }
}
</script>

<style>
#app {

}

</style>
