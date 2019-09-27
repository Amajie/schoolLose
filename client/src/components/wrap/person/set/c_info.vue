<template>
    <div id="change-info">
        <div class="header g">
            <van-nav-bar
                title="个人信息"
                @click-left="() => $router.replace('/set')"
                left-arrow
            >
                <van-icon name="arrow-left" slot="left" size="1.5em" color="#fff"/>
            </van-nav-bar>
        </div>
        <h1>个人信息修改</h1>
    </div>
</template>
<script>
export default {
    data(){
        return{}
    }
}
</script>
<style lang="less" scoped>
#change-info{}
</style>