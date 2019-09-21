<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    console.log(this.dAlert)
  },

}
</script>

<style>
#app {

}
</style>
