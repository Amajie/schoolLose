<template>
    <div id="register">
        <!-- 注册信息填写 -->
        <div class="register-wrap">
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
                        v-model="userName"
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
                <van-radio-group v-model="userType">
                    <van-cell-group>
                        <van-cell title="学生" clickable @click="userType = '0'">
                            <van-radio slot="right-icon" name="0" />
                        </van-cell>
                        <van-cell title="老师" clickable @click="userType = '1'">
                            <van-radio slot="right-icon" name="1" />
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>       
            <div class="register-btn">
                <van-button @click.native="handleRegister" type="info" size="large">注册</van-button>
            </div>
            <div class="active-user">
                <router-link to="/cemail">账户激活</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import {register} from '../../axios/api.js'
import {mapState} from 'vuex'
import {dConfirm, dAlert, tText} from '../vant/vant.js'
export default {
    name: 'Register',
    data(){
        return{
            userName: '车神-黄杰',
            password: 'huang661775',
            email: '2291945117@qq.com',
            userType: '0'           
        }
    },
    computed:{
        ...mapState([
            'regEmail'
        ])
    },
    methods:{
        //返回首页按钮
        backToHome(){
           tText('nnn')
        },

        //前往登陆
        backToLogin(){
            this.$router.push('/login')
        },
        
        // 处理注册 逻辑
        handleRegister(){

            //获取数据
            const {userName, password, email,
             userType, regEmail, $router} = this

            //验证 用户填写的信息是否正确
            if(!userName){
                return tText('用户名不能为空')
            }else if(!password){
                return tText('密码不能为空')
            }else if(!email){
                return tText('邮箱不能为空')
            }else if(userName.length < 4){
                return tText('用户名长度过小')
            }else if(userName.length > 10){
                return tText('用户名长度过长')
            }else if(password.length < 8){
                return tText('密码长度过短')
            }else if(password.length > 16){
                return tText('密码长度过长')
            }else if(!regEmail.test(email)){
                return tText('邮箱格式不正确')
            }

            // 以下即为发送注册请求
            
            register({
                userName,
                password,
                email,
                userType
            }).then(res =>{
                const {code} = res.data
                if(code === 0){
                    dAlert('用户名或者邮箱已被使用，请您换一个再试试')
                }else if(code === 200){// 激活账户
                    dConfirm('提示', '注册成功，需要激活才能登陆，是否激活账号?').then(() =>{
                        // 把邮箱传递过去
                        $router.replace({name: 'CheckEmail', params: {email}})
                    }).catch(() =>{
                        console.log('此时需要清空文本框')
                    })
                }else if(code === -1){// 注册失败
                    dAlert('注册失败，请稍后再试')
                }
            })
        }
      
    }
}
</script>

<style lang="less" scoped>
#register{
    .register-wrap{
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
        .active-user{
            text-align: right;
            margin: 10px 0;
            padding-right: 2%;
        }
    }
}
</style>