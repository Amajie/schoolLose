<template>
    <div id="home">
        <div class="header">
            <van-sticky>
                <div class="seach">
                    <van-search
                        placeholder="请输入搜索关键词"
                        shape="round"
                        background="#008fff"
                    />
                </div>
                <div class="left">
                    <div v-if="isLogin" class="active-no">
                        <span>登陆</span>
                    </div>
                    <div v-if="!isLogin" class="active">
                        <icon name="user_active" :w="svg" :h="svg"></icon>
                    </div>
                </div>
            </van-sticky>
        </div>
        <div class="nav-wrap">
            <div class="nav-list">
                <van-grid clickable :column-num="4">
                    <van-grid-item :to="item.url" v-for="(item, key, index) in type_nav" :key="index">
                        <icon :name="item.name" :w="svg" :h="svg"></icon>
                        <span>{{key}}</span>
                    </van-grid-item>
                </van-grid>
            </div>
        </div>
        <div class="info-list">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                :immediate-check="false"
                >
                <van-cell @click.native="toDetail(index)" clickable v-for="(item, index) in homeData" :key="index">
                    <div class="shop_data_item">
                        <div class="item_img">
                            <van-image
                                width="100"
                                height="100"
                                fit="cover"
                                radius="5"
                                :src="item.objectImg[0]"
                            />
                        </div>
                        <div class="item_info">
                            <!-- 标题 -->
                            <div class="info_title">
                                <p>
                                    <span class="title_p">{{item.objectType}}</span>
                                    <span @click.stop="toUserCenter(index)" class="title_name">{{item.userName}}</span>
                                </p>
                                <p :class="{info_like: true, lose: item.objectWay === '0'}">{{item.objectWay === '0'? '丢': '拾'}}</p>
                            </div>
                            <!-- 描述 -->
                            <div class="info_desc">
                                <p class="desc-content">
                                    <icon name="desc" :w="15" :h="15"></icon>
                                    <span>{{item.objectDesc}}</span>
                                </p>
                            </div>
                            <!-- 配送 -->
                            <div class="info_tack">
                                <div class="user">
                                    <icon name="center_object" :w="12" :h="12"></icon>
                                    <span>{{item.objectName}}</span>
                                </div>
                                <div class="tack_heng">
                                    <icon name="center_time" :w="15" :h="15"></icon>
                                <span>{{item.sendTime | showTime}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-cell>
            </van-list>
        </div>  
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data(){
        return{
            svg: 35,
            isLogin: false,
            homeData: [],
            loading: false,
            finished: false,
        }
    },
    created(){
        this.getHomeData()
    },
    computed:{
        ...mapState([
            'type_nav'
        ])
    },
    methods:{
        getHomeData(){
            this.gHomeInfo().then(res =>{
                const {code, homeData} = res.data
                this.homeData = homeData
                console.log(homeData)
            })
        },
        // 前往详细信息页面
        toDetail(index){
            /**
             * 跳转到详情页 以下数据可通过 homeData获取
             *  1 用户的 cheId id
             *  2 信息的 objectId id
             */
            const {cheId, objectId} = this.homeData[index]
            this.$router.push(`/c/detail/${cheId}/${objectId}`)
        },
        // 前往详细信息页面
        toUserCenter(index){
            /**
             * 跳转到详情页 以下数据可通过 homeData获取
             *  1 用户的 cheId id
             *  2 信息的 objectId id
             */
            const {cheId, objectId} = this.homeData[index]
            this.$router.push(`/c/center/${cheId}`)
        },
        onLoad(){
            console.log('加载')
        }
    },
    filters:{
        showTime(time){
            const data = new Date(Number(time))
            return `${data.getFullYear()}-${('0'+data.getMonth()).slice(-2)}-${('0'+data.getDate()).slice(-2)}`
        }
    }
}
</script>

<style lang="less" scoped>
#home{
    .header{
        
        .seach{
            flex: 1;
        }
        .left{
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-right: 7px;
            .active-no{
                color: #fff;
            }
        }
    }
    .nav-wrap{
        .nav-list{
           span{
                padding-top: 10px;
                color: #707c81;
            }
        }
    }
    .info-list{
        .info-wrap{
          padding: 0 1%;
          padding-bottom: 10px;
        }
       .shop_data_item{
            display: flex;
            padding-left: 10px;
            .item_img{
                height: 100px;
                width: 100px;
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
                        &:active{
                            color: #f08446;
                            text-decoration: underline;
                        }
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
                    .lose{
                        background-color: red;
                    }
                }
                //评分
                .info_desc{
                    font-size: 12px;
                    .desc-content{
                        span{
                            line-height: 18px;
                            color: #666;
                        }
                    }
                }
                // 配送
                .info_tack{
                    font-size: 12px;
                    .tack_heng{
                        padding-left: 10px;
                    }
                }
            }
        }
    }
}
</style>