<template>
    <div id="setting">
        <div class="header r">
            <van-nav-bar
                title="设置"
                @click-left="() => $router.replace('/person')"
                left-arrow
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
                    <img src="../../../../assets/person/collect.png" alt="">
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
                    <img src="../../../../assets/person/about.png" alt="">
                    <van-cell to="/ce" title-class="text" title="修改邮箱" is-link>
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
            <div class="logout-wrap" @click="logoutCount">   
                <van-button type="info" block>退出当前帐号</van-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{}
    },
    methods:{
        logoutCount(){
            const {text} = this

            text({name: '车神-黄杰'}).then(res =>{
                console.log(res)
            })
        }
    }
}
</script>

<style lang="less" scoped>
#setting{
    height: 100%;
    background-color: #f5f5f5;
     .cell-nav{
         height: 100%;
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
                    z-index: 100000;
                }
            }
        }
    }
}
</style>