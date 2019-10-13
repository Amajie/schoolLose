<template>
    <div id="person">
        <div class="header b">
            <van-nav-bar
                @click-left="$router.replace('/set')"
                @click-right="$router.push(`/c/redata/${userData.cheId}`)"
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
                <div @click="$router.push(`/c/center/${userData.cheId}`)" class="p-person-opa">
                    <van-row type="flex" justify="center">
                        <van-col span="8">
                            <!-- 头像 -->
                            <div class="peoson_img" @click.stop="show_img_action = true">
                                <img :src="userData.avater">
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
                <div class="cell-wrap">
                    <div class="cell-list">
                        <div class="cell-item">
                            <img src="../../../assets/person/person_concern.png" alt="">
                            <van-cell title-class="text" title="我的关注" is-link>
                                <van-icon
                                    slot="right-icon"
                                    name="arrow"
                                    color="#969799"
                                    style="line-height: inherit;"
                                />
                            </van-cell>
                        </div>
                        <div class="cell-item">
                            <img src="../../../assets/person/person_collect.png" alt="">
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
                            <img src="../../../assets/person/person_word.png" alt="">
                            <van-cell title-class="text" title="我的留言" is-link>
                                <van-icon
                                    slot="right-icon"
                                    name="arrow"
                                    color="#969799"
                                    style="line-height: inherit;"
                                />
                            </van-cell>
                        </div>
                        <div class="cell-item">
                            <img src="../../../assets/person/person_complaint.png" alt="">
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
                            <img src="../../../assets/person/person_about.png" alt="">
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
        <div class="show_himg">
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
            bigAvater: [],
        }
    },
    computed:{
        ...mapState([
            'userData'
        ])
    },
    created(){
        this.bigAvater[0] = this.userData.avater
    },
    methods:{
        ...mapMutations([
            'setUserData'
        ]),
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