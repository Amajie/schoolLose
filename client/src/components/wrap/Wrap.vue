<template>
    <div id="wrap">
        <router-view />
        <van-tabbar
            fixed
            route
            safe-area-inset-bottom
            v-model="active">
            <van-tabbar-item replace to='/home' name="home" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item replace to='/info' name="info" icon="chat-o">消息</van-tabbar-item>
            <van-tabbar-item replace to='/person' name="person" icon="setting-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
    data(){
        return{
            active: 'home'
        }
    }
}
</script>

<style lang="less" scoped>
#wrap{

}
</style>