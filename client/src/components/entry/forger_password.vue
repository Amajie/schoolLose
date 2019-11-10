<template>
    <div id="forget-password">
        <div class="header g">
            <van-nav-bar
                title="密码找回"
                @click-left="backReject"
                left-arrow
            >
                <van-icon name="arrow-left" slot="left" size="1.5em" color="#fff"/>
            </van-nav-bar>
        </div>
        <div class="forgete-wrap">
            <transition name="rl" mode="out-in">
                <div v-show="!checkTag" class="forgete-info">
                    <van-cell-group>
                        <van-field
                            v-model="email"
                            required
                            type="email"
                            clearable
                            label="邮箱"
                            size="large"
                            placeholder="请输入邮箱"
                        />

                        <van-field
                            v-model="password"
                            type="password"
                            clearable
                            label="新密码"
                            size="large"
                            placeholder="请输入新密码"
                            required
                        />
                    </van-cell-group>
                    <van-button type="danger" square block @click.native="forgetePaw">修改</van-button>
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
    data(){
        return{
            email: '2291945117@qq.com',
            password: '77777777',
            checkCode: '',
            checkTag: '',
            confirmBtn: true,
            checkLen: 6,
            regEmail: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
        }
    },
    methods:{

        // 发送验证码
        forgetePaw(){
            const {password, email, sendForgetPawCode,
                tText, dAlert, regEmail, encrypt, $router} = this
            if(!email){
                return tText('邮箱不能为空')
            }else if(!regEmail.test(email)){
                return tText('邮箱格式不正确')
            }else if(!password){
                return tText('密码不能为空')
            }else if(password.length < 8){
                return tText('新密码长度过短')
            }else if(password.length > 16){
                return tText('新密码长度过长')
            }

            // 发送请求
            sendForgetPawCode({
                email
            }).then(res =>{
                const {code, checkId, checkTag} = res.data
                
                if(code === 0) return dAlert('该邮箱没有绑定用户，请确认后再试!')

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
        
        // 点击修改按钮 修改密码
        handleCheckCode(){

            const {encrypt, password} = this
            this.changeData = JSON.stringify({
                password: encrypt(password)
            })
            this.$store.commit('handleCheckCode', this)
        },

        // 验证用户输入的验证码是否达到 6位数
        getCheckText(){

            const {checkCode, checkLen} = this
            //长度 不为6 按钮不能点击
            if(checkCode.length != checkLen) return this.confirmBtn = true

            //此时按钮可以点击
            this.confirmBtn = false

        },


        backReject(){
            const { checkTag, $router} = this

            //true 
            if(checkTag) return this.checkTag = ''
            //false
            $router.go(-1)
        },
    },
    beforeRouteEnter (to, from, next) {
        next(vm =>{
            vm.$store.commit('autoLogin', {vm, next})
        })
    }
}
</script>

<style lang="less" scoped>
#forget-password{
    .forgete-wrap{
        position: relative;
        .forgete-info{
            position: absolute;
            width: 100%;
        }
    }
}
</style>