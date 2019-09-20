<template>
    <div id="check">
        <div class="header">
            <van-nav-bar
                title="激活账户"
                left-text="取消"
                left-arrow
                size="large"
                @click-left="backToHome"
            />
        </div>
        <!-- 验证注册 -->
        <div class="wrap">
            <transition name="rl" mode="out-in">
                <div v-show="!countdownShow" class="email-wrap">
                    <div class="ip">
                        <van-cell-group>
                            <van-field v-model="email" clearable placeholder="请输入激活账户绑定的邮箱" />
                        </van-cell-group>
                    </div>
                    <div class="btn">
                        <van-button @click.native="handleEmail" type="info" :square="true" size="large">获取验证码</van-button>
                    </div>
                </div>
            </transition>
            <transition name="rl" mode="out-in">
                <div v-show="countdownShow" class="check-wrap">
                    <div class="check-code">
                        <van-cell-group>
                            <van-field clearable @input.native="getCheckText" v-model="checkCode" placeholder="请输入6位激活验证码" />
                        </van-cell-group>
                    </div>
                    <div class="check-btn">
                        <van-button type="primary" :disabled="confirmBtn" :square="true" size="large">激活</van-button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import {register} from '../../axios/api.js'
import {mapState, mapMutations} from 'vuex'
export default {
    name: 'Register',
    data(){
        return{
            email: '',//邮箱
            // 验证变量
            checkCode: '',//验证码
            countdownBtn: false,// 一开始是不可以点击的
            confirmBtn: true,// 一开始 确认按钮是不可以点击的 只有输入验证码长度够了 才可以点击 
            countdownText: '获取验证码',//倒计时文字
            countdownTime: 60,//倒计时时间
            checkLen: 6, //验证码长度
            countdownShow: false//是否显示 输入验证码界面 默认不显示
            
        }
    },
    created(){
        this.email = this.$route.params.email
    },
    computed:{
        ...mapState([
            'regEmail'
        ])
    },
    methods:{
        ...mapMutations([
            'dialogText',
            'toastText'
        ]),
        //返回首页按钮
        backToHome(){
            this.countdownShow = false
        },

        //前往登陆
        backToLogin(){
            this.$router.push('/login')
        },
        

        //发送邮箱
        handleEmail(){
            const {email, regEmail, toastText} = this

            //验证 邮箱输入是否正确
            if(!email){
                return toastText('请输入您的邮箱')
            }else if(!regEmail.test(email)){
                return toastText('邮箱格式不正确')
            }

            //发送请求

            this.countdownShow = true
        },

        //获取验证码 输入
        getCheckText(){

            const {checkCode, checkLen} = this
            //长度只能为 6 按钮才能点击
            if(checkCode.length === checkLen){
                return this.confirmBtn = false
            }else{
                this.confirmBtn = true
            }
        },
        //处理倒计时
        handleCountdown(){
            
            //获取倒计时时间
            let { countdownTime} = this
            this.countdownText = `倒计时 ${countdownTime}s`
            //每次调用该方法 都需要设置 倒计时按钮不可点击
            this.countdownBtn = true
            const _this = this

            const clearTime = setInterval(function(){
                
                //如果 倒计时为 0 即可以重新获取
                if(countdownTime === 0){

                    /*
                        1、关闭定时器
                        2、文字显示重新获取
                        3、按钮可点击
                    */

                    clearInterval(clearTime)
                    _this.countdownText = '重新获取'
                    _this.countdownBtn = false
                    return
                }

                //改变定时时间
                _this.countdownText = `倒计时 ${--countdownTime}s`

            }, 1000)
        }
    }
}
</script>

<style lang="less" scoped>
#check{
    .wrap{
        position: relative;
        .email-wrap{
            position: absolute;
            width: 100%;
        }
    }
}
.rl-enter{
    transform: translateX(100%);
}
.rl-leave-to{
    opacity: 0;
    position: absolute;
    transform: translateX(-100%);
}
.rl-enter-active,
.rl-leave-active{
    transition: transform 0.5s;
}
</style>