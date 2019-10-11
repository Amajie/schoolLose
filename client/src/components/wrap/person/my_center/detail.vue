<template>
    <div @click="handleBlur" id="detail">
         <div class="header">
            <div @click="goCenter" class="left">
                <icon name="detail_arrow" :w="svg" :h="svg"></icon>
            </div>
            <div class="right">
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
                    <van-cell title="分类" :value="detailData.objectType" size="large" />
                    <van-cell title="物品名称" :value="detailData.objectName" size="large" />
                    <van-cell title="丢失时间" :value="detailData.objectTime | showTime" size="large" />
                    <van-cell title="发布时间" :value="detailData.sendTime | showTime" size="large" />
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
                    <div class="item" @click.stop="handleReplayItem">
                            <div class="item-info">
                            <div class="from">
                                <van-image
                                        :width="h_img_size"
                                        :height="h_img_size"
                                        round
                                        fit="cover"
                                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                                    />
                            </div>

                            <div class="from-name name">车神-黄杰</div>
                            
                            <div class="replay-text">
                                回复
                            </div>
                            <div class="to">
                                    <van-image
                                        :width="h_img_size"
                                        :height="h_img_size"
                                        round
                                        fit="cover"
                                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                                    />
                            </div>
                            <div class="to-name name">一个div</div>
                            </div>
                            <div class="item-commit">
                                <p class="text">
                                    让文字垂直居中对齐很简单，
                                    只要给类添加宽度和高度和行
                                    高就可以实现垂直居中对齐的效果
                                </p>
                                <p class="time-replay">
                                    2019-19-21 12:33
                                </p>
                            </div>
                    </div>
                    <div class="item" @click.stop="handleReplayItem">
                            <div class="item-info">
                            <div class="from">
                                <van-image
                                        :width="h_img_size"
                                        :height="h_img_size"
                                        round
                                        fit="cover"
                                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                                    />
                            </div>

                            <div class="from-name name">车神-黄杰</div>
                            
                            <div class="replay-text">
                                回复
                            </div>
                            <div class="to">
                                    <van-image
                                        :width="h_img_size"
                                        :height="h_img_size"
                                        round
                                        fit="cover"
                                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                                    />
                            </div>
                            <div class="to-name name">一个div</div>
                            </div>
                            <div class="item-commit">
                                <p class="text">
                                    让文字垂直居中对齐很简单，
                                    只要给类添加宽度和高度和行
                                    高就可以实现垂直居中对齐的效果
                                </p>
                                <p class="time-replay">
                                    2019-19-21 12:33
                                </p>
                            </div>
                    </div>
                    <div class="item" @click.stop="handleReplayItem">
                            <div class="item-info">
                            <div class="from">
                                <van-image
                                        :width="h_img_size"
                                        :height="h_img_size"
                                        round
                                        fit="cover"
                                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                                    />
                            </div>

                            <div class="from-name name">车神-黄杰</div>
                            
                            <div class="replay-text">
                                回复
                            </div>
                            <div class="to">
                                    <van-image
                                        :width="h_img_size"
                                        :height="h_img_size"
                                        round
                                        fit="cover"
                                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                                    />
                            </div>
                            <div class="to-name name">一个div</div>
                            </div>
                            <div class="item-commit">
                                <p class="text">
                                    让文字垂直居中对齐很简单，
                                    只要给类添加宽度和高度和行
                                    高就可以实现垂直居中对齐的效果
                                </p>
                                <p class="time-replay">
                                    2019-19-21 12:33
                                </p>
                            </div>
                    </div>
                    <div class="item" @click.stop="handleReplayItem">
                            <div class="item-info">
                            <div class="from">
                                <van-image
                                        :width="h_img_size"
                                        :height="h_img_size"
                                        round
                                        fit="cover"
                                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                                    />
                            </div>

                            <div class="from-name name">车神-黄杰</div>
                            
                            <div class="replay-text">
                                回复
                            </div>
                            <div class="to">
                                    <van-image
                                        :width="h_img_size"
                                        :height="h_img_size"
                                        round
                                        fit="cover"
                                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                                    />
                            </div>
                            <div class="to-name name">一个div</div>
                            </div>
                            <div class="item-commit">
                                <p class="text">
                                    让文字垂直居中对齐很简单，
                                    只要给类添加宽度和高度和行
                                    高就可以实现垂直居中对齐的效果
                                </p>
                                <p class="time-replay">
                                    2019-19-21 12:33
                                </p>
                            </div>
                    </div>
                    <div class="item" @click.stop="handleReplayItem">
                            <div class="item-info">
                            <div class="from">
                                <van-image
                                        :width="h_img_size"
                                        :height="h_img_size"
                                        round
                                        fit="cover"
                                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                                    />
                            </div>

                            <div class="from-name name">车神-黄杰</div>
                            
                            <div class="replay-text">
                                回复
                            </div>
                            <div class="to">
                                    <van-image
                                        :width="h_img_size"
                                        :height="h_img_size"
                                        round
                                        fit="cover"
                                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                                    />
                            </div>
                            <div class="to-name name">一个div</div>
                            </div>
                            <div class="item-commit">
                                <p class="text">
                                    让文字垂直居中对齐很简单，
                                    只要给类添加宽度和高度和行
                                    高就可以实现垂直居中对齐的效果
                                </p>
                                <p class="time-replay">
                                    2019-19-21 12:33
                                </p>
                            </div>
                    </div>
                    <div class="commit-end">
                        没有更多了
                    </div>
                </div>
            </div>
        </div>
        <div @click.stop class="commit-replay">
            <div class="commit-wrap">
                <div class="c-in">
                    <van-field ref="commitNode" v-model="commit" :placeholder="commitHolder"
                        type="textarea"
                        autosize
                        rows="1"
                        clearable
                        @focus="replayFocus"
                        @blur="replayBlur">
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
    </div>
</template>

<script>
import {ImagePreview} from 'vant'
export default {
    data(){
        return {
            svg: 30,
            images: [],
            detailData:{},
            h_img_size: 35,
            commit: '',
            saveCommit: '',
            commitHolder: '我来说两句',
            toId: '',
            replayTag: false,
        }
    },
    created(){
         this.cheId = this.$route.params.cheId
         this.objectId = this.$route.params.objectId

         this.getDetail({
             objectId: this.objectId,
             objectUserId: this.cheId
         }).then(res =>{
             console.log(res.data.detailData)
             const {code, detailData} = res.data
             if(code === 0) return console.log('查找失败')
             if(code === 200){
                 this.detailData = detailData
                 this.images = detailData.objectImg
             }
         })
    },
    methods:{
        showBigImg(startPosition){

            const {images} = this
            this.isColse = ImagePreview({
                images,
                startPosition
            })
        },
        goCenter(){
            console.log(this.cheId)
            this.$router.replace(`/c/center/${this.cheId}`)
        },
        handleBlur(){
            console.log('点击')
            // 隐藏发表按钮
            this.replayTag = false
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
            }
        },
        //失去焦点
        replayBlur(){

            //如果存在 内容则备份
            if(this.commit){
                this.saveCommit = this.commit
                this.commit = ''
                console.log('备份')
            }
        },
        //点击评论 回复
        handleReplayItem(){
            //保持获取焦点
            this.$refs.commitNode.focus()
            // 如果点击当前的就不需要在设置
            this.toId = '车神-黄杰'
            this.commitHolder = `回复: 车神-黄杰`
            //显示的取消回复
            this.replayTag = true
            //并且把之前的 评论内容清空
            this.commit = ''
            this.saveCommit = ''
        },
        // 发表评论
        sendReplay(){
            //保持获取焦点
            this.$refs.commitNode.focus()

            if(!this.commit){
                return this.tText('请输入留言内容')
            }

            console.log('设置')
            /**
             * 这里模拟了发布请求 这些都是发送请求成功之后做事情
             */
            setTimeout(() =>{
                
                this.commit = ''
                this.saveCommit = ''
                // 隐藏发布按钮
                this.replayTag = false
                // 失去焦点
                this.$refs.commitNode.blur()
            }, 1000)
        },
        //取消 回复
        rejectReplay(){
            //此时把toId 清空
            this.toId = ''
            this.commitHolder = '我来说两句'
        },
        //当点击
        clickItem(){}
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
        padding-bottom: 80px;
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
                    padding: 5px 0;
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
        .commit-wrap{
            .c-in{
                border-radius: 10px;
                overflow: hidden;
            }
        }
    }
}
</style>