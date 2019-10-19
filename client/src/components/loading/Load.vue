<template>
    <div id="loading" v-if="loadTag || freshTag">
        <div class="loading-warp" v-if="loadTag">
            <div class="wrap">
                <van-loading size="50" color="#e80000" >加载中</van-loading>
            </div>
        </div>
        <div class="fresh-btn" v-if="freshTag">
            <div class="text">
                数据跑飞了呢，点击刷新吧
            </div>
            <div class="btn-wrap">
                <div class="i">
                    <img src="../../assets/fresh-btn.png" alt="">
                </div>
                <div class="b">
                    <van-button @click="$emit('fresh')" type="primary">点击刷新</van-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{}
    },
    props: ['loadTag', 'freshTag']
}
</script>

<style lang="less" scoped>
#loading{
    width: 100%;
    padding: 30px 0;
    .loading-warp{
        position: relative;
        > div{
            position: absolute;
            left: 50%;
            margin-left: -25px;
            width: 50px;
            height: 100px;
        }
    }
    .fresh-btn{
        .text{
            text-align: center;
            color: #223841;
        }
        .btn-wrap{
            position: relative;
            padding: 10px 0;
            > div{
                position: absolute;
                top: 50%;
                left: 50%;
            }
            .i{
                margin-left: -55px;
                > img{
                    width: 40px;
                    height: 40px;
                }
            }
            .b{
                margin-left: -10px;
            }
        }
    }
}
</style>