<template>
    <div id="login">
        <div class="header lr">
            <van-nav-bar
                title="车神登陆"
                @click-right="backToRegister"
            >
                <van-icon slot="right" color="#fff" >注册</van-icon>
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
import {mapMutations, mapState} from 'vuex'
export default {
    name: 'Login',
    data(){
        return {
            userName: '',
            password: '',
            remember: false,
            c_che_in: '',//cookie 用户名
            c_che_id: ''//cookie 密码
        }
    },
    created(){
        //记住密码自动登陆
        this.handleAuto()
        console.log(this.$route.params.logoutTag)
    },
    computed:{
        ...mapState([
            'remeberCount'
        ])
    },
    methods:{
        ...mapMutations([
            'setState'
        ]),
        //前往注册
        backToRegister(){
            this.$router.replace('/register')
        },

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
                login, encrypt, cookie, setState} = this

            login({
                userName,
                password,
                remember
            }).then(res =>{
                const {code, token, userData, courtyardData, type_nav} = res.data
                console.log(userData)
                
                if(code === -1) return dAlert('该用户不存在')
                if(code === -2) return dAlert('该账户已被冻结，请联系管理员解冻').then(() =>{
                    //清空输入内容
                    this.userName = ''
                    this.password = ''
                    this.remember = false
                })
                if(code === 1) return dConfirm('提示', '该用户还没有激活').then(() =>{
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

                // 如果c_che_token c_che_in c_che_id 存在无需再次设置
                if(!(c_che_token && c_che_in && c_che_id)){
                    cookie.set('c_che_token', token, 1200)
                    cookie.set('c_che_in', encrypt(userName), 1200)
                    cookie.set('c_che_id', password, 1200)
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
            const {remeberCount, cookie, $route} = this

            // 此时不是记住密码  删除cookie 信息
            // 此时 如果已经登陆 但是再开新窗口访问 不应该删除cookie信息
            
            if(!remeberCount && sessionStorage.getItem('e_empty_state')){
                cookie.remove('c_che_in')
                cookie.remove('c_che_id')
                cookie.remove('c_che_token')
                return
            }
            
            // 此时 又退出账号 sessionStor数据没有 此时又没记住密码 会继续往下执行
            // 解决: 如果是 点击退出账号按钮 退出登陆 传递是否记住密码标志
            // true 即可继续往下执行
            // 新问题：
            //  但是 如果新的窗口打开此时 没有传递值 
            //  因此 如果没有token 不会因为上一次记住密码 
            //  新窗口也会记住密码
            if(!$route.params.logoutTag) return

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
        }
    },
    watch:{
        remember(newData){
            this.setState({
                remeberCount: newData
            })
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
            const {cookie, sendLogin, decrypt, $store} = vm
            const token = cookie.get('c_che_token')
            const name = cookie.get('c_che_in')
            const paw = cookie.get('c_che_id')
            const sessionStor = sessionStorage.getItem('c_state')
            // 存在
            if(token){
                console.log('存在token')
                if(sessionStor){
                    next('/home')
                }else{
                    if(name && paw)
                        sendLogin(decrypt(name), paw)
                }
            //不存在
            }else{
                console.log('不存在token')
                sessionStorage.removeItem('c_state')
                $store.replaceState(JSON.parse(sessionStorage.getItem('c_empty_state')))
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