<template>
    <div id="collection">
        <div class="header b">
            <van-nav-bar
                @click-left="back"
                :border="false"
                title="我的关注"
            >
                <van-icon name="arrow-left" slot="left" size="2em" color="#fff" />
            </van-nav-bar>
        </div>
        <div class="collection-wrap">

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
            concrenData: [],
            isEmpty: false
        }
    },
    computed:{
        ...mapState([
            'userData'
        ])
    },
    inject: ['reload'],
    created(){
        const collectionList = this.userData.myConcern
        if(collectionList.length === 0) return this.isEmpty = true
        this.getConcren({
            collectionList: JSON.stringify(collectionList)
        }).then(res =>{
            this.concrenData = res.data.concrenData
        })
    },
    methods:{
        ...mapMutations([
            'setState',
            'toUserCenter'
        ]),
        //取消关注
        rejectCollection(index, collectionId){
            const {tText, dConfirm, collection} = this
            dConfirm('提示', `是否取消搜藏该帖子`).then(() =>{
                collection({
                    collectionId: detailData.objectId,
                    collectionTag: JSON.stringify(true)
                }).then(res =>{
                    const {code} = res.data
                    if(code === 0) return tText('取消收藏失败, 请稍后再试')
                    tText(`已取消收藏`)

                    // 关注对象 添加到关注列表
                    this.userData.otherConcern.splice(index, 1)
                    this.reload()
                })
            })
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
#concren{
    .concren-wrap{
        .item{
            display: flex;
            p{
                line-height: 35px;
                padding-left: 10px;
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