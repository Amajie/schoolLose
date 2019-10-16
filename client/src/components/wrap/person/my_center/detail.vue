<template>
    <div @click="handleBlur" id="detail">
         <div class="header">
            <div @click.stop="handleRouter({})" class="left">
                <icon name="detail_arrow" :w="svg" :h="svg"></icon>
            </div>
            <div @click.stop="showOption = true" class="right">
                <icon name="more_right" :w="svg" :h="svg"></icon>
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
                    <van-cell title="丢失地点" :label="detailData.objectAddress" size="large" />
                    <van-cell title="楼主说明" :label="detailData.objectDesc" size="large" />
                </div>
            </div>
            <div class="commit-wrap">
                <van-sticky @scroll="handleScroll" :offset-top="0">
                    <div class="title">
                        --- 相关留言 ---
                    </div>
                </van-sticky>
                <div class="content">
                    <div class="item" 
                        @click.stop="handleReplayItem(index)"
                        v-for="(item, index) in commitData"
                        :key="index"
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
                            
                            <div v-if="item.toId" class="replay-text">
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
                                <p class="text">{{item.commit}}</p>
                                <p class="time-replay">{{item.commitTime | filterTime(true)}}</p>
                            </div>
                    </div>
                     <div class="commit-loading">
                        <Loading @fresh="handleGetCommit" v-bind="loadObj"/>
                    </div>
                    <div class="commit-end">{{noCommitText}}</div>
                </div>
            </div>
        </div>
        <div @click.stop class="commit-replay">
            <div class="replay-wrap">
                <div class="c-in">
                    <van-field ref="commitNode" v-model="commit" :placeholder="commitHolder"
                        type="textarea"
                        autosize
                        rows="1"
                        clearable
                        @focus="replayFocus">
                        <van-button slot="button" 
                            size="small" type="info" 
                            v-show="replayTag"
                            @click.stop="sendReplay" 
                        >发表</van-button>

                        <van-button slot="button" 
                            size="small" type="info" 
                            v-show="!replayTag && toId"
                            @click.stop="rejectReplay" 
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
import Loading from '../../../loading/loading.vue'
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
            toId: '',
            replayTag: false,
            options:[
                {name: '举报', id: 1},
                {name: '转发', id: 2}
            ],
            showOption: false,
            showLoad: false,
            noCommitText: '',
            loadObj: {}
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
            'detailData',
            'userData',
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
            if(this.cheId != this.userData.cheId) return

            this.options.push({name: '删除', id: 3})
            this.options.push({name: '编辑', id: 4})
            this.options.push({name: '添加', id: 5})
        },
        //获取详细信息
        handleGetDetail(){

            //显示loading
            this.showLoad = true

            this.getDetail({
                objectId: this.objectId,
                objectUserId: this.cheId
            }).then(res =>{

                console.log(res.data.detailData)
                const {code, detailData} = res.data
                if(code === 0) return console.log('查找失败')
                if(code === 200){
                    this.images = detailData.objectImg
                    this.setState({detailData})
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

            this.fCommit({
                infoId: this.$route.params.objectId
            }).then(res =>{
                const {code, commitData} = res.data
               
                // 获取数据 关闭加载
                this.loadObj = {
                    loadTag: false,
                    freshTag: false
                }

                if(code === 0) return this.noCommitText = '暂无用户评论'
                
                this.noCommitText = '没有更多了'
                this.commitData = commitData

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
            this.replayTag = false
            if(this.commit){
                this.saveCommit = this.commit
                this.commit = ''
            }
        },
        // 粘性布局 滚动事件
        handleScroll(){
            // 隐藏按钮
            this.replayTag = false
             // 失去焦点
            this.$refs.commitNode.blur()
        },
        //获取焦点
        replayFocus(){

            //显示发表字样
            this.replayTag = true
            //如果存在备份 就显示
            if(this.saveCommit){
                this.commit = this.saveCommit
                this.saveCommit = ''
            }
        },
        //点击评论 回复
        handleReplayItem(index){

            this.targetData = this.commitData[index]
            const {targetData, tText, $refs, userData} = this

            if(targetData.fromId === userData.cheId) return tText('只能回复别人哟')

            //保持获取焦点
            $refs.commitNode.focus()

            // 如果点击当前的就不需要在设置
            this.toId = targetData.fromId
            this.commitHolder = `回复: ${targetData.fromUserName}`
            //显示的取消回复
            this.replayTag = true
            //并且把之前的 评论内容清空
            this.commit = ''
            this.saveCommit = ''
        },
        // 发表评论
        sendReplay(){

            const {$refs, commit, toId, cheId, objectId, 
                    commitData, userData, targetData, setState} = this
            
            //保持获取焦点
            $refs.commitNode.focus()
            const commitTime = Date.now()
            if(!commit){
                return this.tText('请输入留言内容')
            }

            this.rCommit({
                infoId: objectId,
                fromId: userData.cheId,
                toId,
                commit,
                commitTime
            }).then(res =>{
                console.log(res)
                const {code} = res.data

                if(code === 0) return tText('留言失败，请稍后再试')

                let arrData = {}

                arrData.fromId = cheId
                arrData.toId = toId
                arrData.commit = commit
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
                //要根据是回复还是 留言
                this.commit = ''
                this.saveCommit = ''
                // 隐藏发布按钮
                this.replayTag = false
                this.commitData = [arrData, ...commitData]
            })
        },
        //取消 回复
        rejectReplay(){
            //此时把toId 清空
            this.toId = ''
            this.commitHolder = '我来说两句'
            // 清空目标人的信息
            this.targetData = null
        },
        // 更多操作
        onSelect(item, index){
            const {deObject, cheId, objectId, 
                    handleRouter, dConfirm, dAlert} = this
            switch(index){
                case 0://举报
                    break
                case 1://转发
                    break
                case 2://删除
                    dConfirm('提示', '是否删除该寻物消息?')
                    .then(res =>{
                        deObject({objectId}).then(res =>{
                           const {code} = res.data
                           if(code === 0) return dAlert('删除失败')

                           dAlert('删除成功').then(() =>{
                              handleRouter({url: `/c/center/${cheId}`, tag: 'r'})
                           })
                        })
                        
                    }).catch(res =>{
                        console.log('取消')
                    })
                    
                    break
                case 3://编辑
                    handleRouter({url: `/c/updata/${cheId}/${objectId}`, tag: 'p'})
                    break
                case 4://添加
                    handleRouter({url: `/c/redata/${cheId}`, tag: 'p'})
                    break
            }
        }
    },
    components:{
        Loading
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
        padding-bottom: 200px;
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
                    padding: 10px 0;
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
                        .replay-text{
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
                        .text{
                            font-size: 13px;
                            font-weight: bold;
                            color: #444547;
                        }
                        .time-replay{
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
                .commit-end{
                    text-align: center;
                    padding: 15px 0;
                    color: #ccc;
                }
            }
            
        }
    }
    .commit-replay{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 96%;
        padding: 5px 2%;
        // 粘性布局为 99
        // 图片预览为2002
        z-index: 110;
        background-color: #1e323f;
        .replay-wrap{
            .c-in{
                border-radius: 10px;
                overflow: hidden;
            }
        }
    }
}
</style>