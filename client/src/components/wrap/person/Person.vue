<template>
    <div id="person">
        <div class="header">
            <van-nav-bar
                left-text="设置"
            />
        </div>
        <div class="p-wrap">
                        <!-- 个人中心 -->
            <div class="p_person">
                <router-link to="/login" class="p_person_opa">
                        <!-- 头像 -->
                    <div class="peoson_img">
                        <img src="../../../assets/init.png" alt="">
                    </div>
                    
                    <!--未登陆显示信息 -->
                        <div class="person_info_login">
                            <h2>登录/注册</h2>
                            <p>
                                <span><van-icon size="20" name="award-o" color="#fff" /></span>
                                登陆后进行更多操作
                            </p>
                    </div>

                        <!-- 箭头 -->
                    <div class="person_icon">
                        <p>
                            <van-icon color="#fff" size="30" name="arrow"/>
                        </p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{

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
         .p_person{
            background: #008fff;
            padding: 20px;
            .p_person_opa{
                display: flex;
                //头像
                .peoson_img{
                    flex: 2;
                    margin-right: 20px;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    > img{
                        width: 100%;
                        border-radius: 50%;
                    }
                }
                //登陆信息
                .person_info_login{
                    flex: 5;
                    h2{
                        color: #fff;
                    }
                    p{
                        color: #fff;
                        font-size: 15px;
                        padding: 10px 0;
                        display: flex;
                        span{
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                        }
                    }
                }

                //箭头
                .person_icon{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
            }
        }
    }
}
</style>