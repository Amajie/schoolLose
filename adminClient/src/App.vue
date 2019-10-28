<template>
  <div id="adminApp"
    v-loading.fullscreen.lock="fullsLoad"
  >

    <router-view/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'App',
  computed:{
    ...mapState([
      'fullsLoad'
    ])
  }
}
</script>

<style>
#adminApp {

}
</style>
