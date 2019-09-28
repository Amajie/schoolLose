<template>
    <div id="login">
        <div class="header lr">
            <van-nav-bar
                title="车神登陆"
                @click-left="backToHome"
                @click-right="backToRegister"
            >
                <van-icon slot="right" color="#fff" >注册</van-icon>
                <van-icon slot="left" color="#fff" >首页</van-icon>
            </van-nav-bar>
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
import {mapMutations} from 'vuex'
export default {
    name: 'Login',
    data(){
        return {
            userName: '',
            password: '',
            remember: false,
            che_in: '',//cookie 用户名
            che_id: ''//cookie 密码
        }
    },
    created(){
        //记住密码自动登陆
        this.handleAuto()
    },
    methods:{
        ...mapMutations([
            'setState'
        ]),
        //返回首页按钮
        backToHome(){
            this.$router.replace('/').catch(error =>{
                console.log(error)
            })
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
            const {userName, remember, $router, $route, dAlert, dConfirm,
                tText, login, encrypt, cookie, che_in, che_id} = this

            let password = this.password

            if(!userName){
                return tText('用户名不能为空')
            }else if(!password){
                return tText('密码不能为空')
            }else if(che_in && che_id){
                password = che_id
            }else{
                password = encrypt(password)
            }

            login({
                userName,
                password,
                remember
            }).then(res =>{
                const {code, token} = res.data
                
                if(code === -1) return dAlert('该用户不存在')
                if(code === 1) return dConfirm('提示', '该用户还没有激活').then(() =>{
                    $router.replace({name: 'CheckEmail'})
                }).catch(() =>{

                    //清空输入内容
                    this.userName = ''
                    this.password = ''
                })

                if(code === 0) return dAlert('密码错误')
                
                // 设置token
                localStorage.setItem('token', token)

                // 此时跳转指定路由
                if($route.query.redirect){
                    $router.replace($route.query.redirect)
                }else{
                //否则跳转到首页
                    $router.replace('/home')
                }

                //没有记住密码 或者 cookie存在 无需设置 cookie 之后在跳转到首页
                if(!remember || (che_in && che_id)) return console.log('欢迎再次登陆')

                console.log('首次登陆')   
                // 设置 cookie
                cookie.set('che_in', encrypt(userName), 1200)
                cookie.set('che_id', password, 1200)
            })
        },

        /**
         * @function 处理自动登陆
         * 
         */
        handleAuto(){

            this.che_in = this.cookie.get('che_in')
            this.che_id = this.cookie.get('che_id')

            // cookie不存在 用户名 和密码 无需自动登陆
            if(!(this.che_in && this.che_id)) return

            //解密 自动 同步到文本框
            this.userName = this.decrypt(this.che_in)
            this.password = this.encrypt(this.che_id).slice(0, 13)//截取12显示即可

            this.remember = true//这里可以不设置
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