<template>
    <div id="center">
        <van-sticky>
            <div class="t">
                <div class="header">
                    <div @click="$router.go(-1)" class="right">
                        <icon name="left_arrow" :w="svg" :h="svg"></icon>
                    </div>
                    <div class="seach">
                        <van-search
                            placeholder="请输入搜索关键词"
                            shape="round"
                            background="#ff0000"
                            @click.native="$router.push(`/search/${cheId}`)"
                        />
                    </div>
                    <!-- 这个要根据是主人还是 访客显示不同的图标 -->
                    <!-- <div @click="$router.replace('/person')" class="left">
                        <icon name="tip" :w="svg" :h="svg"></icon>
                    </div> -->
                    <div @click="$router.push(`/c/redata/${cheId}`)" class="left">
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
                                        <!-- <img class="hi" :src="userData.avater" /> -->
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
                                    <div class="item" @click.stop="handleConcern" @click="loading=false">
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
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                :immediate-check="false"
                >
                <van-cell @click.native="toDetail(index)" clickable v-for="(item, index) in infoData" :key="index">
                    <div class="shop_data_item">
                        <div class="item_img">
                            <!-- <img :src="item.objectImg[0]?item.objectImg[0]: 'http://192.168.43.124:7070/av/init.png'"> -->
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
            infoData: [],
            cheId: '',
            userName: '',
            avater: '',
            otherConcern: [],
            /**
             * 是否已经关注他标志位 此时应该是遍历它的关注列表来决定 我这里先写死
             */
            concernTag: false


        }
    },
    computed:{
        ...mapState([
            'userData'
        ])
    },
    created(){
        
        /**
         *  此时这里 需要判断一下如果路由传递过来的 id
         */
        this.cheId = this.$route.params.cheId

        // 此时应该定义在函数上 当拉到底端的时候再次调用
        this.gInfo({cheId: this.cheId}).then(res =>{
            const {code, data} = res.data


            console.log(data[0])
            // 个人信息要获取
            this.userName = data[0].userName
            this.avater = data[0].avater
            this.otherConcern = data[0].otherConcern
            if(code === 0){
                
                //此时这里没有数据 应该友好显示
                console.log('没有数据，应该友好显示')
                return
            }

            this.infoData = data[0].infoData
        })
    },
    methods:{
        onLoad() {
            /**
             * 注意 
             *      此时要想显示 加载loading 设置this.loading = true
             *      此时要想显示 要想不再触发 onLoad事件 设置 this.finished = true
             */
            console.log('触发')
        },
        toDetail(index){
            
            const {infoData, $router, cheId} = this

            $router.push(`/c/detail/${cheId}/${infoData[index].objectId}`)
        },
        //处理关注
        handleConcern(){
            console.log('请求')
            this.concernTag = true
        },
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