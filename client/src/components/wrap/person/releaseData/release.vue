<template>
    <div id="release">
        <div class="header r">
            <van-nav-bar
                title="消息发布"
                @click-left="() => $router.replace('/center')"
                :border="false"
            >
                <van-icon name="arrow-left" slot="left" size="2em" color="#fff" />
            </van-nav-bar>
        </div>
        <div class="release-wrap">
            <div class="list">
                <div class="type">
                    <van-row>
                        <van-col span="12">
                            <van-button block :type="type? 'info': 'default'" @click.native="type=true" square>我是失主</van-button>
                        </van-col>
                        <van-col span="12">
                            <van-button block :type="type? 'default': 'info'" @click.native="type=false" square>我是拾主</van-button>
                        </van-col>
                    </van-row>
                </div>
                <div class="info">
                     <van-cell-group>
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
                            v-model="objectTime"
                            placeholder="丢失或者拾获时间点"
                            @click.native="showDate = !showDate"
                        />
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
                        :columns="type_list"
                         @cancel="showType = !showType"
                        @confirm="val => { 
                            showType = !showType
                            objectType = val
                        }"
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
import {mapState} from 'vuex'
export default {
    data(){
        return {
            type: true, // true 即为失主 false 为拾主
            objectAddress: '',
            objectTime: '',
            objectType: '',
            objectWay: '',
            objectDesc: '',
            objectImg: [],
            loseFlag: 'info',
            pickFlag: 'default',
            currentDate: new Date(),
            maxTime: new Date(),
            minTime: new Date(`${new Date().getFullYear()-4}-01-01`),//后四年
            showDate: false,
            showType: false,
        }
    },
    created(){
        // 这里应该根据路由来决定 是添加消息 还是修改消息
        // 修改 消息就要 获取相应的数据
    },
    computed:{
        ...mapState([
            'type_nav',
            'type_list'
        ])
    },
    methods:{

        //图片读取前调用
        beforeRead(file){
            return true
        },
        //图片读取完毕 限制图片个数为 1
        afterRead(){
            console.log(this.objectImg)
        },


        //时间确认
        selectConfirm(val){
            this.showDate = !this.showDate
            this.objectTime = `${val.getFullYear()}-${('0'+val.getMonth()).slice(-2)}-${('0'+val.getDate()).slice(-2)}`
        },
        // 处理数据的提交
        handleSubmit(){

            let formData = new FormData()
            //获取方式
            this.objectWay = this.type? '丢失': '拾获'

           const {objectWay, objectAddress, objectTime, 
            objectType, objectDesc, objectImg, reObject, tText, dAlert} = this

            // 以下是必须填写的
            if(!objectAddress){
                return tText('请输入地点')
            }else if(!objectTime){
                return tText('请选择时间')
            }else if(!objectType){
                return tText('请选择物品的类型')
            }


            formData.append('objectWay', objectWay)
            formData.append('objectAddress', objectAddress)
            formData.append('objectTime', new Date(objectTime).getTime())
            formData.append('sendTime', new Date().getTime())
            formData.append('objectType', objectType)
            formData.append('objectDesc', objectDesc)
            // 获取图片数组
            this.objectImg.forEach(item => {
                formData.append('objectImg', item.file)
            })

            reObject(formData).then(res =>{
                const {code} = res.data
                if(code === 0) return dAlert('发布失败, 请稍后再试')

                dAlert('发布成功')
            })
        }
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