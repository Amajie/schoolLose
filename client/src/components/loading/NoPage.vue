<template>
    <div id = "noPage">
        <div class="header b">
            <van-nav-bar
                :border="false"
                title="404页面"
            />
        </div>
        <div class="noPage-wrap">
            <div class="t">
               <van-button @click.native="$router.replace('/home')" type="primary">返回首页</van-button>
            </div>
            <div class="i">
                <img src="http://127.0.0.1:7070/init/noPage.png">
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
#noPage{
    .noPage-wrap{
        padding-top: 50px;
        width: 100%;
        .t{
            text-align: center;
            padding: 15px 0;
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