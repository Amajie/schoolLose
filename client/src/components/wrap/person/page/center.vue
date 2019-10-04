<template>
    <div id="center">
        <van-sticky>
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
            </div>
            <div class="c">
                <div class="center-wrap">
                    <div class="center">
                        <router-link to="/center" class="center-opa">
                            <van-row type="flex" justify="center">
                                <van-col span="6">
                                    <!-- 头像 -->
                                    <div class="item">
                                        <img class="hi" :src="userData.avater" />
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
                                    <div class="item" @click="loading=false">
                                        <icon name="concern" :w="svg" :h="svg"></icon>
                                    </div>
                                </van-col>
                            </van-row>
                        </router-link>
                    </div>
                </div>
            </div>
        </van-sticky>
        <div class="b">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                >
                <van-cell clickable>
                    <div class="shop_data_item">
                        <div class="item_img">
                            <img src="../../../../assets/logo1.jpg">
                        </div>
                        <div class="item_info">
                            <!-- 标题 -->
                            <div class="info_title">
                                <p>
                                    <span class="title_p">身份证</span>
                                    <span class="title_name">车神-黄杰</span>
                                </p>
                                <p class="info_like" style="background:red;">丢</p>
                            </div>
                            <!-- 评分 -->
                            <div class="info_rate">
                                <p class="rate_num">
                                    <icon name="desc" :w="15" :h="15"></icon>
                                    <span>
                                        暂无说明
                                    </span>
                                </p>
                            </div>
                            <!-- 配送 -->
                            <div class="info_tack">
                                <!-- <div class="user">
                                <icon name="phone" :w="12" :h="12"></icon>
                                <span>车神-黄杰</span>
                                </div> -->
                                <div class="tack_heng">
                                    <icon name="time" :w="15" :h="15"></icon>
                                <span>2019-12-12</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-cell>
                <van-cell clickable>
                    <div class="shop_data_item">
                        <div class="item_img">
                            <img src="../../../../assets/logo.jpg">
                        </div>
                        <div class="item_info">
                            <!-- 标题 -->
                            <div class="info_title">
                                <p>
                                    <span class="title_p">校园卡</span>
                                    <span class="title_name">车神-黄杰</span>
                                </p>
                                <p class="info_like">
                                    拾
                                </p>
                            </div>
                            <!-- 评分 -->
                            <div class="info_rate">
                                <p class="rate_num">
                                    <icon name="desc" :w="15" :h="15"></icon>
                                    <span>
                                        通过container属性可以指定组件的容器，
                                        页面滚动时，组件会始终保持在容器范围
                                    </span>
                                </p>
                            </div>
                            <!-- 配送 -->
                            <div class="info_tack">
                                <!-- <div class="user">
                                <icon name="phone" :w="12" :h="12"></icon>
                                <span>车神-黄杰</span>
                                </div> -->
                                <div class="tack_heng">
                                    <icon name="time" :w="15" :h="15"></icon>
                                <span>2019-12-12</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-cell>
                <van-cell clickable>
                    <div class="shop_data_item">
                        <div class="item_img">
                            <img src="../../../../assets/lose.png">
                        </div>
                        <div class="item_info">
                            <!-- 标题 -->
                            <div class="info_title">
                                <p>
                                    <span class="title_p">校园卡</span>
                                    <span class="title_name">车神-黄杰</span>
                                </p>
                                <p class="info_like">
                                    拾
                                </p>
                            </div>
                            <!-- 评分 -->
                            <div class="info_rate">
                                <p class="rate_num">
                                    <icon name="desc" :w="15" :h="15"></icon>
                                    <span>
                                        通过container属性可以指定组件的容器，
                                        页面滚动时，组件会始终保持在容器范围
                                    </span>
                                </p>
                            </div>
                            <!-- 配送 -->
                            <div class="info_tack">
                                <!-- <div class="user">
                                <icon name="phone" :w="12" :h="12"></icon>
                                <span>车神-黄杰</span>
                                </div> -->
                                <div class="tack_heng">
                                    <icon name="time" :w="15" :h="15"></icon>
                                <span>2019-12-12</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-cell>
            </van-list>
            <!-- <div class="info-wrap">
                <div class="info-list"> -->
                    <!-- 信息填写 -->
                    <!-- <van-cell-group>
                        <van-field
                            readonly
                            label="姓名"
                            v-model="userData.name"
                        />
                        <van-field
                            readonly
                            label="学号"
                            v-model="userData.stId"
                        />
                        <van-field
                            readonly
                            label="性别"
                            v-model="userData.gender"
                        />
                        <van-field
                            readonly
                            label="身份"
                            v-model="userData.userType"
                        />
                        <van-field
                            readonly
                            label="学院"
                            v-model="userData.courtyard"
                        />
                        <van-field
                            readonly
                            label="专业"
                            v-model="userData.major"
                        />
                        <van-field
                            readonly
                            label="班级"
                            v-model="userData.classes"
                        />

                        <van-field
                            readonly
                            label="宿舍地址"
                            v-model="userData.address"
                        />
                        <van-field
                            readonly
                            label="邮箱"
                            v-model="userData.email"
                        />
                    </van-cell-group>
                </div>
            </div> -->
        </div>
      
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return{
            svg: 30,
            list: [],
            loading: false,
            finished: false,
            num:4
        }
    },
    computed:{
        ...mapState([
            'userData'
        ])
    },
    created(){
        console.log(this.userData)
    },
    methods:{
        add_info(){
            this.$router.replace('/redata')
        },
         onLoad() {
            // 异步更新数据
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                this.list.push(this.list.length + 1)
                }
                // 加载状态结束
                this.loading = false

                // 数据全部加载完成
                if (this.list.length >= 40) {
                this.finished = true
                }
            }, 500)
        }
    }
}
</script>

<style lang="less" scoped>
#center{
    height: 100%;
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
    }
    .c{
        background-color: #ff0000;
        transition: all 10s;
        .center-wrap{
            .center{
                padding: 5px 0;
                .center-opa{
                    .item{
                        display: flex;
                        height: 100%;
                        flex-direction: column;
                        justify-content: center;
                        .hi{
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
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
      .info-wrap{
          padding: 0 1%;
          padding-bottom: 10px;
      }
      .shop_data_item{
            display: flex;
            padding-left: 10px;
            .item_img{
                flex: 1;
                > img{
                    width: 100%;
                }
            }
            .item_info{
                flex: 4;
                display: flex;
                flex-direction: column;
                > div{
                    display: flex;
                    padding: 1px 10px;
                    justify-content: space-between;
                }
                //标题
                .info_title{
                    font-size: 18px;
                    .title_p{
                        border-radius: 5px;
                        background: #ffec12;
                    }
                    .title_name{
                        font-weight: 700;
                        padding-left: 5px;
                    }
                    .info_like{
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        padding: 0 5px;
                        font-weight: 700;
                        background-color: #088fff;
                        border-radius: 10px;
                        color: #fff;
                    }
                }
                //评分
                .info_rate{
                    font-size: 12px;
                    .rate_num{
                        span{
                            margin: 0 3px;
                            line-height: 18px;
                            color: #666;
                        }
                    }
                }
                // 配送
                .info_tack{
                    font-size: 12px;
                    display: block;  
                    .tack_heng{
                        float: right;
                        padding-left: 10px;
                    }
                }
            }
        }
    }
}
</style>