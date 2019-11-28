<template>
    <div id="login">
        <div class="header lr">
            <van-nav-bar
                title="车神登陆"
                @click-right="$router.replace('/register')"
            >
                <van-icon slot="right" color="#fff" >注册</van-icon>
            </van-nav-bar>
        </div>
        <div class="logo">
            <img src="http://123.56.22.16:7070/logo/login.jpg" alt="">
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
                <router-link to="/forgetpaw">忘记密码?</router-link>
            </div>
        </div>
         <div class="login-btn">
            <van-button @click.native="handleLogin" type="info" size="large">登陆</van-button>
        </div>
    </div>
</template>

<script>
import {register} from '../../axios/api.js'
import {mapMutations, mapState} from 'vuex'
export default {
    name: 'Login',
    data(){
        return {
            userName: '',
            password: '',
            remember: false,
            c_che_in: '',//cookie 用户名
            c_che_id: '',//cookie 密码
            maxTime: 60*60*24*30,// 记住密码 cookie保存30天
            minTime: 60*60*4 // 没记住密码 cooie保存4个小时
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
        /**
         * @function 处理登陆逻辑                                    
         * 
         */
        handleLogin(){

            //获取数据
            const {userName, remember, sendLogin, tText, encrypt, c_che_in, c_che_id} = this

            let password = this.password

            if(!userName){
                return tText('用户名不能为空')
            }else if(!password){
                return tText('密码不能为空')
            }else if(c_che_in && c_che_id){
                password = c_che_id
            }else{
                password = encrypt(password)
            }

            // 发送登陆请求
            sendLogin(userName, password, remember)
        },
        
        // 发送登陆请求
        sendLogin(userName, password, remember){
            //获取数据
            const {$router, $route, dAlert, dConfirm, c_che_token, c_che_in, c_che_id,
                login, encrypt, cookie, maxTime, minTime, setState} = this

            login({
                userName,
                password,
                remember
            }).then(res =>{
                const {code, token, userData, courtyardData, type_nav} = res.data
                
                if(code === -1) return dAlert('该用户不存在')
                if(code === -2) return dAlert('该账户已被冻结，请联系管理员解冻').then(() =>{
                    //清空输入内容
                    this.userName = ''
                    this.password = ''
                    this.remember = false
                })

                if(code === 1) return dConfirm('提示', '该用户还没有激活，或者邮箱已修改，尚未激活，是否前往激活').then(() =>{
                    $router.replace({name: 'CheckEmail'})
                }).catch(() =>{

                    //清空输入内容
                    this.userName = ''
                    this.password = ''
                    this.remember = false
                })

                if(code === 0) return dAlert('密码错误')

                //设置保存在 store 的个人信息
                setState({
                    userData,
                    courtyardData,
                    type_nav
                })

                // 获取是否记住密码
                if(cookie.get('c_che_remeber')){// 记住
                    // 已设置无需重复设置
                    if(!(c_che_token && c_che_in && c_che_id)){
                        cookie.set('c_che_token', token, minTime)
                        cookie.set('c_che_in', encrypt(userName), maxTime)
                        cookie.set('c_che_id', password, maxTime)
                    }

                }else{// 不记住
                    // 已设置无需重复设置
                    if(!c_che_token){
                        cookie.set('c_che_token', token, minTime)
                    }
                }

                // 此时跳转指定路由
                const path = $route.query.redirect? $route.query.redirect: '/home'
                // 跳转
                $router.replace(path)
            })
        },

        /**
         * @function 处理自动登陆
         * 
         */
        handleAuto(){
            const {cookie, $route} = this
            // 此时不是记住密码  删除cookie 信息       
            if(!cookie.get('c_che_remeber')){
                cookie.remove('c_che_in')
                cookie.remove('c_che_id')
                cookie.remove('c_che_token')
                return
            }
            

            // 记住密码获取数据 填充到文本框中
            this.c_che_in = this.cookie.get('c_che_in')
            this.c_che_id = this.cookie.get('c_che_id')
            this.c_che_token = this.cookie.get('c_che_token')

            // cookie不存在 用户名 和密码 无需自动登陆
            if(!(this.c_che_in && this.c_che_id)) return

            //解密 自动 同步到文本框
            this.userName = this.decrypt(this.c_che_in)
            this.password = this.encrypt(this.c_che_id).slice(0, 13)//截取12显示即可

            // 默认 本来就记住密码 登陆后新打开窗口之后 默认记住密码
            this.remember = true
        },
        clearCookie(){
            const {cookie, $store} = this
            cookie.remove('c_che_token')
            sessionStorage.removeItem('c_state')
            $store.replaceState(JSON.parse(sessionStorage.getItem('c_empty_state')))
        }
        
    },
    watch:{
        remember(newData){
            if(newData){
                this.cookie.set('c_che_remeber', true)
                return
            }else{
                this.cookie.remove('c_che_remeber')
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        /**
         * 这里判断 是否存在cookie 和sessionStor
         *  1 cookie存在 说明还在登陆着 此时应该直接跳转到首页
         *      1 sessionStor 存在 则同一页面访问登陆路由 直接跳转首页
         *      2 sessionStor 不存在 判断cookie的用户名以及密码存在与否 
         *          调用自动登陆函数
         *  2 cookie不存在
         *    清空 内容 sessionStor 以及初始化state
         */
        
        next(vm =>{
            const {cookie, sendLogin, decrypt, $store, clearCookie} = vm
            const token = cookie.get('c_che_token')
            const name = cookie.get('c_che_in')
            const paw = cookie.get('c_che_id')
            // token存在
            if(token && name && paw){
                console.log('存在token')
                sendLogin(decrypt(name), paw)
            //token不存在 或者 token存在 但是用户名 密码不存在 删除cookie信息
            }else if(!token || !(name && paw)){
                console.log('不存在token')
                clearCookie()
            }
        })
    },
    mounted(){
      !sessionStorage.getItem('c_empty_state') && sessionStorage.setItem('c_empty_state', JSON.stringify(this.$store.state))
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