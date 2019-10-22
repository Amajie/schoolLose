<template>
    <div id="collection">
        <div class="header b">
            <van-nav-bar
                @click-left="back"
                :border="false"
                title="我的收藏"
            >
                <van-icon name="arrow-left" slot="left" size="1.5em" color="#fff" />
                <p v-show="delectTag" @click="handleCollection" slot="right" class="t">取消收藏</p>
            </van-nav-bar>
        </div>
        <div class="collection-wrap">
            <div class="collection-list">
                <div class="item" 
                    v-for="(item, index) in collectionData"
                    :key="index"
                >
                    <div @click.stop="toUserCenter(item.cheId)" class="user-info">
                        <div class="l">
                            <van-image
                                width="20"
                                height="20"
                                round
                                fit="cover"
                                :src="item.avater"
                            />
                            <p>{{item.userName}}</p>
                            <van-image
                                width="20"
                                height="20"
                                round
                                fit="cover"
                                src="http://192.168.43.124:7070/av/arrow_right.png"
                            />
                        </div>
                    </div>
                    <div class="object-info">
                        <van-checkbox-group v-model="optionList">
                            <van-checkbox 
                                :name="val.objectId"
                                v-model="checked"
                                v-for="(val, i) in item.objectData"
                                :key="i"
                                @click.native="handleBox()"
                            >
                                <div @click.stop="toDetail({cheId: val.objectUserId, objectId: val.objectId})"  class="data_item">
                                    <div class="item_img">
                                        <van-image
                                            width="80"
                                            height="80"
                                            fit="cover"
                                            radius="5"
                                            :src="val.objectImg[0]"
                                        />
                                    </div>
                                    <div class="item_info">
                                        <!-- 标题 -->
                                        <div class="info_title">
                                            <p>
                                                <span class="title_p">{{val.objectTypeId | filterTypeName}}</span>
                                                <span class="title_name">{{item.userName}}</span>
                                            </p>
                                            <p :class="{info_like: true, lose: val.objectWay === '0'}">
                                                {{val.objectWay === '0'? '丢': '拾'}}
                                            </p>
                                        </div>
                                        <!-- 描述 -->
                                        <div class="info_desc">
                                            <p class="desc-content">
                                                <icon name="desc" :w="15" :h="15"></icon>
                                                <span>{{val.objectDesc}}</span>
                                            </p>
                                        </div>
                                        <!-- 时间 名称 -->
                                        <div class="info_tack">
                                            <div class="user">
                                                <icon name="center_object" :w="12" :h="12"></icon>
                                                <span>{{val.objectName}}</span>
                                            </div>
                                            <div class="tack_heng">
                                                <icon name="center_time" :w="15" :h="15"></icon>
                                            <span>{{val.sendTime | filterTime}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </van-checkbox>
                        </van-checkbox-group>
                    </div>
                </div>
            </div>
        </div>
        <div class="empty-end">
            <Empty v-if="isEmpty" />
            <div v-else class="data-end">没有更多了</div>
        </div>
    </div>
</template>
<script>
import Empty from '../../../loading/Empty.vue'
import {mapState, mapMutations} from 'vuex'
export default {
    data(){
        return{
            collectionData: [],
            isEmpty: false,
            delectTag: false,
            checked: false,
            optionList:[],
            collectionList:[]
        }
    },
    inject:['reload'],
    computed:{
        ...mapState([
            'userData'
        ])
    },
    created(){

       // 获取数据
       this.getInfo()
    },
    watch:{
        optionList(newData, oldData){
            if(newData.length > 0) return this.delectTag = true
            this.delectTag = false
        }
    },
    methods:{
        ...mapMutations([
            'setState',
            'toUserCenter',
            'toDetail'
        ]),
        getInfo(){

            this.collectionList = this.userData.otherConcern
            if(this.collectionList.length === 0) return this.isEmpty = true
            this.getCollection({
                collectionList: JSON.stringify(this.collectionList)
            }).then(res =>{
                const {collectionData} = res.data
                this.collectionData = collectionData
            })
        },
        handleBox(){
            this.checked = !this.checked
        },
        handleCollection(){
            const {optionList, collectionList, 
            sendCollection, getInfo, dConfirm, tText} = this
            
            // 选择 不同的数组元素
            const otherConcern = optionList.concat(collectionList).filter(function(v, i, arr) {
               return arr.indexOf(v) === arr.lastIndexOf(v)  
            })
            
            dConfirm('提示', '是否要取消收藏?').then(() =>{
                // 发送数据
                sendCollection({
                    otherConcern
                }).then(res =>{
                    const {code} = res.data
                    if(code === 0) return tText('操作失败，请稍后再试')

                    tText('操作成功')
                    this.userData.otherConcern = otherConcern
                    // 操作成功 获取数据
                    this.reload()
                })
            }).catch(() =>{})
        },
        back(){
           this.$router.go(-1)
        }
    },
    components:{
        Empty
    }
}
</script>
<style lang="less" scoped>
#collection{
    .header{
        .t{
            color: #fff;
        }
    }
    .collection-wrap{
        .collection-list{
            .item{
                .user-info{
                    padding: 5px 1%;
                    .l{
                        display: flex;
                        p{
                            padding: 0 10px;
                        }
                    }
                }
                .object-info{
                    padding: 10px 2%;
                    .data_item{
                        display: flex;
                        padding-left: 10px;
                        margin: 5px 0;
                        .item_img{
                            height: 80px;
                            width: 80px;
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
                                font-size: 13px;
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
        }
    }
    .empty-end{
        .data-end{
            color: #666;
            text-align: center;
            padding: 5px 0;
        }
    }
}
</style>