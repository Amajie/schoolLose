<template>
    <div id="change-info">
        <div class="header g">
            <van-nav-bar
                title="个人信息"
                @click-left="() => $router.replace('/set')"
                left-arrow
            >
                <van-icon name="arrow-left" slot="left" size="1.5em" color="#fff"/>
            </van-nav-bar>
        </div>
        <div class="info-wrap">
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
                        label="学号"
                        type="number"
                        v-model="stId"
                        placeholder="真实学号"
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
                        readonly
                        clickable
                        label="学院"
                        :value="courtyard"
                        placeholder="选择学院"
                        @click="handleClick(courtyardData, 'courtyard')"
                    />
                    <van-field
                        readonly
                        clickable
                        label="专业"
                        :value="major"
                        placeholder="选择专业"
                        @click="handleMajor"
                    />
                    <van-field
                        clearable
                        label="班级"
                        v-model="classes"
                        placeholder="所在班级，例: 16电子1"
                    />

                    <van-field
                        clearable
                        label="宿舍地址"
                        v-model="address"
                        placeholder="例: 达理公寓1A614"
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
            <div class="info-btn" @click="handleInfo">
                <van-button type="danger" block>保存</van-button>
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
        return{
            // name: '黄杰',
            // stId: '1605120155',
            // gender: '男',
            // courtyard: '物理与信息工程学院',
            // major: '电子信息科学与技术',
            // classes: '16电子1',
            // address: '达理公寓',
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
        }
    },
    created(){

        //设置个人信息 在表中
        const {userData} = this
        for(let key in userData){
            this[key] = userData[key]
        }
    },
    computed:{
        ...mapState([
            'courtyardData',
            'majorData',
            'userData'
        ])
    },
    methods:{
        ...mapMutations([
            'setUserData'
        ]),
        /**
         * @function 处理专业选项
         *  1 应该只有学院选择了 才能选择专业
         *  2 因此需要判断 courtyard 是否有值
         */
        handleMajor(){

            const {courtyard, tText, majorData} = this

            if(!courtyard) return tText('先选择所在的院系')
            this.pickerData = majorData[courtyard]
            this.showPicker = true
            this.dataKey = 'major'
            
        },

        handleClick(data, key){
            this.showPicker = true
            this.pickerData = data
            this.dataKey = key
        },

        selectPicker(val, index){
            const {dataKey, majorData} = this

            this[dataKey] = val
            this.showPicker = false

            if(dataKey === 'courtyard') this.major = majorData[this[dataKey]][0]

        },
        /**
         * @function 处理 发送修改个人信息的请求
         * 
         */
        handleInfo(){
            //获取相应的数据
            const {name, stId, gender, courtyard, $router, setUserData,
                major, classes, address, cInfo, tText, dAlert} = this

            //发送请求
            cInfo({
                name, stId, gender, courtyard,
                major, classes, address
            }).then(res =>{
                const {code} = res.data
                if(code === 0) return tText('修改失败，请稍后再试')
                if(code === 200) return dAlert('操作成功').then(() =>{
                    
                    setUserData({...this.$store.state.userData,
                        name, stId, gender, courtyard,
                        major, classes, address
                    })
                })
            })
            
        }
    }
}
</script>
<style lang="less" scoped>
#change-info{
    .info-wrap{
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
}
</style>