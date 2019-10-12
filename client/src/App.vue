<template>
  <div id="app">
    <div class="loadingEntry p" v-show="showELoding">
      <div class="loading-wrap p">
        <van-loading :size="loadSize" text-size="15" color="#e80000">加载...</van-loading>
      </div>
    </div>
    <div class="loadingSend p" v-show="showSLoding">
      <div class="loading-wrap p">
        <div class="p">
          <van-loading type="spinner" :size="loadSize" color="#e80000" />
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return{
      loadSize: 50
    }
  },
  computed: {
    showELoding () {
      return this.$store.state.lodingETag
    },
    showSLoding () {
      return this.$store.state.lodingSTag
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  .p{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 10000000000;
  }
  .loadingEntry{
    background-color: #fff;
    .loading-wrap{
      width: 50px;
      height: 50px;
    }
  }
  .loadingSend{
    z-index: 10000000000;
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
