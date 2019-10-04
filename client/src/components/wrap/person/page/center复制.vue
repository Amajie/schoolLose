<template>
    <div id="center">
        <div class="t">
            <div class="header">
                <div @click="$router.replace('/person')" class="right">
                    <icon name="left_arrow" :w="svg" :h="svg"></icon>
                </div>
                <div class="seach">
                    <van-search
                        placeholder="请输入搜索关键词"
                        shape="round"
                        background="#ff0000"
                    />
                </div>
                <!-- 这个要根据是主人还是 访客显示不同的图标 -->
                <!-- <div @click="$router.replace('/person')" class="left">
                    <icon name="tip" :w="svg" :h="svg"></icon>
                </div> -->
                <div @click="add_info" class="left">
                    <icon name="add_info" :w="svg" :h="svg"></icon>
                </div>
            </div>
            <div class="center-wrap">
                <div class="center">
                    <router-link to="/center" class="center-opa">
                        <van-row type="flex" justify="center">
                            <van-col span="6">
                                <!-- 头像 -->
                                <div class="item">
                                    <img class="hi" :src="userData.avater" />
                                </div>
                            </van-col>
                            <van-col span="12">
                                <!--未登陆显示信息 -->
                                <div class="item">
                                    <p class="un">
                                        车神-黄杰
                                    </p>
                                </div>
                            </van-col>
                            <van-col span="3">
                                <!--关注 -->
                                <div class="item" @click="loading=false">
                                    <icon name="concern" :w="svg" :h="svg"></icon>
                                </div>
                            </van-col>
                        </van-row>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="b">
            <van-dropdown-menu :close-on-click-outside="false">
                <van-dropdown-item v-model="title" :options="selectTile" />
                <van-dropdown-item title="刷选">
                    <!-- 这是单选的 -->
                    <van-radio-group v-model="radio">
                        <van-cell-group>
                            <van-cell title="时间升序" clickable @click="radio = '1'">
                                <van-radio slot="right-icon" name="1" />
                            </van-cell>
                            <van-cell title="时间降序" clickable @click="radio = '2'">
                                <van-radio slot="right-icon" name="2" />
                            </van-cell>
                        </van-cell-group>
                    </van-radio-group>
                    <!-- 这是 多选的 可以选择类型 时间段 -->
                    <div class="info-list">
                        <van-cell-group>

                            <van-field
                                readonly
                                clickable
                                label="起始时间"
                                v-model="startTime"
                                size="large"
                                placeholder="丢失或者拾获时间点"
                                @click.native="showDate = !showDate"
                            />
                            <van-field
                                readonly
                                clickable
                                label="结束时间"
                                v-model="endTime"
                                size="large"
                                placeholder="丢失或者拾获时间点"
                                @click.native="showDate = !showDate"
                            />
                            <van-field
                                readonly
                                clickable
                                label="物品类型"
                                v-model="objectType"
                            />
                        </van-cell-group>
                    </div>
                    <van-button block type="info">确认</van-button>
                </van-dropdown-item>
            </van-dropdown-menu>
            <!-- <div class="info-wrap">
                <div class="info-list"> -->
                    <!-- 信息填写 -->
                    <!-- <van-cell-group>
                        <van-field
                            readonly
                            label="姓名"
                            v-model="userData.name"
                        />
                        <van-field
                            readonly
                            label="学号"
                            v-model="userData.stId"
                        />
                        <van-field
                            readonly
                            label="性别"
                            v-model="userData.gender"
                        />
                        <van-field
                            readonly
                            label="身份"
                            v-model="userData.userType"
                        />
                        <van-field
                            readonly
                            label="学院"
                            v-model="userData.courtyard"
                        />
                        <van-field
                            readonly
                            label="专业"
                            v-model="userData.major"
                        />
                        <van-field
                            readonly
                            label="班级"
                            v-model="userData.classes"
                        />

                        <van-field
                            readonly
                            label="宿舍地址"
                            v-model="userData.address"
                        />
                        <van-field
                            readonly
                            label="邮箱"
                            v-model="userData.email"
                        />
                    </van-cell-group>
                </div>
            </div> -->
        </div>
        <div class="selectDate">
            <van-action-sheet v-model="showDate" round 
                :close-on-click-overlay="false"
                >
                <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    :min-date="minTime"
                    :max-date="maxTime"
                    @confirm="selectTime"
                    @cancel="showDate = !showDate"
                />
            </van-action-sheet>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return{
            svg: 30,
            title: 0,
            startTime: '2019-01-01',
            endTime: '2019-12-12',
            objectType: '校园卡',
            selectTile: [
                { text: '全部消息', value: 0 },
                { text: '丢失消息', value: 1 },
                { text: '拾获消息', value: 2 }
            ],
            radio: '1',
            currentDate: new Date(),
            maxTime: new Date(),
            minTime: new Date(`${new Date().getFullYear()-4}-01-01`),//后四年
            showDate: false
        }
    },
    computed:{
        ...mapState([
            'userData'
        ])
    },
    created(){
        console.log(this.userData)
    },
    methods:{
        add_info(){
            this.$router.replace('/redata')
        },
        //时间确认
        selectTime(val){
            this.showDate = !this.showDate
            this.startTime = `${val.getFullYear()}-${('0'+val.getMonth()).slice(-2)}-${('0'+val.getDate()).slice(-2)}`
        }
    }
}
</script>

<style lang="less" scoped>
#center{
    height: 100%;
    .t{
        background-color: #ff0000;
        .header{
            display: flex;
            padding: 0 7px;
            .seach{
                flex: 1;
            }
            .right{
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .left{
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }
        .center-wrap{
            .center{
                padding: 5px 0;
                .center-opa{
                    .item{
                        display: flex;
                        height: 100%;
                        flex-direction: column;
                        justify-content: center;
                        .hi{
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                        }
                        .un{
                            color: #ebedf0;
                            font-size: 20px;
                        }
                    }
                }
            }
        }
    }
    .b{
      .info-wrap{
          padding: 0 1%;
          padding-bottom: 10px;
      }
    }
}
</style>