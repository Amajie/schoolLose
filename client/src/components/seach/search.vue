<template>
    <div id="search">
        <van-sticky>
            <div class="header">
                <div @click="toHome" class="cancel ct">
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
                <div @click.stop="initSearch(true)" class="search-btn ct">
                    <van-button type="info" size="normal">搜索</van-button>
                </div>
            </div>
            <div class="b">
                <van-dropdown-menu 
                    :close-on-click-outside="false"
                >
                    <van-dropdown-item v-model="objectWay" :options="selectTile" />
                    <van-dropdown-item ref="choose" title="刷选">
                        <!-- 这是单选的 -->
                        <van-radio-group v-model="upDownTag">
                            <van-cell-group>
                                <van-cell title="时间降序" clickable @click="upDownTag = '-1'">
                                    <van-radio slot="right-icon" name="-1" />
                                </van-cell>
                                <van-cell title="时间升序" clickable @click="upDownTag = '1'">
                                    <van-radio slot="right-icon" name="1" />
                                </van-cell>
                            </van-cell-group>
                        </van-radio-group>
                        <!-- 这是 多选的 可以选择类型 时间段 -->
                        <div class="opa-list">
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
        <div class="info-list cell">
            <van-list
                v-model="searchLoad"
                :finished="searchFinished"
                @load="onLoad"
                :immediate-check="false"
                >
                <van-cell @click.native="toDetail(item)" clickable v-for="(item, index) in searchData" :key="index">
                    <div class="data_item">
                        <div class="item_img">
                            <van-image
                                width="100"
                                height="100"
                                fit="cover"
                                radius="5"
                                :src="item.objectImg[0]"
                            />
                        </div>
                        <div class="item_info">
                            <!-- 标题 -->
                            <div class="info_title">
                                <p>
                                    <span class="title_p">{{item.objectTypeId | filterTypeName}}</span>
                                    <span @click.stop="toUserCenter(item.cheId)" class="title_name">{{item.userName}}</span>
                                </p>
                                <p :class="{info_like: true, lose: item.objectWay === '0'}">{{item.objectWay === '0'? '丢': '拾'}}</p>
                            </div>
                            <!-- 描述 -->
                            <div class="info_desc">
                                <p class="desc-content">
                                    <icon name="desc" :w="15" :h="15"></icon>
                                    <span>{{item.objectDesc}}</span>
                                </p>
                            </div>
                            <!-- 配送 -->
                            <div class="info_tack">
                                <div class="user">
                                    <icon name="center_object" :w="12" :h="12"></icon>
                                    <span>{{item.objectName}}</span>
                                </div>
                                <div class="tack_heng">
                                    <icon name="center_time" :w="15" :h="15"></icon>
                                <span>{{item.sendTime | filterTime}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-cell>
            </van-list>

            <Empty v-if="noData"/>
            <div v-else-if="!searchLoad" class="data-end">
                到底啦，不能再往下啦~~~
            </div>
        </div>
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
                    @cancel="cancelSelectType"
                    @confirm="selectType"
                />
            </van-popup>
        </div>
        <Loading @fresh="handleSeach" v-bind="loadObj" />
        <FreshTop v-bind:freshTag="false"/>
    </div>
</template>

<script>
import Loading from '../loading/Load.vue'
import Empty from '../loading/Empty.vue'
import FreshTop from '../loading/Fresh_top.vue'
import {mapState, mapMutations} from 'vuex'
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
            upDownTag: '-1',
            currentDate: new Date(),
            maxTime: new Date(),
            minTime: new Date(`${new Date().getFullYear()-4}-01-01`),//后四年
            showDate: false,
            showType: false,
            // 加载
            searchLoad: true,
            // 显示loading
            loadObj: {},
            noData: true
        }
    },
    created(){
        // 这个是点击 便捷导航获取数据
        this.handleNavInfo()
        // 获取 session storage的值
        this.getParams()
    },
    computed:{
        ...mapState([
            'type_nav',
            'searchData',
            'searchPage',
            'searchPageNum',
            'searchFinished',
            'searchParams'
        ])
    },
    methods:{
        ...mapMutations([
            'setState',
            'toDetail',
            'toUserCenter',
            'handleRouter',
            'concatArr'
        ]),
        // 通过便捷导航获取数据
        handleNavInfo(){
            /**
             * 先去查看列表 是否 存在
             * 1 id 错误 直接跳到全局搜索
             * 2 id 正确 获取数据
             */
            const {$route, handleRouter, findTypeId,
                   type_nav, handleSeach, searchData} = this

            const {objectTypeId, cheId} = $route.params

            // 这里一般是详情页 如果有数据 则不要显示无数据提示 应该放在store中
            if(searchData.length != 0) return this.noData = false
            
            // 如果 全局搜索 或者 个人中心搜索 不需要再往下执行
            // 个人中心即为 objectTypeId 为空
            // 因此都设置 cheId
            if(objectTypeId === 'all' || !objectTypeId) return this.cheId = cheId
            /**
             * 1 遍历分类列表
             *  不存在 直接跳转全局搜索
             *  存在 发送请求
             */
            // 查询id是否存在
            const objectType = findTypeId(type_nav, objectTypeId)
            //不存在
            if(!objectType) return handleRouter({url: '/search/all', tag: 'r'})
            //存在 发送请求
            this.objectType = objectType
            this.objectTypeId = objectTypeId
            // 调用方法 获取数据
            handleSeach()
        },
        //获取 session storage
        getParams(){
            
            if(JSON.stringify(this.searchParams) === '{}') return console.log('不存在，不需要设置')
            for(let key in this.searchParams){
                this[key] = this.searchParams[key]
            }
        },
        //时间确认
        selectTime(datetime){
            const {showDate, timeType, timeStarmp, showTime} = this
            
            this.showDate = !showDate

            this[timeType] = this.showTime(datetime)

            // 起始时间是00:00:00
            if(timeStarmp === 'startTime') return this[timeStarmp] = new Date(`${this[timeType]} 00:00:00`).getTime()
            //结束时间 是 23:59:59
            this[timeStarmp] = new Date(`${this[timeType]} 23:59:59`).getTime()

        },
        cancelSelectTime(){
            const {showDate, timeType, timeStarmp} = this
            this.showDate = !showDate
            this[timeType] = '不限'
            this[timeStarmp] = ''
        },
        //物品的选择
        selectType(val){

            const {type_nav, showType, selectTypeId} = this
            this.showType = !this.showType
            this.objectType = val
            this.objectTypeId = selectTypeId(type_nav, val)
        },
        cancelSelectType(){
           this.showType = !this.showType
           this.objectType = '不限'
           this.objectTypeId = ''
        },
        handletimeType(timeType, timeStarmp){
            this.showDate = !this.showDate
            this.timeType = timeType
            this.timeStarmp = timeStarmp
        },
        // 发送搜索请求 boolean
        handleSeach(){
            // 此时的物品类型 获取的该类型的id
            // 结束时间 不能 比开始时间小 这里可以检索 一下 自动设置 或者给提示
            
            let {cheId, startTime, endTime, objectWay, target, tText,
                 objectTypeId, objectType, showStartTime, showEndTime,
                 upDownTag, gSearchInfo, $route, searchParams, setState,
                 searchPage, searchPageNum, concatArr} = this 

            const params = {
                target,
                page: searchPage,
                pageNum: searchPageNum,
                startTime,
                endTime,
                objectTypeId,
                upDownTag,
                objectWay: objectWay != 2?objectWay: '',
                objectPassTag: true
            }

            const saveParams = {
                objectWay,
                target,
                upDownTag,
                objectType,
                showStartTime,
                showEndTime
            }

            console.log(params)

            // 如果是 参在参数cheId 则为用户个人中心搜索 把该用户的id带上
            if(cheId){
                params.objectUserId = cheId
            }

            // 每次发送请求都要加载
            // 只有点击便捷导航才会 再次加载
            this.loadObj = {
                loadTag: true,
                freshTag: false
            }

            this.searchLoad = true
            // 点击搜素不应该再出现
            this.noData = false

            gSearchInfo(params).then(res =>{
                // 获取完数据 就关闭了
                this.loadObj = {
                    loadTag: false,
                    freshTag: false
                }
                

                const {code, data} = res.data
                this.searchLoad = false
                // 此时已经没有数据
                if(code === 0) {
                    //此时 如果没有数据 就 显示提示
                    if(this.searchData.length === 0){
                        this.noData = true
                    }
                    console.log(222222)
                    return setState({searchFinished: true})
                }

                concatArr({key: 'searchData', data})
                
                // 加载下一页
                setState({searchPage: ++searchPage})

                if(JSON.stringify(searchParams) != JSON.stringify(saveParams)){
                    setState({searchParams:saveParams})
                }

            }, () =>{
                
                // 获取数据失败  显示刷新按钮
                this.loadObj = {
                    loadTag: false,
                    freshTag: true
                }
                this.noData = true
            })
        },
        //关闭下拉菜单
        handleCloseMenu(){
            const {handleSeach, comporeTime, $refs, tText} = this

            // 起始时间不能比结束时间提前
            if(!comporeTime()) tText('起始时间要在结束时间之后哟')
            
            // 关闭 下拉菜单
            $refs.choose.toggle(false)
            this.initSearch()
        },
        // 比较起始和结束时间的大小
        comporeTime(){
            const {startTime, endTime} = this
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
        // List 加载事件
        onLoad(){
            console.log('加载')
            this.handleSeach()
        },
        // 初始化搜素
        initSearch(tag){
            // 只有需要关键字才会
            if(tag && !this.target) return this.tText('请输入关键字')
            
            this.setState({
                searchData: [], 
                searchPage: 0,
                searchFinished: false
            })
            this.page = 0
            this.handleSeach()
        },
        // 前往首页
        toHome(){
            this.handleRouter({})
            // 此时要设置 要把 searchFinished设置为false 会继续触发onLoad事件 
            //因此这里需要设置 为true
            this.searchLoad = true
            this.setState({
                searchData: [],
                searchPage: 0,
                searchFinished: false,
                searchParams: {}
            })
        }
    },
    components:{
        Loading,
        Empty,
        FreshTop
    }

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
    .info-list{
        .info-wrap{
          padding: 0 1%;
          padding-bottom: 10px;
        }
        .data_item{
            display: flex;
            padding-left: 10px;
            .item_img{
                height: 100px;
                width: 100px;
            }
            .item_info{
                flex: 4;
                display: flex;
                flex-direction: column;
                > div{
                    display: flex;
                    padding: 1px 10px;
                    justify-content: space-between;
                }
                //标题
                .info_title{
                    font-size: 18px;
                    .title_p{
                        border-radius: 5px;
                        background: #ffec12;
                    }
                    .title_name{
                        font-weight: 700;
                        padding-left: 5px;
                        &:active{
                            color: #f08446;
                            text-decoration: underline;
                        }
                    }
                    .info_like{
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        padding: 0 5px;
                        font-weight: 700;
                        background-color: #088fff;
                        border-radius: 10px;
                        color: #fff;
                    }
                    .lose{
                        background-color: red;
                    }
                }
                //评分
                .info_desc{
                    font-size: 12px;
                    .desc-content{
                        span{
                            line-height: 18px;
                            color: #666;
                        }
                    }
                }
                // 配送
                .info_tack{
                    font-size: 12px;
                    .tack_heng{
                        padding-left: 10px;
                    }
                }
            }
        }
    }
}
</style>