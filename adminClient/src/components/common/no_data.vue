<template>
    <div id="no-data">
       <div class="no-wrap">
         <h2>{{showText}}</h2>
         <img src="../../assets/img/noData.png">
       </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {

    }
  },
  props:['showText']
}
</script>

<style lang="less" scoped>
  #no-data{
    .no-wrap{
      width: 200px;
      margin: 20px auto;
      > img{
        width: 100%;
      }
      h2{
        text-align: center;
      }
    }
  }
</style>