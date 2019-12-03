<template>
    <div id="home">
        <div class="header">
            <van-sticky>
                <div @click="handleRouter({url: '/search/all', tag: 'p'})" class="search">
                    <van-search
                        placeholder="请输入搜索关键词"
                        shape="round"
                        background="#008fff"
                    />
                </div>
                <!-- <div class="left">
                    <div v-if="isLogin" class="active-no">
                        <span>登陆</span>
                    </div>
                    <div v-if="!isLogin" class="active">
                        <icon name="user_active" :w="svg" :h="svg"></icon>
                    </div>
                </div> -->
            </van-sticky>
        </div>
        <div class="nav-wrap">
            <div class="nav-list">
                <van-grid clickable :column-num="4">
                    <van-grid-item @click.native="handleSelectNav(key)" v-for="(item, key, index) in type_nav" :key="index">
                        <!-- <icon :name="item.name" :w="svg" :h="svg"></icon> -->
                        <img class="type-icon" :src="item.icon_link" alt="">
                        <span>{{item.type}}</span>
                    </van-grid-item>
                </van-grid>
            </div>
        </div>
        <div class="info-list cell">
            <van-list
                v-if="homeData.length"
                v-model="homeLoad"
                :finished="homeFinished"
                @load="loadData"
                :immediate-check="false"
                >
                <van-cell @click.native="toDetail(item)" clickable v-for="(item, index) in homeData" :key="index">
                    <div class="data_item">
                        <div class="item_img">
                            <van-image
                                width="100%"
                                height="100%"
                                fit="cover"
                                radius="5"
                                :src="item.objectImg[0]"
                            />
                        </div>
                        <div class="item_info">
                            <!-- 标题 -->
                            <div class="info_title">
                                <p>
                                    <span class="title_p">{{item.objectTypeId | filterTypeName}}</span>
                                    <span @click.stop="toUserCenter(item.cheId)" class="title_name">{{item.userName}}</span>
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
                            <!-- 时间 名称 -->
                            <div class="info_tack">
                                <div class="user">
                                    <icon name="center_object" :w="12" :h="12"></icon>
                                    <span>{{item.objectName}}</span>
                                </div>
                                <div class="tack_heng">
                                    <icon name="center_time" :w="15" :h="15"></icon>
                                <span>{{item.sendTime | filterTime}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-cell>
            </van-list>
            <Empty v-if="noData" />
            <div v-else-if="!noData && homeFinished" class="data-end">
                到底啦，不能再往下啦~~~
            </div>
            <Load @fresh="getHomeData" v-bind="loadObj" />
        </div>
        <FreshTop @fresh="fresh" :freshTag="true" />  
    </div>
</template>

<script>
import { mapState, mapMutations} from 'vuex'

import Load from '../../loading/Load.vue'
import Empty from '../../loading/Empty.vue'
import FreshTop from '../../loading/Fresh_top.vue'

export default {
    data(){
        return{
            svg: 35,
            isLogin: false,
            homeLoad: false,
            loadObj: {},
            noData: true
        }
    },
    created(){
       this.handleCreated()
    },
    inject:['reload'],
    computed:{
        ...mapState([
            'type_nav',
            'homeData',
            'homePage',
            'homePageNum',
            'homeFinished',
        ])
    },
    methods:{
        ...mapMutations([
            'setState',
            'concatArr',
            'toDetail',
            'toUserCenter',
            'handleRouter'
        ]),
        handleCreated(){
            // 如果有数据不必在获取 此时要看上拉之后是否要继续加载
            if(this.homeData.length) return this.noData = false
            this.getHomeData()
        },
        getHomeData(){
            console.log('请求')
            let {homeData,homePage, homePageNum} = this
            // 显示加载
            this.loadObj = {
                loadTag: true,
                freshTag: false
            }

            this.noData = false
            this.homeLoad = true
            this.setState({homeFinished: false})
            //发送请求
            this.gHomeData({
                page: homePage,
                pageNum: homePageNum
            }).then(res =>{

                // 关闭加载
                this.loadObj = {
                    loadTag: false,
                    freshTag: false
                }

                const {code, homeData} = res.data

                
                // 此时说明数据没有了 因此不比在触发加载事件
                if(!code){
                    if(this.homeData.length === 0) this.noData = true
                    return this.setState({homeFinished: true})
                }     


                this.concatArr({key: 'homeData', data: homeData})

                // if(this.homeData.length === 0) this.noData = true
                this.setState({homePage: ++homePage})
                // 表示 当上拉到底的时候 需要需要在继续触发 loadData函数    
                this.homeLoad = false
            }, () =>{
                // 关闭加载
                this.loadObj = {
                    loadTag: false,
                    freshTag: true
                }
            })
        },
        // 处理点击便捷导航
        handleSelectNav(objectTypeId){
            console.log(objectTypeId)
            this.handleRouter({url: `/search/${objectTypeId}`, tag: 'p'})
        },
        loadData(){
            this.getHomeData()
            console.log('加载')
        },
        fresh(){
            this.setState({
                'homeData': [],
                'homePage': 0,
                'homeFinished': false
            })

            this.noData = true
            this.reload()
        }
    },
    components:{
        Load,
        Empty,
        FreshTop
    }
}
</script>

<style lang="less" scoped>
#home{
    .header{
        .search{
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
            .type-icon{
                width: 35px;
                height: 35px;
            }
        }
    }
    .info-list{
        padding-bottom: 60px;
        .info-wrap{
          padding: 0 1%;
          padding-bottom: 10px;
        }
        .data_item{
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
                .info_desc{
                    font-size: 12px;
                    .desc-content{
                        span{
                            line-height: 18px;
                            color: #666;
                        }
                    }
                }
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