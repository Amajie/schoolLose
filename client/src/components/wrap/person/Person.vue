<template>
    <div id="person">
        <div class="header b">
            <van-nav-bar
                @click-left="() => $router.replace('/set')"
                @click-right="add"
                :border="false"
            >
                <van-icon name="add-o" slot="right" size="2em" color="#fff" />
                <!-- 这里可以设置一个小红点 说明信息没有完善 -->
                <van-icon name="setting-o" slot="left" dot size="2em" color="#fff" />
            </van-nav-bar>
        </div>
        <div class="p-wrap">
            <!-- 登陆注册头像 -->
            <div class="p-person">
                <div @click="$router.replace('/center')" class="p-person-opa">
                    <van-row type="flex" justify="center">
                        <van-col span="8">
                            <!-- 头像 -->
                            <div class="peoson_img" @click.stop="show_img_action = true">
                                <img  :key="avater" :src="avater">
                            </div>
                        </van-col>
                        <van-col span="16">
                              <!--未登陆显示信息 -->
                              <div class="person_info">
                                  <h2 class="t">{{userData.userName}}</h2>
                              </div>
                        </van-col>
                    </van-row>
                </div>
            </div>
            <div class="cell-nav">
                <div class="nav-wrap">
                    <div class="nav-list">
                        <div @click="add" class="nav-item">
                            <p>12</p>
                            <span>失主发布</span>
                        </div>
                    
                        <div class="nav-item">
                            <p>0</p>
                            <span>拾主发布</span>
                        </div>
                    
                        <div class="nav-item">
                            <p>56</p>
                            <span>我的关注</span>
                        </div>
                    </div>
                </div>
                <div class="cell-wrap">
                    <div class="cell-list">
                        <div class="cell-item">
                            <img src="../../../assets/person/collect.png" alt="">
                            <van-cell title-class="text" title="我的收藏" is-link>
                                <van-icon
                                    slot="right-icon"
                                    name="arrow"
                                    color="#969799"
                                    style="line-height: inherit;"
                                />
                            </van-cell>
                        </div>
                        <div class="cell-item">
                            <img src="../../../assets/person/complaint.png" alt="">
                            <van-cell title-class="text" title="投诉建议" is-link>
                                <van-icon
                                    slot="right-icon"
                                    name="arrow"
                                    color="#969799"
                                    style="line-height: inherit;"
                                />
                            </van-cell>
                        </div>
                        <div class="cell-item">
                            <img src="../../../assets/person/about.png" alt="">
                            <van-cell title-class="text" title="关于车神寻物" is-link>
                                <van-icon
                                    slot="right-icon"
                                    name="arrow"
                                    color="#969799"
                                    style="line-height: inherit;"
                                />
                            </van-cell>
                        </div>
                    </div>
                </div>
                <div class="logout-wrap" @click="logoutCount">   
                    <van-button type="danger" block>退出当前帐号</van-button>
                </div>
            </div>
        </div>
        <div class="action-opa">
            <van-action-sheet
                v-model="show_img_action"
                :actions="actions"
                :round="true"
                :close-on-click-action="true"
                @select="onSelect"
            />
        </div>
        <div class="show_himg" @click="add">
            <van-image-preview
                v-model="show_img"
                :images="bigAvater"
                :showIndex="false"
                >
            </van-image-preview>
       </div>
    </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
export default {
    data(){
        return{
            svgWH: 25,
            show_img_action: false,
            actions: [
                {name:'查看大头像', id: 1},
                {name:'更换头像', id: 2}
            ],
            show_img: false,
            bigAvater: [
                'http://192.168.43.124:7070/av/init.png'
            ],
            avater: require('../../../assets/init.png')
        }
    },
    computed:{
        ...mapState([
            'userData'
        ])
    },
    created(){
        
        if(this.userData.avater){
            this.avater = this.userData.avater
            this.bigAvater[0] = this.avater
        }

    },
    methods:{
        ...mapMutations([
            'setUserData'
        ]),
        add(event){
            alert('车神')
        },
        /**
         * @function 退出当前登陆
         *  1 退出当前账号 不只是路由的跳转
         *  2 还有信息的清除
         * 
         */
        logoutCount(){
            this.$router.replace('/login')
        },
                //这个是 上拉菜单选项框
        onSelect(item){
            console.log(this.userData)
            const {id, show_img} = item
            if(id === 1) return this.show_img = !show_img
            if(id === 2) return this.$router.replace('/cimg')
        },
    }
}
</script>
<style lang="less" scoped>
#person{
    height: 100%;
    background-color: #f5f5f5;
    overflow: auto;
    .p-wrap{
        padding-bottom: 88px;
        .p-person{
            background: #008fff;
            padding: 15px;
            .p-person-opa{
                .peoson_img{
                    > img{
                        width: 85px;
                        height: 85px;
                        border-radius: 50%;
                        max-width: 85px;
                    }
                }
                .person_info{
                    display: flex;
                    height: 100%;
                    flex-direction: column;
                    justify-content: center;
                    .t{
                        color: #ebedf0;
                    }
                }
            }
        }
        .cell-nav{
            padding: 0 2%;
            margin-top: 10px;
            // 列表导航栏
            .nav-wrap{
                text-align: center;
                .nav-list{
                    display: flex;
                    background: #ffffff;
                    border-radius: 10px;
                    .nav-item{
                        flex: 1;
                        height: 100%;
                        padding: 10px 0;
                        span{
                            color: #a5a5a6;
                            font-size: 13px;
                        }
                        p{
                            display: block;
                            padding-bottom: 5px;
                            font-weight: 700;
                            font-size: 20px;
                            color: #333333;
                        }
                    }
                }
            }
            // cell 列表
             .cell-wrap{
                .cell-list{
                    .cell-item{
                        position: relative;
                        border-radius: 10px;
                        overflow: hidden;
                        margin: 10px 0;
                        .text{
                            font-size: 19px;
                            color: #333;
                            padding-left: 30px;
                        }
                        img{
                            position: absolute;
                            left: 0;
                            top: 50%;
                            margin-left: 10px;
                            margin-top: -15px;
                            width: 30px;
                            height: 30px;
                            z-index: 10;
                        }
                    }
                }
            }
        }
    }
}
</style>