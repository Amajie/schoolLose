<template>
     <div id="chang-name">
        <div class="header g">
            <van-nav-bar
                title="修改用户名"
                @click-left="() => $router.replace('/set')"
                left-arrow
            >
                <van-icon name="arrow-left" slot="left" size="1.5em" color="#fff"/>
            </van-nav-bar>
        </div>
        <div class="change-wrap">
            <div class="change-info">
                <van-cell-group>
                    <van-field
                        v-model="userName"
                        required
                        clearable
                        label="新用户名"
                        size="large"
                        placeholder="请输入您的新用户名"
                    />
                </van-cell-group>
                <van-button type="danger" square block @click.native="changeName">修改</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
    data(){
        return{
           userName: ''
        }
    },
    methods:{
        
        ...mapMutations([
            'setUserData'
        ]),
        changeName(){
            const {userName, cName, tText, setUserData} = this

            //验证 用户名是否输入正确
            if(!userName){
                return tText('用户名不能为空')
            }else if(userName.length < 4){
                return tText('用户名长度过小')
            }else if(userName.length > 10){
                return tText('用户名长度过长')
            }

            cName({
                userName,
            }).then(res =>{
                const {code} = res.data

                if(code === 0) return tText('您来迟一步啦，该用户名已经被人抢咯')
                if(code === -1) return tText('修改失败，请稍后再试')
                
                tText('修改用户名成功')
                setUserData({...this.$store.state.userData, userName})
            })
        }
    }
}
</script>

<style lang="less" scoped>

</style>