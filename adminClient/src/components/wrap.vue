<template>
    <div id="wrap">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="1">待审核用户</el-menu-item>
            <el-menu-item index="2">待审核帖子</el-menu-item>
            <el-menu-item index="3">账户搜索</el-menu-item>
            <el-menu-item index="4">帖子搜索</el-menu-item>
            <el-menu-item index="5">数据管理</el-menu-item>
            <el-menu-item v-if="adminData.adminGrade === 1" index="che_hj">高级管理</el-menu-item>
            <el-menu-item v-else index="6">个人管理</el-menu-item>
        </el-menu>
        <router-view/>
    </div>
</template>
<script>
import {mapState} from 'vuex'
  export default {
    data() {
      return {
        activeIndex: '1',
      }
    },
    computed:{
      ...mapState(['adminData'])
    },
    created(){
      // 初始化一些数据
      console.log(this.adminData)
      this.handleCreate()
    },
    methods: {
      handleCreate(){
        const {params, meta} = this.$route
        this.activeIndex = params.key
      },
      handleSelect(key, keyPath) {
        const {prevKey, adminData, $router} = this
        if(prevKey === key) return console.log('重复点击')

        this.prevKey = key

        if(key === '1') return $router.replace(`/p/${key}`)
        if(key === '2') return $router.replace(`/e/${key}`)
        if(key === '3') return $router.replace(`/su/${key}`)
        if(key === '4') return $router.replace(`/si/${key}`)
        if(key === '5') return $router.replace(`/da/${key}`)
        if(key === '6') return this.$router.replace(`/che_gen`)
        // 只有高级管理员才能访问
        if(key === 'che_hj' && adminData.adminGrade === 1){
          $router.replace(`/che_hj`)
        }else{
          console.log('不能访问高级')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
#wrap{
  min-height: 100%;
}
</style>