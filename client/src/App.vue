<template>
  <div id="app">
    <div class="loadingEntry loadFixed" v-show="showELoding">
      <div class="loading-wrap loadFixed">
        <van-loading :size="loadSize" text-size="15" color="#e80000">加载...</van-loading>
      </div>
    </div>
    <div class="loadingSend loadFixed" v-show="showSLoding">
      <div class="loading-wrap loadFixed">
        <div class="loadFixed">
          <van-loading type="spinner" :size="loadSize" color="#e80000" />
        </div>
      </div>
    </div>
    <router-view v-if="isFreshTag" />
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return{
      loadSize: 50,
      isFreshTag: true
    }
  },
  provide(){
    return {
      reload: this.reload
    }
  },
  computed: {
    showELoding () {
      return this.$store.state.lodingETag
    },
    showSLoding () {
      return this.$store.state.lodingSTag
    }
  },
  methods:{
    reload(){
      this.isFreshTag = false
      this.$nextTick(() =>{
        this.isFreshTag = true
      })
    },
   //数据的保存
    sateSave(){
      sessionStorage.setItem('c_state', JSON.stringify(this.$store.state))
    }
  },
  //监听刷新的时候 保存数据
  mounted() {
      window.addEventListener('unload', this.sateSave)
  },
}
</script>

<style lang="less" scoped>
#app {
  .loadingEntry{
    background-color: #fff;
    .loading-wrap{
      width: 50px;
      height: 50px;
    }
  }
  .loadingSend{
    .loading-wrap{
        width: 100px;
        height: 100px;
        background-color: rgba(0, 0, 0, 0.2);
        > div{
          width: 50px;
          height: 50px;
        }
    }
  }
}
</style>
