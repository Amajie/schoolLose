<template>
    <div id="concren">
        <div class="header b">
            <van-nav-bar
                @click-left="back"
                :border="false"
                title="我的关注"
            >
                <van-icon name="arrow-left" slot="left" size="2em" color="#fff" />
            </van-nav-bar>
        </div>
        <div class="concren-wrap">
            <van-swipe-cell
                v-for="(item, index) in concrenData"
                :key="index"
                @click.native="toUserCenter(item.cheId)"
            >
                <van-cell :border="true" clickable>
                    <template slot="icon">
                        <div class="item">
                            <van-image
                                width="35"
                                height="35"
                                fit="cover"
                                round
                                :src="item.avater"
                            />
                            <p>{{item.userName}}</p>
                        </div>
                    </template>
                </van-cell>
                <template slot="right">
                    <van-button @click="rejectConcren(index, item.cheId, item.userName)" square type="danger" text="取消" />
                </template>
            </van-swipe-cell>
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

        // 判断是否有关注列表
        if(this.userData.myConcern.length === 0) return this.isEmpty = true
        // 有则发送请求拿取
        this.getConcren({
            concrenList: JSON.stringify(this.userData.myConcern)
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
        rejectConcren(index, concrenId, userName){
            const {tText, userData, dConfirm, concren} = this
            dConfirm('提示', `是否取消关注${userName}?`).then(() =>{

                // 查询克隆
                const i = userData.myConcern.indexOf(concrenId)
                const myC = userData.myConcern.slice()
                myC.splice(i, 1)
                
                concren({myConcern: myC}).then(res =>{
                    const {code} = res.data
                    if(code === 0) return tText('取消关注失败, 请稍后再试')
                    tText(`已取消关注 ${userName}`)

                    // 关注对象 添加到关注列表
                    this.userData.myConcern = myC
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