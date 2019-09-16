<template>
    <div id="login">
        <div class="header">
            <van-nav-bar
                title="车神登陆"
                left-text="首页"
                right-text="注册"
                left-arrow
                @click-left="backToHome"
                @click-right="backToRegister"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
     methods:{
        //返回首页按钮
        backToHome(){
            alert('hj')
        },
        //前往登陆
        backToRegister(){
            this.$router.push('/register')
        }
    }
}
</script>

<style lang="less" scoped>

</style>