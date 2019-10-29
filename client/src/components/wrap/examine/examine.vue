<template>
    <div id="examine">
        <div class="header b">
            <van-nav-bar
                :border="false"
                title="我的帖子"
                :right-text="!infoTag?'已完成':'未完成'"
                @click-right="handleInfoTag"
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
                                <span class="t" v-if="item.objectFinish">
                                    <b v-if="item.objectStepTag === 1" style="color:#007acc;">待审核</b>
                                    <b v-else-if="item.objectStepTag === 2" style="color:#07c160;">通过</b>
                                    <b v-if="item.objectStepTag === 3" style="color:red;">未通过</b>
                                </span>
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
                                <div v-if="item.objectFinish" class="i">
                                    <van-button type="warning" v-if="item.objectStepTag === 3" @click.native="handleReason(item)" block>查看理由</van-button>
                                    <van-button type="danger" v-else @click.native="handleReject(index, item.objectId, true)" block>取消发布</van-button>
                                </div>
                                <div v-else class="i">
                                    <van-button type="danger" @click.native="handleReject(index, item.objectId, false)" block>删除</van-button>
                                    
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
            currentObjectId: '',
        }
    },
    computed:{
        ...mapState([
            'userData',
            'infoTag'
        ])
    },
    inject: ['reload'],
    created(){
        /**
         *  此时这里 需要判断一下如果路由传递过来的 id
         */
        const {userData, getExamineData, examineData, infoTag} = this
        this.cheId = userData.cheId
        
        !examineData.length && getExamineData(infoTag)
    },
    methods:{
        ...mapMutations([
            'setState',
            'handleRouter'
        ]),
        // 获取数据
        getExamineData(tag){
            const {cheId} = this
            // 默认未完成列表
            let params = {
                cheId: cheId,
                objectFinish: JSON.parse(true)//未完成列表
            }
            if(tag){
                params = {
                    cheId: cheId,
                    objectFinish: JSON.parse(false) // 已完成列表
                }
            }
            this.gInfo(params).then(res =>{
                const {code, data} = res.data
                if(!data) return this.isEmpty = true
                this.examineData = data

            }, () =>{
                console.log('错误')
            })
        },

        // 取消发布 tag true 取消发布 false 删除帖子
        // 都是后台没有删除 只是修改一个字段
        handleReject(index, objectId, tag){

            const {dConfirm, deObject, handleRouter, dAlert, 
                reload} = this

            dConfirm('提示', tag?'是否取消发布该帖子?': '是否删除该帖子？一旦删除不可找回！')
            .then(() =>{
                deObject({objectId}).then(res =>{
                    const {code} = res.data
                    if(code === 0) return dAlert('取消失败')
                    // 刷新
                    reload()
                    dAlert('操作成功')
                }, (err) =>{
                    console.log(err)
                })
                
            }).catch(() =>{
                console.log('取消')
            })
        },
        // 获取不同的数据
        handleInfoTag(){
            const {infoTag, getExamineData, setState} = this
            setState({infoTag: !infoTag})
            this.examineData = []
            this.isEmpty = false
            getExamineData(this.infoTag)

            
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
        // 进度显示
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