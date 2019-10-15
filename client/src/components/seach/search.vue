<template>
    <div id="search">
        <van-sticky>
            <div class="header">
                <div @click="$router.go(-1)" class="cancel ct">
                    <van-icon size="25" color="#fff" name="arrow-left" />
                </div>
                <div class="header-search">
                    <van-search
                        placeholder="请输入搜索关键词"
                        shape="round"
                        background="#008fff"
                        v-model="target"
                    />
                </div>
                <div @click.stop="handleSeach" class="search-btn ct">
                    <van-button type="info" size="normal">搜索</van-button>
                </div>
            </div>
            <div class="b">
                <van-dropdown-menu 
                    :close-on-click-outside="false"
                    :close-on-click-overlay="false"
                >
                    <van-dropdown-item v-model="objectWay" :options="selectTile" />
                    <van-dropdown-item ref="choose" title="刷选">
                        <!-- 这是单选的 -->
                        <van-radio-group v-model="upDownTag">
                            <van-cell-group>
                                <van-cell title="时间降序" clickable @click="upDownTag = '0'">
                                    <van-radio slot="right-icon" name="0" />
                                </van-cell>
                                <van-cell title="时间升序" clickable @click="upDownTag = '1'">
                                    <van-radio slot="right-icon" name="1" />
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
                                    v-model="showStartTime"
                                    size="large"
                                    placeholder="丢失或者拾获时间点"
                                    @click.native="handletimeType('showStartTime', 'startTime')"
                                />
                                <van-field
                                    readonly
                                    clickable
                                    label="结束时间"
                                    v-model="showEndTime"
                                    size="large"
                                    placeholder="丢失或者拾获时间点"
                                    @click.native="handletimeType('showEndTime', 'endTime')"
                                />
                                <van-field
                                    readonly
                                    clickable
                                    label="物品类型"
                                    v-model="objectType"
                                    @click.native="showType = !showType"
                                />
                            </van-cell-group>
                        </div>
                        <div @click.stop="handleCloseMenu" class="info-btn">
                            <van-button block type="info">确认</van-button>
                        </div>
                    </van-dropdown-item>
                </van-dropdown-menu>
            </div>
        </van-sticky>
        <div class="selectDate">
            <van-action-sheet v-model="showDate" round
                >
                <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    cancel-button-text="不限"
                    :min-date="minTime"
                    :max-date="maxTime"
                    
                    @confirm="selectTime"
                    @cancel="cancelSelectTime"
                />
            </van-action-sheet>
        </div>
        <div class="selectType">
            <van-popup v-model="showType" position="bottom">
                <van-picker
                    show-toolbar
                    title="物品类型"
                    cancel-button-text="不限"
                    :columns="type_nav | filterType"
                    @cancel="showType = !showType"
                    @confirm="selectType"
                />
            </van-popup>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return{
            svg: 35,
            target: '',//搜索关键字
            objectWay: 2,
            showStartTime: '不限',
            showEndTime: '不限',
            startTime: '',
            endTime: '',
            objectType: '不限',
            objectTypeId: '',
            selectTile: [
                { text: '丢失消息', value: 0 },
                { text: '拾获消息', value: 1 },
                { text: '全部消息', value: 2 },
            ],
            upDownTag: '0',
            currentDate: new Date(),
            maxTime: new Date(),
            minTime: new Date(`${new Date().getFullYear()-4}-01-01`),//后四年
            showDate: false,
            showType: false,
        }
    },
    created(){
             
    },
    computed:{
        ...mapState([
            'type_nav',
        ])
    },
    methods:{
        //时间确认
        selectTime(datetime){
            const {showDate, timeType, timeStarmp, showTime} = this
            
            this.showDate = !showDate

            this[timeType] = this.showTime(datetime)

            // 起始时间是00:00:00
            if(timeStarmp === 'startTime') {
                console.log(new Date(`${this[timeType]} 00:00:00`))
                this[timeStarmp] = new Date(`${this[timeType]} 00:00:00`).getTime()
                return
            }
            //结束时间 是 23:59:59
            this[timeStarmp] = new Date(`${this[timeType]} 23:59:59`).getTime()

        },
        //物品的选择
        selectType(val){
            
            const {type_nav, showType, selectTypeId} = this
            this.showType = !this.showType
            this.objectType = val
            this.objectTypeId = selectTypeId(type_nav, val)
        },
        cancelSelectTime(){
            const {showDate, timeType, timeStarmp} = this
            this.showDate = !showDate
            this[timeType] = '不限'
            this[timeStarmp] = ''
        },
        handletimeType(timeType, timeStarmp){
            this.showDate = !this.showDate
            this.timeType = timeType
            this.timeStarmp = timeStarmp
        },
        // 发送搜索请求
        handleSeach(){
            // 此时的物品类型 获取的该类型的id
            // 结束时间 不能 比开始时间小 这里可以检索 一下 自动设置 或者给提示
            const {cheId, startTime, endTime, objectWay, target,
                 objectTypeId, upDownTag, gSearchInfo, $route} = this 
            // console.log('startTime: '+startTime)
            // console.log('endTime'+endTime)
            // console.log('objectWay: '+objectWay)
            // console.log('objectTypeId: '+objectTypeId)
            // console.log('upDownTag: '+ upDownTag)
            const params = {
                target,
                startTime,
                endTime,
                objectTypeId,
                upDownTag,
                objectWay: objectWay != 2?objectWay: '',
            }
            // 如果是 参在参数cheId 则为用户个人中心搜索 把该用户的id带上
            if($route.params.cheId){
                params.objectUserId = $route.params.cheId
            }
            gSearchInfo(params).then(res =>{
                console.log(res)
            })
        },
        //关闭下拉菜单
        handleCloseMenu(){
            const {comporeTime, $refs, tText} = this
            console.log(tText)
            if(comporeTime()) return $refs.choose.toggle(false)
            tText('起始时间要在结束时间之后哟')
        },
        // 比较起始和结束时间的大小
        comporeTime(){
            const {startTime, endTime} = this
            console.log(startTime)
            console.log(endTime)
            console.log(endTime - startTime)
            // 如果有一个不限 或者 结束时间 比起始时间大 不需要在比较
            if(!startTime || !endTime || 
            (endTime > startTime)) return true

            return false
        },

        showTime(datetime){
            const year = datetime.getFullYear()
            const month = ("0" + (datetime.getMonth() + 1)).slice(-2)
            const date = ("0" + datetime.getDate()).slice(-2)
            return `${year}-${month}-${date}`
        },
    },

}
</script>

<style lang="less" scoped>
#search{
    .header{
        display: flex;
        background-color: #008fff;
        .header-search{
            flex: 1;
        }
        .ct{
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-right: 7px;

        }
        .cancel{
            padding-left: 5px;
        }
    }
}
</style>