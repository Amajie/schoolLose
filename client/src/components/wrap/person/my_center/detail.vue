<template>
    <div @click="handleBlur" id="detail">
         <div class="header">
            <div @click.stop="handleRouter({})" class="left">
                <icon name="detail_arrow" :w="svg" :h="svg"></icon>
            </div>
            <div v-if="meTag" @click.stop="showOption = true" class="right">
                <icon name="more_right" :w="svg" :h="svg"></icon>
            </div>
            <div v-else @click.stop="handleCollection" class="right">
                <icon :name="collectionName" :w="svg" :h="svg"></icon>
            </div>
        </div>
        <div class="swip-wrap">
            <van-swipe 
                ref="swipe"
                indicator-color="#088fff" 
                :autoplay="10000"
            >
                <van-swipe-item 
                    v-for="(image, index) in images" :key="index"
                    @click.native="showBigImg(index)"
                >
                    <van-image
                        width="100%"
                        fit="contain"
                        :src="image"
                    >
                        <template v-slot:error>加载失败</template>
                    </van-image>
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="detail-info">
            <div class="info">
                <div class="title">
                    --- 详情信息 ---
                </div>
                <div class="content">
                    <van-cell title="分类" :value="detailData.objectTypeId | filterTypeName" size="large" />
                    <van-cell title="物品名称" :value="detailData.objectName" size="large" />
                    <van-cell title="丢失时间" :value="detailData.objectTime | filterTime" size="large" />
                    <van-cell title="发布时间" :value="detailData.sendTime | filterTime" size="large" />
                    <van-cell :title="detailData.objectWay?'丢失地点': '拾获地点'" :label="detailData.objectAddress" size="large" />
                    <van-cell title="楼主说明" :label="detailData.objectDesc" size="large" />
                </div>
            </div>
            <div class="commit-wrap">
                <van-sticky @scroll="handleScroll" :offset-top="0">
                    <div class="title">
                        --- 相关评论 ---
                    </div>
                </van-sticky>
                <div class="content cell">
                    <van-list
                        v-model="loading"
                        :finished="finished"
                        :finished-text="noCommitText"
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

                                        <div class="from-name name">{{item.fromUserName}}</div>
                                        
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
                                        <div v-if="item.toId" class="to-name name">{{item.toUserName}}</div>
                                        </div>
                                        <div class="item-commit">
                                            <span class="r">{{item.commit}}</span>
                                            <span v-if="item.toId" class="ge">//</span>
                                            <span v-if="item.toId" class="c">{{item.replyCommit}}</span>
                                            <p class="time-reply">{{item.commitTime | filterTime(true)}}</p>
                                        </div>
                                </div>
                        </van-cell>
                    </van-list>
                     <div class="commit-loading">
                        <Load @fresh="handleGetCommit" v-bind="loadObj"/>
                    </div>
                </div>
            </div>
        </div>
        <div @click.stop class="commit-reply">
            <div class="reply-wrap">
                <div class="c-in">
                    <van-field ref="commitNode" 
                        v-model="commit" 
                        :placeholder="commitHolder + '--->限制字数'+ maxCommit"
                        type="textarea"
                        :maxlength="maxCommit"
                        autosize
                        rows="1"
                        clearable
                        @focus="replyFocus">
                        <van-button slot="button" 
                            size="small" type="info" 
                            v-show="replyTag"
                            @click.stop="sendreply" 
                        >发表</van-button>

                        <van-button slot="button" 
                            size="small" type="info" 
                            v-show="!replyTag && toId"
                            @click.stop="rejectreply" 
                        >取消回复</van-button>
                    </van-field>
                </div>
            </div>
        </div>
        <div @click.stop class="more-option">
            <van-action-sheet
                v-model="showOption"
                round
                :close-on-click-action="true"
                :actions="options"
                @select="onSelect"
            />
        </div>
    </div>
</template>

<script>
import {ImagePreview} from 'vant'
import {mapState, mapMutations} from 'vuex'
import Load from '../../../loading/Load.vue'
export default {
    data(){
        return {
            svg: 30,
            images: [],
            h_img_size: 35,
            commit: '',
            commitData: [],
            saveCommit: '',
            commitHolder: '我来说两句',
            collectionName: 'collection_no',
            toId: '',
            replyCommit: '',
            replyTag: false,
            meTag: true,
            options:[
                {name: '删除', id: 1},
                {name: '添加', id: 2},
            ],
            showOption: false,
            showLoad: false,
            noCommitText: '暂无用户评论',
            loadObj: {},
            loading: false,
            finished: false,
            detailData: {},
            page: 0,
            pageNum: 10,
            collectionTag: false,
            maxCLen: 15// 收藏的最大长度

        }
    },
    created(){
        this.cheId = this.$route.params.cheId
        this.objectId = this.$route.params.objectId
        
        // 获取详细信息
        this.handleGetDetail()
        // 获取评论
        this.handleGetCommit()
        // 绑定一些数据
        this.handleCreated()
    },
    computed:{
        ...mapState([
            'userData',
            'maxCommit'
        ])
    },
    methods:{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        ...mapMutations([
            'setState',
            'handleRouter'
        ]),
        showBigImg(startPosition){

            const {images} = this
            this.isColse = ImagePreview({
                images,
                startPosition
            })
        },

        //初始化一些数据
        handleCreated(){
            const {cheId, userData, objectId, collectionTag} = this
            const i = userData.myCollection.findIndex(item => item === objectId)
            // 有搜藏
            if(i != -1) this.collectionTag = true

            if(cheId != userData.cheId) {
                const text = this.collectionTag ? 'collection_had' : 'collection_no'
                this.collectionName = text
                this.meTag = false
                return
            }
        },
        //获取详细信息
        handleGetDetail(){

            //显示loading
            this.showLoad = true

            this.getDetail({
                objectId: this.objectId,
                objectUserId: this.cheId
            }).then(res =>{

                
                const {code, detailData} = res.data
                if(code === 0) return console.log('查找失败')
                if(code === 200){
                    this.images = detailData.objectImg
                    this.detailData = detailData
                }
            })
        },
        //获取评论数据
        handleGetCommit(){
            
            // 获取数据 关闭加载
            this.loadObj = {
                loadTag: true,
                freshTag: false
            }

            // 暂时不触发 loadData函数
            this.loading = true

            this.getObjectCommit({
                infoId: this.$route.params.objectId,
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

                this.commitData = this.commitData.concat(commitData)

                if(this.commitData.length) this.noCommitText = '没有更多了'
                
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
        // 统一处理点击输入框的时候 失去焦点
        handleBlur(){
            console.log('点击')
            // 隐藏发表按钮
            this.replyTag = false
            if(this.commit){
                this.saveCommit = this.commit
                this.commit = ''
            }
        },
        // 粘性布局 滚动事件
        handleScroll(){
            // 隐藏按钮
            this.replyTag = false
             // 失去焦点
            this.$refs.commitNode.blur()
        },
        //获取焦点
        replyFocus(){

            // 没有获取权限 无法评论
            const {getAuthory, $refs, saveCommit} = this
            if(!getAuthory()) return $refs.commitNode.blur()
            //显示发表字样
            this.replyTag = true
            //如果存在备份 就显示
            if(this.saveCommit){
                this.commit = saveCommit
                this.saveCommit = ''
            }
        },
        //点击评论 回复
        handlereplyItem(index){

             // 没有获取权限 无法评论
             // 这里也要 判断一些权限有没有 
             // 在获取焦点也判断设置 只在那里判断不行 因为这里也会往下执行
            if(!this.getAuthory()) return
            
            this.targetData = this.commitData[index]
            const {targetData, tText, $refs, userData} = this

            if(targetData.fromId === userData.cheId) return tText('只能回复别人哟')

            //保持获取焦点
            $refs.commitNode.focus()

            // 如果点击当前的就不需要在设置
            this.toId = targetData.fromId
            this.replyCommit = targetData.commit
            this.commitHolder = `回复: ${targetData.fromUserName}`
            //显示的取消回复
            this.replyTag = true
            //并且把之前的 评论内容清空
            this.commit = ''
            this.saveCommit = ''
        },
        // 发表评论
        sendreply(){

            const {$refs, commit, toId, cheId, objectId, replyCommit,
                    commitData, userData, targetData, setState, tText} = this
            
            //保持获取焦点
            $refs.commitNode.focus()
            const commitTime = Date.now()
            if(!commit){
                return tText('请输入评论内容')
            }else if(commit){

            }

            this.insertCommit({
                infoId: objectId,
                infoUserId: cheId,
                fromId: userData.cheId,
                commitTag: `${userData.cheId}-${toId}`,
                replyCommit,
                toId,
                commit,
                commitTime
            }).then(res =>{

                const {code, commitId} = res.data

                if(code === 0) return tText('评论失败，请稍后再试')

                let arrData = {}

                arrData.infoUserId = cheId
                arrData.infoId = objectId
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
                this.noCommitText = '没有更多了'
                tText('发表成功')
            })
        },
        // 取消 回复
        rejectreply(){
            //此时把toId 清空
            this.toId = ''
            this.replyCommit = ''
            this.commitHolder = '我来说两句'
            // 清空目标人的信息
            this.targetData = null
        },
        // 处理收藏信息
        handleCollection(){
            const {sCollection, rejectCollection, collectionTag} = this
            
            // 此时为已经关注 取消关注
            if(collectionTag) return rejectCollection()

            // 否则没有关注 则关注
            sCollection()
        },
        // 收藏
        sCollection(){
            const {userData, maxCLen, objectId, 
            tText, dConfirm, sendCollection} = this
            // 判断收藏夹满了没有
            if(userData.myCollection.length > maxCLen) 
                return dConfirm('提示', '您的收藏夹满啦，需要清理一下').then(() =>{
                    handleRouter({url: `/collection`, tag: 'p'})
                }).catch(() =>{})

            // 发送请求收藏请求
            const addList = [objectId, ...userData.myCollection]
            sendCollection({
                myCollection: addList
            }).then(res =>{
                const {code} = res.data
                if(code === 0) return tText('收藏失败, 请稍后再试')
                tText(`已收藏`)

                // 把搜藏的物品 id保存
                userData.myCollection = addList
                this.collectionName = 'collection_had'
                this.collectionTag = true
            })
        },
        // 取消搜藏
        rejectCollection(){
            const {userData, objectId, tText, sendCollection} = this
            const i = userData.myCollection.findIndex(item => item === objectId)
            const reList = userData.myCollection.slice()
            reList.splice(i, 1)

            sendCollection({
                myCollection: reList
            }).then(res =>{
                const {code} = res.data
                if(code === 0) return tText('取消失败, 请稍后再试')
                tText(`已取消收藏`)

                // 把当前的 收藏id移除
                userData.myCollection = reList
                this.collectionName = 'collection_no'
                this.collectionTag = false
            })
        },
        // 更多操作
        onSelect(item, index){
            const {deObject, cheId, userData, objectId, maxCLen, sendCollection,  
                    handleRouter, dConfirm, tText, dAlert} = this
            switch(item.id){
                case 1://删除
                    dConfirm('提示', '是否删除该寻物消息?')
                    .then(() =>{
                        deObject({objectId}).then(res =>{
                           const {code} = res.data
                           if(code === 0) return dAlert('删除失败')

                           dAlert('删除成功').then(() =>{
                              handleRouter({url: `/c/center/${cheId}`, tag: 'r'})
                           })
                        })
                        
                    }).catch(() =>{
                        console.log('取消')
                    })
                    break
                case 2://添加
                    handleRouter({url: `/c/redata/${cheId}`, tag: 'p'})
                    break
                default:
                    return
            }
        },
        loadData(){
            this.handleGetCommit()
            console.log('加载')
        }
    },
    components:{
        Load
    }
}
</script>

<style lang="less" scoped>
#detail{
    .header{
        position: fixed;
        top: 0;
        left: 0;
        width: 98%;
        z-index: 10;
        padding: 1%;
        background-color: rgba(0, 0, 0, 0.2);
        .left{
            float: left;
        }
        .right{
            float: right;
        }
    }
    .swip-wrap{
        height: 250px;
        overflow: hidden;
    }
    .detail-info{
        padding-bottom: 60px;
        .title{
            text-align: center;
            padding: 10px 0;
            color: #fff;
        }
        .info{
            .title{
                background-color: #088fff;
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
                            overflow-wrap: break-word;
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
    }
}
</style>