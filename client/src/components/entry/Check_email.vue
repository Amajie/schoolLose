<template>
    <div id="check">
        <div class="header r">
            <van-nav-bar
                title="激活账户"
                left-text="取消"
                size="large"
                @click-left="backReject"
            >
                <van-icon name="arrow-left" slot="left" size="2em" color="#fff" />
            </van-nav-bar>
        </div>
        <!-- 验证注册 -->
        <div class="wrap">
            <transition name="rl" mode="out-in">
                <div v-show="!checkTag" class="email-wrap">
                    <div class="ip">
                        <van-cell-group>
                            <van-field v-model="email" clearable placeholder="请输入激活账户绑定的邮箱" />
                        </van-cell-group>
                    </div>
                    <div class="btn">
                        <van-button @click.native="handleEmail" type="info" :square="true" block>获取验证码</van-button>
                    </div>
                </div>
            </transition>
            <transition name="rl" mode="out-in">
                <div v-show="checkTag" class="check-wrap">
                    <div class="check-code">
                        <van-cell-group>
                            <van-field clearable @input.native="getCheckText" v-model="checkCode" placeholder="请输入6位激活验证码" />
                        </van-cell-group>
                    </div>
                    <div class="check-btn">
                        <van-button type="primary" :disabled="confirmBtn" @click.native="handleCheckCode" :square="true" block>激活</van-button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>

export default {
    name: 'Register',
    data(){
        return{
            email: '',//邮箱
            checkId: '',//验证码查询标志 id
            // 验证变量
            checkCode: '',//验证码
            confirmBtn: true,// 一开始 确认按钮是不可以点击的 只有输入验证码长度够了 才可以点击 
            checkLen: 6, // 验证码长度
            checkTag: '',// 输入邮箱和验证码界面切换标志位
            regEmail: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
        }
    },
    created(){

        // 把当前电子邮件文本框设置为 注册页面传来的邮箱值
        // 先判断是否存在
        if(this.$route.params.email){
            this.email = this.$route.params.email
        }
    },
    methods:{

        /*
        *
        *@function 点击导航栏左按钮 是前往注册页面 还是获取验证码页面
        *@params checkTag false 注册页面
        *@params checkTag true 获取验证码页面
        * 
        */

        backReject(){
            const { checkTag, $router} = this

            //true 
            if(checkTag) return this.checkTag = ''
            //false
            $router.replace('/register')
        },

        /*
        *
        *@function 点击获取验证码按钮 获取验证码
        * 
        */
        handleEmail(){
            const {email, regEmail,  tText, dAlert, sendActiveCode} = this

            //验证 邮箱输入是否正确
            if(!email){
                return tText('请输入您的邮箱')
            }else if(!regEmail.test(email)){
                return tText('邮箱格式不正确')
            }

            //发送请求
            sendActiveCode({email}).then(res =>{
                const {code, checkId, checkTag} = res.data
                
                if(code === 0) return dAlert('该邮箱没有绑定用户，请确认后再试!')

                if(code === 1) return dAlert('该用户已经激活，无需重复激活!')

                if(code === 304) return dAlert('验证码已经发发送到该邮箱，请查看邮箱是否收到!')
                    .then(() =>{
                        this.checkTag = checkTag
                        this.checkId = checkId
                    })

                if(code === -1) return dAlert('获取验证码失败，请稍后再试!')

                if(code === 200)  return dAlert('验证码已经发送到该邮箱，请注意查收!')
                    .then(() =>{
                        this.checkTag = checkTag
                        this.checkId = checkId
                    })
            })
        },

        /*
        *
        *@function 点击激活按钮 激活账户
        * 
        */
        handleCheckCode(){

                
            this.changeData = JSON.stringify({
                userActive: true
            })
            
            this.$store.commit('handleCheckCode', this)
           
        },

        /*
        *
        *@function 验证用户输入的验证码是否达到 6位数
        *@params 达到 激活按钮可点击
        *@params 没达到 激活按钮不可点击
        * 
        */
        getCheckText(){

            const {checkCode, checkLen} = this
            //长度 不为6 按钮不能点击
            if(checkCode.length != checkLen) return this.confirmBtn = true

            //此时按钮可以点击
            this.confirmBtn = false

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
</style>