<template>
    <div id="register">
        <!-- 注册信息填写 -->
        <div class="register-wrap">
            <div class="header lr">
                <van-nav-bar
                    title="注册"
                    @click-left="backToLogin"
                    @click-right="backToActive"
                >
                    <van-icon slot="right" color="#fff" >激活</van-icon>
                    <van-icon slot="left" color="#fff" >登陆</van-icon>
                </van-nav-bar>
            </div>
            <div class="logo">
                <img src="http://123.56.22.16:7070/logo/register.jpg" alt="">
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
                        clearable
                        size="large"
                        placeholder="请输入密码"
                    />

                    <van-field
                        v-model="email"
                        type="email"
                        label="邮箱"
                        required
                        clearable
                        size="large"
                        placeholder="请输入qq邮箱"
                    />
                </van-cell-group>
            </div>
            <div class="type">
                <!-- 默认选择学生 即radio为 0 -->
                <van-radio-group v-model="userType">
                    <van-cell-group>
                        <van-cell :title="student" clickable @click="userType = 1">
                            <van-radio slot="right-icon" :name="1" />
                        </van-cell>
                        <van-cell :title="teacher" clickable @click="userType = 2">
                            <van-radio slot="right-icon" :name="2" />
                        </van-cell>
                        <van-cell :title="friend" clickable @click="userType = 3">
                            <van-radio slot="right-icon" :name="3" />
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>       
            <div class="register-btn">
                <van-button @click.native="handleRegister" type="info" size="large">注册</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Register',
    data(){
        return{
            userName: '',
            password: '',
            email: '',
            userType: 1,
            student: '学生',           
            teacher: '老师',           
            friend: '访客',
            regEmail: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"),           
        }
    },
    methods:{
        //返回首页按钮
        backToLogin(){
           this.$router.replace('/login')
        },

        //前往登陆
        backToActive(){
            this.$router.replace('/cEmail')
        },
        
        // 处理注册 逻辑
        handleRegister(){

            //获取数据
            const {userName, password, email,
             userType, regEmail, $router, tText,
             dConfirm, dAlert, register,
             encrypt} = this
             
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
                password: encrypt(password),
                email,
                userType
            }).then(res =>{
                const {code} = res.data
                if(code === 1){
                    dAlert('该用户名已被使用，请您换一个再试试')
                }else if(code === 0){// 注册失败
                    dAlert('该电子邮箱已被使用，请您换一个再试试')
                }else if(code === 200){// 激活账户
                    dConfirm('提示', '注册成功，需要激活才能登陆，是否激活账号?').then(() =>{
                        // 把邮箱传递过去
                        $router.replace({name: 'CheckEmail', params: {email}})
                    }).catch(() =>{
                        this.userName = ''
                        this.password = ''
                        this.email = ''
                        this.userType = 1
                    })
                }else if(code === -1){// 注册失败
                    dAlert('注册失败，请稍后再试')
                }
            })
        }
      
    },
    beforeRouteEnter (to, from, next) {
        next(vm =>{
            vm.$store.commit('autoLogin', {vm, next})
        })
    }
}
</script>

<style lang="less" scoped>
#register{
    padding-bottom: 20px;
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
    }
}
</style>