<template>
    <div id="setting">
        <div class="header r">
            <van-nav-bar
                title="设置"
                @click-left="$router.replace('/person')"
                left-arrow
                :border="false"
            >
                <van-icon name="arrow-left" slot="left" size="2em" color="#fff" />
            </van-nav-bar>
        </div>
        <div class="cell-nav">
            <div class="cell-list">
                <div class="cell-item">
                    <img src="../../../../assets/set/c_user.png" alt="">
                    <van-cell to='/cn' title-class="text" title="修改用户名" is-link>
                        <van-icon
                            slot="right-icon"
                            name="arrow"
                            color="#969799"
                            style="line-height: inherit;"
                        />
                    </van-cell>
                </div>
                <div class="cell-item">
                    <img src="../../../../assets/set/c_password.png" alt="">
                    <van-cell to='/cp' title-class="text" title="修改密码" is-link>
                        <van-icon
                            slot="right-icon"
                            name="arrow"
                            color="#969799"
                            style="line-height: inherit;"
                        />
                    </van-cell>
                </div>
                <div class="cell-item">
                    <img src="../../../../assets/set/c_email.png" alt="">
                    <van-cell @click.native="changeEmail" title-class="text" title="修改邮箱" is-link>
                        <van-icon
                            slot="right-icon"
                            name="arrow"
                            color="#969799"
                            style="line-height: inherit;"
                        />
                    </van-cell>
                </div>
                <div class="cell-item">
                    <img src="../../../../assets/set/c_info.png" alt="">
                    <van-cell to="/ci" title-class="text" title="个人信息" is-link>
                        <van-icon
                            slot="right-icon"
                            name="arrow"
                            color="#969799"
                            style="line-height: inherit;"
                        />
                    </van-cell>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    data(){
        return{}
    },
    created(){

        // this.userData.name && !this.userData.authory && this.checkAuthory().then(res =>{
        //     const {code, authory, passStep} = res.data
        //     if(code != 200) return
        //     this.setState({userData: {...this.userData, authory, passStep}})
        // })
    },
    computed:{
        ...mapState([
            'userData'
        ])
    },
    methods:{
        ...mapMutations([
            'setState'
        ]),
        changeEmail(){
            this.dConfirm('提示', '一旦修改成功，需要重新激活账号才能登陆，是否继续？')
            .then(() =>{
                this.$router.push('/ce')
            })
            .catch(() =>{})
        }
    }
}
</script>

<style lang="less" scoped>
#setting{
    height: 100%;
    background-color: #f5f5f5;
    .cell-nav{
        padding: 0 2%;
        margin-top: 10px;
        // cell 列表
        .cell-list{
            .cell-item{
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                margin: 10px 0;
                .text{
                    font-size: 19px;
                    color: #333;
                    padding-left: 30px;
                }
                img{
                    position: absolute;
                    left: 0;
                    top: 50%;
                    margin-left: 10px;
                    margin-top: -15px;
                    width: 30px;
                    height: 30px;
                    z-index: 10;
                }
            }
        }
    }
}
</style>