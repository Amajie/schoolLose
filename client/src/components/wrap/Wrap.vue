<template>
    <div id="wrap">
        <router-view />
        <van-tabbar
            fixed
            route
            v-model="active">
            <van-tabbar-item replace to='/home' name="home" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item replace to='/examine' name="examine" icon="chat-o">帖子</van-tabbar-item>
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
    height: 100%;
}
</style>