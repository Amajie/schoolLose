<template>
    <div id="register">
        <div class="header">
            <van-nav-bar
                title="注册"
                left-text="首页"
                right-text="登陆"
                left-arrow
                @click-left="backToHome"
                @click-right="backToLogin"
            />
        </div>
        <div class="logo">
            <img src="../../assets/logo.jpg" alt="">
        </div>
        <div class="from">
            <!-- 用户名 -->
            <van-cell-group>
                <van-field
                    v-model="username"
                    required
                    clearable
                    label="用户名"
                    size="large"
                    placeholder="请输入用户名"
                />

                <van-field
                    v-model="password"
                    type="password"
                    label="密码"
                    required
                    size="large"
                    placeholder="请输入密码"
                />

                 <van-field
                    v-model="email"
                    type="email"
                    label="邮箱"
                    required
                    size="large"
                    placeholder="请输入qq邮箱"
                />
            </van-cell-group>
        </div>
        <div class="type">
            <!-- 默认选择学生 即radio为 0 -->
            <van-radio-group v-model="radio">
                <van-cell-group>
                    <van-cell title="学生" clickable @click="radio = '0'">
                        <van-radio slot="right-icon" name="0" />
                    </van-cell>
                    <van-cell title="老师" clickable @click="radio = '1'">
                        <van-radio slot="right-icon" name="1" />
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
        </div>       
        <div class="register-btn">
            <van-button type="info" size="large">注册</van-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Register',
    data(){
        return{
            username: '',
            password: '',
            email: '',
            radio: '0'
        }
    },
    methods:{
        //返回首页按钮
        backToHome(){
            alert('hj')
        },
        //前往登陆
        backToLogin(){
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less" scoped>
#register{
    .logo{
        img{
           display: block;
           width: 35%;
           margin: 20px auto; 
        }
    }
    .from{
        padding: 0 1%;
    }
    .register-btn{
        padding: 0 1%;
        margin-top: 10px;
    }
}
</style>