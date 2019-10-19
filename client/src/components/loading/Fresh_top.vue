<template>
    <div id="fresh-top">
        <div v-if="freshTag" class="fresh" @click="$emit('fresh')">
            <img src="../../assets/fresh-btn.png">
            <p>刷新</p>
        </div>
        <div class="top" @click="() =>{}">
            <img src="../../assets/top.png">
            <p>顶部</p>
        </div>
    </div>
</template>
<script>

export default {
    data(){
        return{

        }
    },
    props:['freshTag']
}
</script>
<style lang="less" scoped>
#fresh-top{
    position: fixed;
    right: 0px;
    bottom: 50px;
    > div{
        margin-bottom: 5px;
        padding: 5px;
        border-radius: 5px 0 0 5px;

        background: rgba(0, 0, 0, 0.7);
        p{
            font-size: 13px;
            color: #fff;
            text-align: center;
        }
        img{
            width: 25px;
            height: 25px;
        }
    }
}
</style>