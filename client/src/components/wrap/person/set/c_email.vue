<template>
    <div id="chang-email">
        <div class="header g">
            <van-nav-bar
                title="修改邮箱"
                @click-left="$router.replace('/set')"
                left-arrow
            >
                <van-icon name="arrow-left" slot="left" size="1.5em" color="#fff"/>
            </van-nav-bar>
        </div>
        <div class="change-wrap">
            <div class="change-info">
                <van-cell-group>
                    <van-field
                        v-model="password"
                        type="password"
                        label="密码"
                        size="large"
                        placeholder="请输入密码"
                        required
                        clearable
                    />
                </van-cell-group>
                <van-cell-group>
                    <van-field
                        v-model="email"
                        type="email"
                        label="新邮箱"
                        size="large"
                        placeholder="请输入新邮箱"
                        required
                        clearable
                    />
                </van-cell-group>
                <van-button @click.native="changeEmail" type="danger" square block>确认</van-button>
            </div>
            <div class="change-code">

            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            email: '',
            password: '',
            regEmail: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
        }
    },

    methods:{
        changeEmail(){
            const {email, password, cEmail, tText, dAlert,
             regEmail, encrypt, $router, setState, cookie} = this
            //验证 用户填写的信息是否正确
            if(!password){
                return tText('密码不能为空')
            }else if(!email){
                return tText('邮箱不能为空')
            }else if(!regEmail.test(email)){
                return tText('邮箱格式不正确')
            }


            // return dAlert('测试账号不能修改').then(() =>{
            //     this.$router.go(-1)
            // })
            
            //发送请求
            cEmail({
                email, 
                password: encrypt(password)
            }).then(res =>{

                const {code} = res.data

                if(code === 1) return tText('该用户不存在')
                if(code === 0) return tText('密码输入错误')
                if(code === -1) return tText('修改失败，请稍后再试')
                dAlert('修改邮箱成功，需要重新激活').then(() =>{
                    // 删除 cookie c_che_token
                    // 删除 c_state
                    cookie.remove('c_che_token')
                    sessionStorage.removeItem('c_state')
                    $router.replace({name: 'CheckEmail', params: {email}})
                })
            })
            

        }
    }
}
</script>

<style lang="less" scoped>
#chang-email{

}
</style>