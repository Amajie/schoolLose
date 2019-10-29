<template>
    <div id="change-info">
        <div class="header g">
            <van-nav-bar
                title="个人信息"
                @click-left="handleRouter({url: '/set', tag: 'r'})"
                left-arrow
            >
                <van-icon name="arrow-left" slot="left" size="1.5em" color="#fff"/>
            </van-nav-bar>
        </div>
        <div class="step">
            <van-steps :active="stepActive">
                <van-step>信息完善</van-step>
                <van-step>审核中</van-step>
                <van-step v-if="currenStep === 2">审核通过</van-step>
                <van-step v-else-if="currenStep === 1">等待审核结果</van-step>
                <van-step v-else>审核未通过</van-step>
            </van-steps>
        </div>
        <!-- 未通过 -->
        <div v-if="!authory" class="info-wrap">
            <div class="info-list">
                <!-- 信息填写 -->
                <van-cell-group>
                    <van-field
                        clearable
                        label="姓名"
                        v-model="name"
                        placeholder="真实姓名"
                    />
                    <van-field
                        clearable
                        :label="labelStId"
                        type="number"
                        v-model="stId"
                        placeholder="请如实填写"
                    />
                    <van-field
                        readonly
                        clickable
                        label="性别"
                        :value="gender"
                        placeholder="选择性别"
                        @click="handleClick(genderData, 'gender')"
                    />
                    <van-field
                        v-if="userType != 3"
                        readonly
                        clickable
                        label="学院"
                        :value="courtyard"
                        placeholder="选择学院"
                        @click="handleClick(courtyardData, 'courtyard')"
                    />

                    <!-- 专业和职业不同 -->
                    <van-field
                        v-if="userType === 1"
                        readonly
                        clickable
                        label="专业"
                        :value="major"
                        placeholder="选择专业"
                        @click="handleMajor"
                    />
                    <van-field
                        v-else-if="userType === 3"
                        clearable
                        label="职业"
                         v-model="major"
                        placeholder="填写您的职业"
                    />
                    <van-field
                        v-if="userType === 1"
                        clearable
                        label="班级"
                        v-model="classes"
                        placeholder="所在班级，例: 16电子1"
                    />

                    <van-field
                        clearable
                        label="现居地址"
                        v-model="address"
                        placeholder="填写目前居住的地址"
                    />
                </van-cell-group>
                <!-- picker 选项 -->
                <!-- 学院 -->
                <van-popup v-model="showPicker" position="bottom">
                    <van-picker
                        show-toolbar
                        :columns="pickerData"
                        @cancel="showPicker = false"
                        @confirm="selectPicker"
                    />
                </van-popup>
            </div>
            <div class="c_i">
                <div class="uploader">
                    <van-uploader
                        v-model="credePic"
                        upload-text="上传证件照"
                        :max-count="2"
                        :preview-full-image="false"
                        :after-read="afterRead"
                        :before-read="beforeRead"
                    />
                </div>
            </div>
            <div class="info-btn">
                <!-- <van-button type="danger" @click.native="handleInfo" :disabled="userData.authory" block>提交信息</van-button> -->
                <van-button type="danger" @click.native="handleInfo" block>提交信息</van-button>
            </div>
            <div class="chang_explain">
                <span class="chang_explain_title">注意：</span>
                <span class="chang_explain_text">以上信息比须如实填写，工作人员将在1-2工作日审核信息，审核结果将发送邮箱告知</span>
            </div>
        </div>
        <!-- 通过-->
        <div v-else class="info-wrap">
            <div class="info-list">
                <!-- 信息填写 -->
                <van-cell-group>
                    <van-field
                        readonly
                        label="姓名"
                        v-model="name"
                    />
                    <van-field
                        readonly
                        :label="labelStId"
                        type="number"
                        v-model="stId"
                    />
                    <van-field
                        readonly
                        label="性别"
                        v-model="gender"
                    />
                    <van-field
                        v-if="userType != 3"
                        readonly
                        label="学院"
                        v-model="courtyard"
                    />

                    <!-- 专业和职业不同 -->
                    <van-field
                        v-if="userType === 1"
                        readonly
                        label="专业"
                        v-model="major"
                    />
                    <van-field
                        v-else-if="userType === 3"
                        readonly
                        label="职业"
                        v-model="major"
                    />
                    <van-field
                        v-if="userType === 1"
                        readonly
                        label="班级"
                        v-model="classes"
                    />

                    <van-field
                        readonly
                        label="现居地址"
                        v-model="address"
                    />
                    <van-field
                        readonly
                        :border="false"
                        label="证件照"
                    />
                </van-cell-group>
                <div class="car-pic">
                    <van-image
                        width="100"
                        height="100"
                        lazy-load
                        v-for="(item, index) in credePic"
                        :key="index"
                        :src="item.url"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
    data(){
        return{
            name: '',
            stId: '',
            gender: '',
            courtyard: '',
            major: '',
            classes: '',
            address: '',
            pickerData: [],
            dataKey: '',
            showPicker: false,
            genderData: ['男', '女'],
            credePic: [],
            userType: '',

            //label 文字
            labelStId: '学号',
            stepActive: 0,
            currenStep: 0,
            authory: false,
        }
    },
    created(){
        //设置个人信息 在表中
        const {userData} = this

        for(let key in userData){
            this[key] = userData[key]
            if(key === 'credePic'){
                this.credePic = userData[key].map(url =>{
                    return {url}
                })
            }
        }

        this.stepActive = userData.passStep
        this.currenStep = userData.passStep
        // 这里 显示审核结果
        if(userData.passStep === 3){
            this.stepActive = 2
        }

        if(this.userType === 2){
            this.labelStId = '教工号'
        }else if(this.userType === 3){
            this.labelStId = '身份证号'
        }
    },
    computed:{
        ...mapState([
            'courtyardData',
            'userData'
        ])
    },
    methods:{
        ...mapMutations([
            'setState',
            'handleRouter'
        ]),
        /**
         * @function 处理专业选项
         *  1 应该只有学院选择了 才能选择专业
         *  2 因此需要判断 courtyard 是否有值
         */
        handleMajor(){

            const {courtyard, tText, courtyardData} = this

            if(!courtyard) return tText('先选择所在的院系')
            this.pickerData = courtyardData[courtyard]
            this.showPicker = true
            this.dataKey = 'major'
            
        },

        handleClick(data, key){
            this.showPicker = true
            this.dataKey = key
            if(key === 'courtyard'){
                let courtyardArr = []
                for(let item in data){
                    courtyardArr.push(item)
                }
                this.pickerData = courtyardArr
            }else{
                this.pickerData = data
            }
            
            
        },

        selectPicker(val, index){
            const {dataKey, courtyardData, userData} = this

            this[dataKey] = val
            this.showPicker = false

            // 此时教师是不需要设置的
            if(dataKey === 'courtyard' && userData.userType != 2) this.major = courtyardData[this[dataKey]][0]

        },
        /**
         * @function 处理 发送修改个人信息的请求
         * 
         */
        handleInfo(){

            let formData = new FormData()
            //获取相应的数据
            const {name, stId, gender, courtyard, userData, userType, credePic, handleRouter, setState,
                major, classes, address, cInfo, tText, dAlert} = this
            
            if(!name || !stId || !gender || !address ||
                (userType === 1 && !classes) ||
                ((userType === 1 || userType === 3) && !major) ||
                ((userType === 1 || userType === 2) && !courtyard)
            ){
                return tText('内容不能为空')
            }else if(!credePic.length){
                return tText('请上传证件照')
            }

            formData.append('name', name)
            formData.append('stId', stId)
            formData.append('gender', gender)
            formData.append('courtyard', courtyard)
            formData.append('major', major)
            formData.append('classes', classes)
            formData.append('address', address)

            let arrImg = []
            credePic.forEach(item => {
                if(item.file) return formData.append('uCredePic', item.file)
                arrImg.push(item.url)
            })

            formData.append('credePic', JSON.stringify(arrImg))

            //发送请求
            cInfo(formData).then(res =>{
                const {code, credePic} = res.data
                if(code === 0) return tText('修改失败，请稍后再试')
                if(code === 200) return dAlert('操作成功').then(() =>{
                    
                    setState({
                        userData:{...userData,
                            name, stId, gender, courtyard, passStep: 1,
                            major, classes, address, credePic,
                        }
                    })
                    handleRouter({})
                })
            })
        },

        //图片读取前调用
        beforeRead(file){
            return true
        },
        //图片读取完毕 限制图片个数为 1
        afterRead(){
            // this.credePic = this.credePic.slice(-1)
            console.log(this.credePic)
        },
    }
}
</script>
<style lang="less" scoped>
#change-info{
    .info-wrap{
        padding-bottom: 20px;
        .c_i{
            padding: 10px;
        }
        .info-btn{
            padding: 0 1%;
        }
        .chang_explain{
            margin: 20px 0;
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
    .car-pic{
        padding: 3%;
    }
}
</style>