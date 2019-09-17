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
        <div class="logo">
            <img src="../../assets/logo1.jpg" alt="">
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
                    placeholder="请输入用户名或者邮箱"
                />

                <van-field
                    v-model="password"
                    type="password"
                    label="密码"
                    required
                    size="large"
                    placeholder="请输入密码"
                />
            </van-cell-group>
        </div>
        <div class="remember-forget">
            <div class="remember">
                <van-checkbox v-model="remember">记住我</van-checkbox>
            </div>
            <div class="forget">
                <router-link to="/couont">忘记密码?</router-link>
            </div>
        </div>
         <div class="login-btn">
            <van-button @click.native="api" type="info" size="large">登陆</van-button>
        </div>
    </div>
</template>

<script>
import {register} from '../../axios/api.js' 
export default {
    name: 'Login',
    data(){
        return {
            username: '',
            password: '',
            remember: false
        }
    },
    methods:{
        //返回首页按钮
        backToHome(){
            alert('hj')
        },
        //前往登陆
        backToRegister(){
            this.$router.push('/register')
        },
         //测试axios的拦截器
        api(){

            const data = {
                name: '车神-黄杰',
                age: 23
            }
            
            register(data).then(res =>{
                console.log(res)
            })
            
        }
    }
}
</script>

<style lang="less" scoped>
#login{
    > div{
        padding: 0 1%;
    }
    .header{
        padding: 0;
    }
    .logo{
        img{
           display: block;
           width: 35%;
           margin: 20px auto; 
        }
    }
    .remember-forget{
        margin: 20px 0;
        overflow: hidden;
        .forget{
            float: right;
            a{
                color: #323233;
            }
        }
        .remember{
            float: left;
        }
    }
    .login-btn{
        margin-top: 10px;
    }
}
</style>