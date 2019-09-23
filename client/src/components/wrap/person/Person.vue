<template>
    <div id="person">
        <div class="header">
            <van-nav-bar
                @click-left="add"
                @click-right="add"
            >
                <van-icon name="add-o" slot="right" size="2em" color="#fff" />
                <van-icon name="setting-o" slot="left" size="2em" color="#fff" />
            </van-nav-bar>
        </div>
        <div class="p-wrap">
            <!-- 登陆注册头像 -->
            <div class="p-person">
                <router-link to="/login" class="p-person-opa">
                    <van-row type="flex" justify="center">
                        <van-col span="8">
                            <!-- 头像 -->
                            <div class="peoson_img">
                                <img src="../../../assets/init.png" alt="">
                            </div>
                        </van-col>
                        <van-col span="16">
                              <!--未登陆显示信息 -->
                              <div class="person_info">
                                  <h2 class="t">车神-黄杰</h2>
                              </div>
                        </van-col>
                    </van-row>
                </router-link>
            </div>
            <div class="cell-nav">
                <div class="nav-wrap">
                    <div class="nav-list">
                        <div @click="add" class="nav-item">
                            <p>12</p>
                            <span>失主发布</span>
                        </div>
                    
                        <div class="nav-item">
                            <p>0</p>
                            <span>拾主发布</span>
                        </div>
                    
                        <div class="nav-item">
                            <p>56</p>
                            <span>我的关注</span>
                        </div>
                    </div>
                </div>
                <div class="cell-wrap">
                    <div class="cell-list">
                        <div class="cell-item">
                            <router-link to="/collect">
                                <p><icon name="collect" :w="svgWH" :h="svgWH"></icon></p>
                                <p class="text">我的收藏</p>
                                <p><van-icon size="20" color="#ccc" name="arrow"/></p>
                            </router-link>
                        </div>
                        <div class="cell-item">
                            <router-link to="/about">
                                <p><icon name="about" :w="svgWH" :h="svgWH"></icon></p>
                                <p class="text">投诉建议</p>
                                <p><van-icon size="20" color="#ccc" name="arrow"/></p>
                            </router-link>
                        </div>
                        <div class="cell-item">
                            <router-link to="/complaint">
                                <p><icon name="complaint" :w="svgWH" :h="svgWH"></icon></p>
                                <p class="text">关于车神寻物</p>
                                <p><van-icon size="20" color="#ccc" name="arrow"/></p>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="logout-wrap" @click="logoutCount">   
                    <van-button type="danger" size="large">退出当前帐号</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            svgWH: 25,
        }
    },
    methods:{
        add(){
            alert('设置或者添加')
        },

        /**
         * @function 退出当前登陆
         *  1 退出当前账号 不只是路由的跳转
         *  2 还有信息的清除
         * 
         */
        logoutCount(){
            this.$router.replace('/login')
        }
    }
}
</script>
<style lang="less" scoped>
#person{
    height: 100%;
    background: #f5f5f5;
    overflow: auto;
    .p-wrap{
        padding-bottom: 88px;
         .p-person{
            background: #008fff;
            padding: 15px;
            .p-person-opa{

                .peoson_img{
                    > img{
                        width: 100%;
                        max-width: 85px;
                    }
                }
                .person_info{
                    display: flex;
                    height: 100%;
                    flex-direction: column;
                    justify-content: center;
                    .t{
                        color: #ebedf0;
                    }
                }
            }
        }
        .cell-nav{
            padding: 0 2%;
            margin-top: 10px;
            // 列表导航栏
            .nav-wrap{
                text-align: center;
                .nav-list{
                    display: flex;
                    background: #ffffff;
                    border-radius: 10px;
                    .nav-item{
                        flex: 1;
                        height: 100%;
                        padding: 10px 0;
                        span{
                            color: #a5a5a6;
                            font-size: 13px;
                        }
                        p{
                            display: block;
                            padding-bottom: 5px;
                            font-weight: 700;
                            font-size: 20px;
                            color: #333333;
                        }
                    }
                }
            }
            // cell 列表
             .cell-wrap{
                .cell-list{
                    .cell-item{
                        border-radius: 10px;
                        overflow: hidden;
                        margin: 10px 0;
                        a{
                            display: flex;
                            width: 100%;
                            background: #fff;
                            padding: 12px 0;
                            padding-left: 10px;
                            box-sizing: border-box;
                            border-bottom: 1px solid #f6f6f6;
                            //每一行的样式
                            p{
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                            }
                            .text{
                                flex: 5;
                                font-size: 20px;
                                color: #333;
                                padding-left: 10px;
                            }
                            i{
                                display: flex;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>