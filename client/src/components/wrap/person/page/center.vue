<template>
    <div id="center">
        <div class="t">
            <div class="header">
                <div @click="$router.replace('/person')" class="right">
                    <icon name="left_arrow" :w="svg" :h="svg"></icon>
                </div>
                <div class="seach">
                    <van-search
                        placeholder="请输入搜索关键词"
                        shape="round"
                        background="#ff0000"
                    />
                </div>
                <!-- 这个要根据是主人还是 访客显示不同的图标 -->
                <!-- <div @click="$router.replace('/person')" class="left">
                    <icon name="tip" :w="svg" :h="svg"></icon>
                </div> -->
                <div @click="add_info" class="left">
                    <icon name="add_info" :w="svg" :h="svg"></icon>
                </div>
            </div>
            <div class="center-wrap">
                <div class="center">
                    <router-link to="/center" class="center-opa">
                        <van-row type="flex" justify="center">
                            <van-col span="6">
                                <!-- 头像 -->
                                <div class="item">
                                    <img src="../../../../assets/init.png" alt="">
                                </div>
                            </van-col>
                            <van-col span="12">
                                <!--未登陆显示信息 -->
                                <div class="item">
                                    <p class="un">
                                        车神-黄杰
                                    </p>
                                </div>
                            </van-col>
                            <van-col span="3">
                                <!--关注 -->
                                <div class="item">
                                    <icon name="concern" :w="svg" :h="svg"></icon>
                                </div>
                            </van-col>
                        </van-row>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="b">
            <van-tabs background="#ff0000" color="#008fff"
            :border="false" v-model="active" animated
            title-inactive-color="#e0e0e0" title-active-color="#fff"
            :sticky="true"
            >
                <van-tab title="丢失发布">
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>sadsd</p>
                    <p>werew</p>
                </van-tab>
                <van-tab title="拾获发布">内容 2</van-tab>
                <van-tab title="个人信息">内容 3</van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            svg: 30,
            active: 0
        }
    },
    methods:{
        add_info(){
            alert('添加数据')
        }
    }
}
</script>

<style lang="less" scoped>
#center{
    .t{
        background-color: #ff0000;
        .header{
            display: flex;
            padding: 0 7px;
            .seach{
                flex: 1;
            }
            .right{
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .left{
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }
        .center-wrap{
            .center{
                padding: 5px 0;
                .center-opa{
                    .item{
                        display: flex;
                        height: 100%;
                        flex-direction: column;
                        justify-content: center;
                         > img{
                            width: 100%;
                            max-width: 60px;
                        }
                        .un{
                            color: #ebedf0;
                            font-size: 20px;
                        }
                    }
                }
            }
        }
    }
    .b{
        
    }
}
</style>