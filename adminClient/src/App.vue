<template>
  <div id="adminApp"
    v-loading.fullscreen.lock="fullsLoad"
  >

    <router-view/>
    <p class="copyright">Copyright © 车神寻物网 All Rights Reserved.</p>
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
  },
  methods:{
     //数据的保存
      sateSave(){
        sessionStorage.setItem('a_state', JSON.stringify(this.$store.state))
      }
  },
  //监听刷新的时候 保存数据
  mounted() {
      window.addEventListener('unload', this.sateSave)
  },
}
</script>

<style>
#adminApp {

}
</style>
