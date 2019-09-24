<template>
    <div id="home">
        <div class="header">
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
        </div>
        <div class="nav-wrap">
            <div class="nav-list">
                <van-grid clickable :column-num="4">
                    <van-grid-item :to="item.url" v-for="(item, index) in nav_list" :key="index">
                        <icon :name="item.name" :w="svg" :h="svg"></icon>
                        <span>{{item.text}}</span>
                    </van-grid-item>
                </van-grid>
            </div>
        </div>  
    </div>
</template>

<script>
export default {
    data(){
        return{
            svg: 35,
            isLogin: false,
            nav_list: [
                {text: '校园卡', name: 'school_car', url: '/', id: 66},
                {text: '借书证', name: 'library_card', url: '/', id: 66},
                {text: '身份证', name: 'id_car', url: '/', id: 66},
                {text: '手机', name: 'phone', url: '/', id: 66},
                {text: '耳机', name: 'headset', url: '/', id: 66},
                {text: 'U盘', name: 'usb_drive', url: '/', id: 66},
                {text: '首饰', name: 'jewelry', url: '/', id: 66},
                {text: '眼镜', name: 'glasses', url: '/', id: 66},
                {text: '手表', name: 'watch', url: '/', id: 66},
                {text: '书籍', name: 'book', url: '/', id: 66},
                {text: '水杯', name: 'water', url: '/', id: 66},
                {text: '雨伞', name: 'umbrella', url: '/', id: 66},
            ]
        }
    }
}
</script>

<style lang="less" scoped>
#home{
    .header{
        display: flex;
        background-color: #008fff;
        .seach{
            flex: 1;
        }
        .left{
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-right: 10px;
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