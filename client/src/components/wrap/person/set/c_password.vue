<template>
    <div id="chang-password">
        <div class="header g">
            <van-nav-bar
                title="修改密码"
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
                        v-model="oldPassword"
                        required
                        type="password"
                        clearable
                        label="旧密码"
                        size="large"
                        placeholder="请输入当前密码"
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
                <van-button type="danger" square block @click.native="changePaw">修改</van-button>
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
            oldPassword: '',
            password: ''
        }
    },
    methods:{
        changePaw(){
            const {password, oldPassword, cPaw, tText, 
            cookie, encrypt, $router} = this

            if(!password){
                return tText('密码不能为空')
            }else if(password.length < 8){
                return tText('新密码长度过短')
            }else if(password.length > 16){
                return tText('新密码长度过长')
            }else if(password === oldPassword){
                return tText('新密码不能和当前密码相同')
            }

            // tText('修改密码成功')
            // $router.go(-1)
            // return

            cPaw({
                password: encrypt(password),
                oldPassword: encrypt(oldPassword)
            }).then(res =>{
                const {code} = res.data
                if(code === 1) return tText('该用户不存在')
                if(code === 0) return tText('当前输入密码错误')
                if(code === -1) return tText('修改密码失败，请稍后再试')
                tText('修改密码成功')
                cookie.get('c_che_id') && cookie.set('c_che_id', encrypt(password))
                $router.go(-1)
            })
        }
    }
}
</script>