<template>
    <div id="home">
        <div class="header">
            <van-sticky>
                <div class="seach">
                    <van-search
                        placeholder="请输入搜索关键词"
                        shape="round"
                        background="#008fff"
                    />
                </div>
                <div class="left">
                    <div v-if="isLogin" class="active-no">
                        <span>登陆</span>
                    </div>
                    <div v-if="!isLogin" class="active">
                        <icon name="user_active" :w="svg" :h="svg"></icon>
                    </div>
                </div>
            </van-sticky>
        </div>
        <div class="nav-wrap">
            <div class="nav-list">
                <van-grid clickable :column-num="4">
                    <van-grid-item :to="item.url" v-for="(item, key, index) in type_nav" :key="index">
                        <icon :name="item.name" :w="svg" :h="svg"></icon>
                        <span>{{key}}</span>
                    </van-grid-item>
                </van-grid>
            </div>
        </div>  
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data(){
        return{
            svg: 35,
            isLogin: false,
        }
    },
    computed:{
        ...mapState([
            'type_nav'
        ])
    }
}
</script>

<style lang="less" scoped>
#home{
    .header{
        
        .seach{
            flex: 1;
        }
        .left{
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-right: 7px;
            .active-no{
                color: #fff;
            }
        }
    }
    .nav-wrap{
        .nav-list{
           
           span{
                padding-top: 10px;
                color: #707c81;
            }
        }
    }
}
</style>