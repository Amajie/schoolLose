<template>
    <div id="center">
        <van-sticky>
            <div class="t">
                <div class="header">
                    <div @click="handleRouter({})" class="right">
                        <icon name="left_arrow" :w="svg" :h="svg"></icon>
                    </div>
                    <div class="seach">
                        <van-search
                            placeholder="请输入搜索关键词"
                            shape="round"
                            background="#ff0000"
                            @click.native="handleRouter({url: `/pSearch/${cheId}`, tag: 'p'})"
                        />
                    </div>
                    <!-- 这个要根据是主人还是 访客显示不同的图标 -->
                    <!-- <div @click="handleRouter({url: `/person`, tag: 'p'})" class="left">
                        <icon name="tip" :w="svg" :h="svg"></icon>
                    </div> -->
                    <div @click="handleReData" class="left">
                        <icon name="add_info" :w="svg" :h="svg"></icon>
                    </div>
                </div>
            </div>
            <div class="c">
                <div class="center-wrap">
                    <div class="center">
                        <div class="center-opa">
                            <van-row type="flex" justify="center">
                                <van-col span="6">
                                    <!-- 头像 -->
                                    <div class="item">
                                        <van-image
                                            round
                                            width="60"
                                            height="60"
                                            fit="cover"
                                            :src="avater"
                                        />

                                    </div>
                                </van-col>
                                <van-col span="12">
                                    <!--未登陆显示信息 -->
                                    <div class="item">
                                        <p class="un">
                                            {{userName}}
                                        </p>
                                    </div>
                                </van-col>
                                <van-col span="3">
                                    <!--关注 -->
                                    <div class="item" v-if="!isMyCenter" @click.stop="handleConcren">
                                        <icon v-if="!concernTag" name="concern" :w="svg" :h="svg"></icon>
                                        <icon v-else name="concern_active" :w="svg" :h="svg"></icon>
                                    </div>
                                </van-col>
                            </van-row>
                        </div>
                    </div>
                </div>
            </div>
        </van-sticky>
        <div class="b">
            <div 
                class="b-item"
                @click="toDetail(index)" clickable v-for="(item, index) in centerData" 
                :key="index" >
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
                            <span class="title_p">{{item.objectTypeId | filterTypeName}}</span>
                            <span class="title_name">{{userName}}</span>
                        </p>
                        <p :class="{info_like: true, lose: item.objectWay === '0'}">{{item.objectWay === '0'? '丢': '拾'}}</p>
                    </div>
                    <!-- 评分 -->
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
                        <span>{{item.sendTime | filterTime}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <Empty v-if="noData" />
            <div v-else class="data-end">
                到底啦，不能再往下啦~~~
            </div>
        </div>
        <FreshTop @fresh="fresh" :freshTag="true" />  
    </div>
</template>

<script>

import {mapState, mapMutations} from 'vuex'

import Empty from '../../../loading/Empty.vue'
import FreshTop from '../../../loading/Fresh_top.vue'


export default {
    data(){
        return{
            svg: 30,
            cheId: '',
            userName: '',
            avater: '',
            loadObj: {},
            noData: true,
            concernTag: false,
            isMyCenter: false
        }
    },
    computed:{
        ...mapState([
            'userData',
            'centerData',
            'centerPage',
            'centerPageNum',
        ])
    },
    created(){
        console.log(this.userData)
        /**
         *  此时这里 需要判断一下如果路由传递过来的 id
         */
        const {$route, centerData, getCenterData} = this
        this.cheId = $route.params.cheId
        // 当没有数据 或者当前访问目标用户不是之前的目标用户 就发送请求获取新的数据
        if(centerData.length === 0 || centerData[0].cheId != this.cheId){
            this.fresh()
        }else{
            this.userName = centerData[0].userName
            this.avater = centerData[0].avater
            this.noData = false
        }

        //因为这里需要获取 
        this.handleConcrenTag()
    },
    methods:{
        ...mapMutations([
            'handleRouter',
            'setState'
        ]),
        // 获取数据
        getCenterData(){
            const {cheId} = this

            // 此时应该定义在函数上 当拉到底端的时候再次调用
            this.gInfo({
                cheId: cheId,
                objectPassTag: JSON.parse(true),// 获取通过审核的数据
                objectFinish: JSON.parse(true)// 获取通过未完成
            }).then(res =>{
                const {code, data, userInfo} = res.data

                // 如果存在 说明不存在数据
                if(userInfo){
                    this.userName = userInfo.userName
                    this.avater = userInfo.avater
                    return
                }

                // 个人信息要获取
                this.setState({centerData: data})
                // 没有值再获取
                if(!this.userName){
                    this.userName = data[0].userName
                    this.avater = data[0].avater
                }

                if(this.centerData.length === 0) return this.noData = true

                this.noData = false

            }, () =>{
                // 关闭加载
                this.loadObj = {
                    loadTag: false,
                    freshTag: true
                }
            })
        },
        // 查看是否关注
        handleConcrenTag(){

            const {userData, cheId} = this

            this.concrenList = userData.myConcern

            // 自己的中心 不必现实关注按钮
            if(this.cheId === userData.cheId) this.isMyCenter = true
            if(!this.concrenList.length) return console.log('关注列表没有数据')
            const i = this.concrenList.findIndex(item => item === cheId)

            // 没有关注
            if(i === -1) return
            // 已经关注
            this.concernTag = true
        },
        handleReData(){
            const {cheId, handleRouter, getAuthory} = this

            if(!getAuthory()) return
            handleRouter({url: `/c/redata/${cheId}`, tag: 'p'})
        },
        // 发送 关注请求
        handleConcren(){
            const {concernTag, centerData, userData, cheId, concren, tText, userName} = this
            
            //已经关注
            if(concernTag) return tText('已经关注他咯，快去看他的动态吧')
            const myC = [cheId, ...userData.myConcern]
            //发送关注请求
            concren({myConcern: myC}).then(res =>{
                const {code} = res.data
                if(code === 0) return tText('关注失败, 请稍后再试')
                tText(`已关注 ${userName}`)
                // 显示 关注图标
                this.concernTag = true
                // 关注对象 添加到关注列表
                userData.myConcern = myC
            })
        },
        toDetail(index){
            
            const {centerData, handleRouter, cheId} = this

            handleRouter({
                url: `/c/detail/${cheId}/${centerData[index].objectId}`,
                tag:'p'
            })
        },
        //处理关注
        handleConcern(){
            console.log('请求')
            this.concernTag = true
        },
        fresh(){
            this.setState({centerData: []})
            this.getCenterData()
        }
    },
    components:{
        Empty,
        FreshTop
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
        padding-bottom: 20px;
        .b-item{
            display: flex;
            padding-left: 10px;
            margin: 10px 0;
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