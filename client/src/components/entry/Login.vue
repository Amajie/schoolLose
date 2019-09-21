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
                    v-model="userName"
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
                    clearable
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
            <van-button @click.native="handleLogin" type="info" size="large">登陆</van-button>
        </div>
    </div>
</template>

<script>
import {register} from '../../axios/api.js' 
export default {
    name: 'Login',
    data(){
        return {
            userName: '',
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

        /**
         * @function 处理登陆逻辑                                    
         * 
         */
        handleLogin(){
            
            //获取数据
            const {userName, password, remember,
                tText, login} = this
            if(!userName){
                return tText('用户名不能为空')
            }else if(!password){
                return tText('密码不能为空')
            }

            login({
                userName,
                password,
                remember
            }).then(res =>{
                console.log(res)
            })

        },

         //测试axios的拦截器
        api(){

           localStorage.setItem('token', 'che-hj')
            
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