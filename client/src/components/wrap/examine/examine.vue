<template>
    <div id="examine">
        <div class="header b">
            <van-nav-bar
                :border="false"
                title="审核列表"
            />
        </div>
        <div class="examine-wrap">
           <div class="wrap">
                <van-collapse v-model="activeName" accordion>
                    <van-collapse-item
                      v-for="(item, index) in examineData"
                      :key="index"
                      :name="index">
                        <div class="title-info" slot="title">
                                <span class="n">{{item.objectName}}</span>
                                <span class="t">{{item.sendTime | filterTime(false)}}</span>
                        </div>
                        <div class="item">
                            <div class="progress">
                                <van-steps active-color="#38f" :active="item.objectStepTag | filterExa">
                                        <van-step>信息已填写</van-step>
                                        <van-step>审核中</van-step>

                                        <van-step v-if="item.objectStepTag === 2">审核通过</van-step>
                                        <van-step v-else-if="item.objectStepTag === 1">等待审核结果</van-step>
                                        <van-step v-else>审核未通过</van-step>

                                </van-steps>
                            </div>
                            <div class="info">
                                <p>
                                    <span>分类：</span>
                                    <span>{{item.objectTypeId | filterTypeName}}</span>
                                </p>
                                <p>
                                    <span>物品名称：</span>
                                    <span>{{item.objectName}}</span>
                                </p>
                                <p>
                                    <span>丢失时间：</span>
                                    <span>{{item.objectTime | filterTime(false)}}</span>
                                </p>
                                <p>
                                    <span>丢失地点：</span>
                                    <span>{{item.objectAddress}}</span>
                                </p>
                                <p>
                                    <span>楼主说明：</span>
                                    <span>{{item.objectDesc}}</span>
                                </p>
                            </div>
                            <div class="op-btn">
                                <div class="i">
                                    <van-button type="info" @click.native="handlePic(item.objectImg)" block>图片预览</van-button>
                                </div>
                                <div v-if="item.objectStepTag === 1" class="i">
                                    <van-button type="danger" @click.native="handlePic(item.objectImg)" block>取消发布</van-button>
                                </div>
                                <div v-if="item.objectStepTag === 2" class="i">
                                    <van-button type="primary" @click.native="handlePic(item.objectImg)" block>不再显示</van-button>
                                </div>
                                <div v-if="item.objectStepTag === 3" class="i">
                                    <van-button type="warning" @click.native="handleReason(item)" block>查看理由</van-button>
                                </div>
                            </div>
                        </div>
                    </van-collapse-item>
                </van-collapse>
               
           </div>
        </div>
        <div class="empty-end">
            <Empty v-if="isEmpty" />
            <div v-else class="data-end">没有更多了</div>
        </div>
        <div class="show_himg">
            <van-image-preview
                v-model="show_img"
                :images="objectPic"
                :showIndex="false"
                >
            </van-image-preview>
       </div>
       <div class="show-reason">
           <van-popup
                v-model="showReason"
                round
                position="bottom"
            >
                <p>
                    <span>理由：</span>
                    <span>{{reason}}</span>
                </p>
                <van-button type="info" @click.native="handleRouter({url: `/c/updata/${cheId}/${currentObjectId}`, tag: 'p'})" block>再次编辑</van-button>
            </van-popup>
       </div>
    </div>
</template>
<script>
import Empty from '../../loading/Empty.vue'
import {mapState, mapMutations} from 'vuex'
export default {
    data(){
        return{
            examineData: [],
            isEmpty: false,
            stepActive: 0,
            activeName: '0',
            show_img: false,
            showReason: false,
            objectPic: [],
            reason: '',
            currentObjectId: ''
        }
    },
    computed:{
        ...mapState([
            'userData'
        ])
    },
    inject: ['reload'],
    created(){
        /**
         *  此时这里 需要判断一下如果路由传递过来的 id
         */
        const {userData, getExamineData} = this
        this.cheId = userData.cheId
        getExamineData()
    },
    methods:{
        ...mapMutations([
            'setState',
            'handleRouter'
        ]),
                // 获取数据
        getExamineData(){
            const {cheId} = this

            // 此时应该定义在函数上 当拉到底端的时候再次调用
            this.gInfo({
                cheId: cheId,
                //objectPassTag: JSON.parse(false)//未通过数据
            }).then(res =>{
                const {code, data} = res.data
                if(!data) return this.isEmpty = true
                this.examineData = data

            }, () =>{
                console.log('错误')
            })
        },
        handlePic(objectPic){
            this.show_img = !this.show_img
            this.objectPic = objectPic
        },
        handleReason({objectId, objectReason}){
            this.showReason = !this.showReason
            this.reason = objectReason
            this.currentObjectId = objectId
        }
    },
    filters:{
        filterExa(index){
            if(index === 2 || index === 3) return 2

            return index
        }
    },
    components:{
        Empty
    }
}
</script>
<style lang="less" scoped>
#examine{
    .examine-wrap{
        .wrap{
            .title-info{
                .t{
                    float: right;
                    margin-right: 20px;
                }
            }
            .item{
                padding: 0 2%;
                .progress{
                    
                }
                .info{
                    > p{
                        padding: 5px 0;
                    }
                }
                .op-btn{
                    display: flex;
                    > div{
                        flex: 1;
                        margin: 0 5px;
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
    .show-reason{
        p{
            margin: 5%;
        }
    }
}
</style>