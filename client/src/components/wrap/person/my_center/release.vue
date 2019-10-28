<template>
    <div id="release">
        <div class="header r">
            <van-nav-bar
                :title="headerTitle"
                @click-left="$router.go(-1)"
                :border="false"
            >
                <van-icon name="arrow-left" slot="left" size="2em" color="#fff" />
                <van-icon name="cross" slot="right" size="2em" color="#fff" />
            </van-nav-bar>
        </div>
        <div class="release-wrap">
            <div class="list">
                <div class="type">
                    <van-row>
                        <van-col span="12">
                            <van-button block :type="objectWay === '0'? 'info': 'default'" @click.native="objectWay = '0'" square>我是失主</van-button>
                        </van-col>
                        <van-col span="12">
                            <van-button block :type="objectWay === '1'? 'info': 'default'" @click.native="objectWay = '1'" square>我是拾主</van-button>
                        </van-col>
                    </van-row>
                </div>
                <div class="info">
                     <van-cell-group>
                        <van-field
                            readonly
                            clickable
                            label="物品类型"
                            size="large"
                            required
                            v-model="objectType"
                            placeholder="选择物品的类型"
                            @click.native="showType = !showType"
                        />
                        <van-field
                            clearable
                            required
                            label="物品名称"
                            size="large"
                            :maxlength="15"
                            v-model="objectName"
                            placeholder="例如: 雨伞(限15字)"
                        />
                        <van-field
                            clearable
                            required
                            label="地点"
                            size="large"
                            :maxlength="20"
                            v-model="objectAddress"
                            placeholder="丢失或者拾获地点(限20字)"
                        />
                        <van-field
                            readonly
                            clickable
                            label="时间"
                            required
                            size="large"
                            v-model="selectTime"
                            placeholder="丢失或者拾获时间点"
                            @click.native="showDate = !showDate"
                        />
                        <van-field
                            v-model="objectDesc"
                            label="说明"
                            type="textarea"
                            placeholder="请输入说明(限120字)"
                            rows="1"
                            :maxlength="120"
                            size="large"
                            autosize
                        />
                    </van-cell-group>
                </div>
                <div class="uploader-img">
                    <van-uploader 
                        v-model="objectImg"
                        :max-count="3"
                        upload-text="最多3张"
                        :after-read="afterRead"
                        :before-read="beforeRead"    
                    />
                </div>
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
                        @confirm="selectConfirm"
                        @cancel="showDate = !showDate"
                    />
                </van-action-sheet>
            </div>
            <div class="selectType">
                <van-popup v-model="showType" position="bottom">
                    <van-picker
                        show-toolbar
                        title="物品类型"
                        :columns="type_nav | filterType"
                        @cancel="showType = !showType"
                        @confirm="selectType"
                    />
                </van-popup>
            </div>
            <div class="submit">
                <van-button type="primary" @click.native="handleSubmit" square block>提交</van-button>
            </div>
            <div class="chang_explain">
                <span class="chang_explain_title">注意：</span>
                <span class="chang_explain_text">以上信息必须填写才能发布相关信息，走读学生，宿舍地址请填写: 校外居住</span>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    data(){
        return {
            gg: 0,
            headerTitle: '消息发布',
            objectName: '',
            objectAddress: '达南502袋子',
            objectTime: '',
            selectTime: '',
            objectTypeId: '',
            objectType: '',
            objectWay: '0',
            sendTime: '',
            objectDesc: '16电子1班值日生捡到的，请联系手机号1876003022',
            objectImg: [],
            currentDate: new Date(),
            maxTime: new Date(),
            minTime: new Date(`${new Date().getFullYear()-4}-01-01`),//后四年
            showDate: false,
            showType: false,
        }
    },
    created(){
        this.handleCreated()
    },
    computed:{
        ...mapState([
            'type_nav',
            'type_list',
            'userData',
            'detailData'
        ])
    },
    methods:{
        ...mapMutations(['filterType']),
        //初始化一些数据
        handleCreated(){
            const {meta, params} = this.$route
            const {userData, detailData} = this
            this.reType = meta.reType
            //此时要判断 用户的id是否正确 不正确即跳转到404页面
            if(params.cheId != userData.cheId){
                console.log('用户id不相等，跳转到404页面')
            }
            //此时是添加
            if(meta.reType) return console.log('添加数据')

            /**
             * 1 设置标题
             * 2 先判断当前的消息是否为detailData保存的消息
             *      1 不是 添加新的数据 消息id有错 直接显示消息添加
             *      2 是 遍历循环设置数据
             * 
             */
            this.headerTitle = '消息编辑'
            this.objectId = params.objectId
            console.log(detailData)
            for(let item in detailData){
                const val = detailData[item]
                if(item === 'objectImg'){
                    this.objectImg = val.map(url =>{
                        return {url}
                    })
                }else if(item === 'objectTime'){
                    this.selectTime = this.showTime(val)
                    this[item] = val
                }else if(item === 'objectTypeId'){
                    this.objectType = this.type_nav[val].type
                    this[item] = val
                }else{
                    this[item] = val
                }
            }

        },
        //图片读取前调用
        beforeRead(file){
            if(file.type === 'image/png' || file.type === 'image/jpeg' || 
                file.type === 'image/bmp') return true

            this.dAlert('只能上传jpeg、png、bmp格式的图片') 
            return false
        },
        //图片读取完毕 限制图片个数为 1
        afterRead(){
            console.log(this.objectImg)
        },
        //时间确认
        selectConfirm(val){
            this.showDate = !this.showDate
            // 此时都是默认时分默认 00:00
            this.objectTime = val.getTime()
            this.selectTime = `${val.getFullYear()}-${('0'+( 1+ val.getMonth())).slice(-2)}-${('0'+val.getDate()).slice(-2)}`
        },
        // 物品类型
        selectType(val){

            const {type_nav, showType, selectTypeId} = this
            this.showType = !this.showType
            this.objectType = val
            this.objectTypeId = selectTypeId(type_nav, val)
            
        },
        // 处理数据的提交
        handleSubmit(){

            let formData = new FormData()

            const {objectName, objectWay, objectAddress, objectTime, 
            objectTypeId, objectDesc, objectImg, tText} = this

            //以下是必须填写的
            if(!objectTypeId){
                return tText('请选择物品的类型')
            }else if(!objectName){
                return tText('请输入物品的具体名称')
            }else if(!objectAddress){
                return tText('请输入地点')
            }else if(!objectTime){
                return tText('请选择时间')
            }

            // console.log(objectTime)
            // console.log(new Date(this.selectTime).getTime())
            // console.log(this.showTime(objectTime, true))
            // console.log(this.showTime(new Date(this.selectTime).getTime(), true))

            // return

            formData.append('objectName', objectName)
            formData.append('objectWay', objectWay)
            formData.append('objectAddress', objectAddress)
            formData.append('objectTime', new Date(objectTime).getTime())
            formData.append('objectTypeId', objectTypeId)
            formData.append('objectDesc', objectDesc)

            if(this.reType) return this.addData(formData)

            this.upData(formData)
        },
        //添加数据
        addData(formData){
            /**
             * 图片上传 分为编辑 还是添加
             *  1 添加
             *      直接获取file对象上传即可
             *  2 编辑
             *      此时需要判断里面的图片是全部为 url 还是用户有选取图片
             *          1 url 直接不需要上传 直接拼接在 objectImg
             *          1 选取 那这就要
             */

            const {objectImg, reObject, dAlert} = this

            // 发布的时间不能更新
            const currentTime = new Date().getTime()
            formData.append('sendTime', currentTime)
            formData.append('finishTime', currentTime)

            this.objectImg.forEach(item => {
                formData.append('objectPic', item.file)
            })

            reObject(formData).then(res =>{
                const {code} = res.data
                if(code === 0) return dAlert('发布失败, 请稍后再试')

                dAlert('发布成功')
            })
        },
        //更新数据
        upData(formData){
            
            const {objectImg, dAlert, objectId, sendTime, upObject} = this
            let arrImg = []

            // 发布的时间不能更新
            formData.append('sendTime', sendTime)
            //消息的id 路由参数传递
            formData.append('objectId', objectId)
            this.objectImg.forEach(item => {
                if(item.file) return formData.append('objectPic', item.file)
                arrImg.push(item.url)
                console.log(item)
            })

            formData.append('objectImg', JSON.stringify(arrImg))
            
            upObject(formData).then(res =>{
                const {code} = res.data
                if(code === 0) return dAlert('发布失败, 请稍后再试')

                dAlert('发布成功')
            })

        },

         /**
         * tag 为true 即为显示年月日 小时 分
         *      false 即为显示年月日
         */
        showTime(time, tag){
            const data = new Date(Number(time))
            if(!tag) return `${data.getFullYear()}-${('0'+data.getMonth()).slice(-2)}-${('0'+data.getDate()).slice(-2)}`
            return `${data.getFullYear()}-${('0'+data.getMonth()).slice(-2)}-${('0'+data.getDate()).slice(-2)} 
                            ${('0'+data.getHours()).slice(-2)}:
                            ${('0'+data.getMinutes()).slice(-2)}`
        },
    }
}
</script>
<style lang="less" scoped>
#release{
    .release-wrap{
        .list{
            padding: 0 2%;
            .type{
                overflow: hidden;
                padding: 5px 0;
            }

            .uploader-img{
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #f0f3f6;
            }
        }
        .chang_explain{
            margin: 10px 0;
            padding: 0 2%;
            .chang_explain_title{
                color: red;
            }
            .chang_explain_text{
                color: #9fa0a2;
                line-height: 25px;
            }
        }
    }
}
</style>