<template>
    <div id="detail">
         <div class="header">
            <div @click="goCenter" class="left">
                <icon name="detail_arrow" :w="svg" :h="svg"></icon>
            </div>
            <div class="right">
                <icon name="detail_chat" :w="svg" :h="svg"></icon>
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
            detailData:{}
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
        }
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
        padding-bottom: 20px;
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
        .commit{
            .title{
                background-color: red;
            }
        }
    }
}
</style>