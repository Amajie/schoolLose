<template>
    <div id="commit">
        <div class="header b">
            <van-nav-bar
                @click-left="back"
                :border="false"
                title="评论管理"
            >
                <van-icon name="arrow-left" slot="left" size="1.5em" color="#fff" />
            </van-nav-bar>
        </div>
        <div class="commit-wrap">
            <div class="content cell">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    :finished-text="noData && finished? '': noCommitText"
                    @load="loadData"
                    :immediate-check="false"
                >
                    <van-cell clickable 
                        v-for="(item, index) in commitData"
                        :key="index">
                            <div class="item" 
                                @click.stop="handlereplyItem(index)"
                                >
                                    <div class="item-info">
                                    <div class="from">
                                        <van-image
                                                :width="h_img_size"
                                                :height="h_img_size"
                                                round
                                                fit="cover"
                                                :src="item.fromAvater"
                                            />
                                    </div>

                                    <div @click.stop="toUserCenter(item.fromId)" class="from-name name">
                                        {{item.fromId === cheId?'你':item.fromUserName}}
                                    </div>
                                    
                                    <div v-if="item.toId" class="reply-text">
                                        回复
                                    </div>
                                    <div class="to">
                                        <van-image
                                            v-if="item.toId"
                                            :width="h_img_size"
                                            :height="h_img_size"
                                            round
                                            fit="cover"
                                            :src="item.toAvater"
                                        />
                                    </div>
                                    <div @click.stop="toUserCenter(item.toId)" v-if="item.toId" class="to-name name">{{item.toId === cheId?'你':item.toUserName}}</div>
                                    <div @click.stop="delectCommmit(index)" class="dlelct-commit">
                                        删除
                                    </div>
                                    </div>
                                    <div class="item-commit">
                                        <span class="r">{{item.commit}}</span>
                                        <span v-if="item.toId" class="ge">//</span>
                                        <span v-if="item.toId" class="c">{{item.replyCommit}}</span>
                                        <span @click.stop="handleDetail(item)" class="d">...帖子详情</span>
                                        <p class="time-reply">{{item.commitTime | filterTime(true)}}</p>
                                    </div>
                            </div>
                    </van-cell>
                </van-list>
                    <div class="commit-loading">
                    <Load @fresh="handleGetCommit" v-bind="loadObj"/>
                </div>
                <div v-if="noData" class="empty">
                    <Empty />
                </div>
            </div>
        </div>
        <div @click.stop v-show="replyTag" class="commit-reply">
            <div class="close">
                <span @click.stop="handleClose">
                    <van-icon name="cross" size="20" color="#fff"></van-icon>
                </span>
            </div>
            <div class="reply-wrap">
                <div class="c-in">
                    <van-field ref="commitNode" v-model="commit" :placeholder="commitHolder"
                        type="textarea"
                        autosize
                        rows="1"
                        clearable>

                        <van-button slot="button"
                            @click.native="sendreply" 
                            size="small" type="info" 
                        >回复</van-button>
                    </van-field>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Load from '../../../loading/Load.vue'
import Empty from '../../../loading/Empty.vue'
import {mapState, mapMutations} from 'vuex'
export default {
    data(){
        return{
            commitData: [],
            loadObj: {},
            loading: false,
            finished: false,
            page: 0,
            pageNum: 1,
            noCommitText: '没有更多了',
            h_img_size: 35,
            commit: '',
            commitData: [],
            saveCommit: '',
            commitHolder: '',
            toId: '',
            replyCommit: '',
            replyTag: false,
            noData: false
        }
    },
    inject:['reload'],
    computed:{
        ...mapState([
            'userData'
        ])
    },
    created(){
        this.cheId = this.$route.params.cheId
        if(this.cheId != this.userData.cheId) return console.log('404页面')
        this.handleGetCommit()
    },
    watch:{
       commitData(newData){
           if(newData.length === 0) return this.noData = true
           this.noData = false
       }
    },
    methods:{
        ...mapMutations([
            'setState',
            'toUserCenter',
            'toDetail'
        ]),

        //获取评论数据
        handleGetCommit(){
            
            // 获取数据 关闭加载
            this.loadObj = {
                loadTag: true,
                freshTag: false
            }

            // 暂时不触发 loadData函数
            this.loading = true

            this.getMyCommit({
                cheId: this.cheId,
                page: this.page++,
                pageNum: this.pageNum
            }).then(res =>{

                const {code, commitData} = res.data

                // 获取数据 关闭加载
                this.loadObj = {
                    loadTag: false,
                    freshTag: false
                }

                this.loading = false

                console.log(commitData)

                this.commitData = this.commitData.concat(commitData)
                
                if(code === 0 && this.commitData.length === 0) return this.noData = true
                
                if(commitData.length === 0){
                    this.finished = true
                }

            }, () =>{
                //获取数据失败 出现按钮重新加载
                this.loadObj = {
                    loadTag: false,
                    freshTag: true
                }
            })
        },

        handlereplyItem(index){
            this.targetData = this.commitData[index]
            const {targetData, tText, $refs, cheId, userData} = this
            
            if(targetData.fromId === cheId) return tText('只能回复别人哟')
            // 获取评论人的数据
            this.toId = targetData.fromId
            this.infoUserId = targetData.infoUserId
            this.infoId = targetData.infoId
            this.infoId = targetData.infoId

            this.replyCommit = targetData.commit
            this.replyTag = true
            this.commitHolder = `回复: ${targetData.fromUserName}`
            //  现实之后获取焦点
            setTimeout(() =>{
                $refs.commitNode.focus()
            }, 50)

        },
        delectCommmit(index){

            const {commitData, delectMyCommit,
            cheId, dConfirm, dAlert, tText} = this
            let {commitTag, commitId} = commitData[index]

            commitTag = commitTag.replace(`${cheId}`, `${cheId.substring(0, 6)}-delect-${cheId.substring(6)}`)

            dConfirm('提示', '是否删除该评论').then(() =>{
                delectMyCommit({
                    commitId,
                    commitTag
                }).then(res =>{
                    const {code} = res.data
                    if(code === 0) return dAlert('删除失败，请稍后再试')
                    
                    commitData.splice(index, 1)
                    tText('操作成功')
                })
            })
        },
        handleDetail(item){
            const {infoId, infoUserId} = item
            this.toDetail({
                cheId: infoUserId, 
                objectId: infoId,})
        },
        // 发表评论
        sendreply(){

            const {$refs, commit, toId, cheId, infoId, infoUserId, replyCommit,
                    commitData, userData, targetData, setState, tText} = this
            
            //保持获取焦点
            $refs.commitNode.focus()
            const commitTime = Date.now()
            if(!commit){
                return tText('请输入评论内容')
            }

            this.insertCommit({
                infoUserId,
                infoId,
                fromId: cheId,
                commitTag: `${cheId}-${toId}`,
                replyCommit,
                toId,
                commit,
                commitTime
            }).then(res =>{
                console.log(res)
                const {code, commitId} = res.data

                if(code === 0) return tText('评论失败，请稍后再试')

                let arrData = {}
                
                arrData.infoUserId = infoUserId
                arrData.infoId = infoId
                arrData.fromId = cheId
                arrData.toId = toId
                arrData.commit = commit
                arrData.commitId = commitId
                arrData.replyCommit = replyCommit
                arrData.commitTime = commitTime

                // 评论人的信息
                arrData.fromUserName = userData.userName
                arrData.fromAvater = userData.avater
                // 默认为空
                arrData.toUserName = ''
                arrData.toAvater = ''

                // 回复 则赋值
                if(toId){
                    // 回复目标的信息的信息
                    arrData.toUserName = targetData.fromUserName
                    arrData.toAvater = targetData.fromAvater
                }

                //此时要把新的数据 添加早新的评论数组中
                //要根据是回复还是 评论
                this.commit = ''
                this.saveCommit = ''
                // 隐藏发布按钮
                this.replyTag = false
                this.commitData = [arrData, ...commitData]
                tText('发表成功')
            })
        },

        // 关闭输入框
        handleClose(){
            this.replyTag = false
            this.commitHolder = ''
        },

        loadData(){
            this.handleGetCommit()
            console.log('加载')
        },

        back(){
           this.$router.go(-1)
        }
    },
    components:{
        Load,
        Empty
    }
}
</script>
<style lang="less" scoped>
#commit{
    .header{
        .t{
            color: #fff;
        }
    }
    .commit-wrap{
        .title{
            background-color: red;
        }
        .content{
            position: relative;
            .item{
                border: 1px solid #fafafa;
                .item-info{
                    position: relative;
                    font-size: 15px;
                    height: 35px;
                    padding: 0 5px;
                    display: flex;
                    display: -webkit-flex;
                    > div{
                        line-height: 35px;
                    }
                    .reply-text{
                        margin: 0 5px;
                        color: #444547;
                    }
                    .from-name{
                        color: #d84c29;
                    }
                    .to-name{
                        color: #348800;
                    }
                    .dlelct-commit{
                        position: absolute;
                        right: 10px;
                        top: 0;
                        color: #007acc;
                        text-decoration: underline;
                    }
                    .name{
                        font-weight: 900;
                        margin-left: 5px;
                    }
                    .name:active{
                        color: #088fff;
                        text-decoration: underline;
                    }
                }
                .item-commit{
                    padding: 0 7%;
                    padding-top: 5px;
                    .r{
                        font-size: 13px;
                        font-weight: bold;
                        color: #444547;
                    }
                    .ge{
                        color: #088fff;
                        padding: 0 5px;
                        
                    }
                    .c{
                        color: #76b9ed;
                    }
                    .d{
                        color: #1f3040;
                        text-decoration: underline;
                    }
                    .time-reply{
                        padding: 5px 0;
                        text-align: right;
                        font-size: 15px;
                        color: #666;
                    }
                }
            }
            .item:last-child{
                border: 0;
            }
        }
    }
    .commit-reply{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 96%;
        padding: 5px 2%;
        // 粘性布局为 99
        // 图片预览为2002
        z-index: 110;
        background-color: #1e323f;
        .reply-wrap{
            .c-in{
                border-radius: 10px;
                overflow: hidden;
            }
        }
        .close{
            overflow: hidden;
            span{
                float: right;
                padding: 5px;
            }
        }
    }
   
}
</style>