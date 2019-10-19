<template>
    <div id = "empty">
        <div class="empty-wrap">
            <div class="t">
                数据不见了~~~
            </div>
            <!-- <van-image
                width="100"
                height="100"
                src="https://img.yzcdn.cn/vant/cat.jpeg"
            /> -->
            <div class="i">
                <img src="../../assets/empty.png">
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
#empty{
    padding-top: 20px;
    .empty-wrap{
        width: 100%;
        .t{
            text-align: center;
            padding: 10px 0;
            font-size: 20px;
            color: #898c8f;
        }
        .i{
            > img{
                width: 150px;
                display: block;
                margin: 0 auto;
            }
        }
    }
}
</style>