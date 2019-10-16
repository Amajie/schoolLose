<template>
    <div id="change_himg">
        <div class="header b">
            <van-nav-bar
                title="更换头像"
                @click-left="handleRouter({url: '/person', tag: 'r'})"
                :border="false"
            >
                <van-icon name="arrow-left" slot="left" size="2em" color="#fff" />
            </van-nav-bar>
        </div>
        <div class="c_i">
            <div class="uploader">
                <van-uploader
                    v-model="fileList"
                    upload-text="点击选择"
                    :preview-full-image="false"
                    :after-read="afterRead"
                    :before-read="beforeRead"
                />
            </div>
        </div>
        <div class="loading" v-if="show_loading">
            <van-loading size="30px" type="spinner" color="#569cd6" vertical />
        </div>
        <div class="uploader-btn" @click.stop="handleUploader">
            <van-button type="danger" block>上传头像</van-button>
        </div>
    </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
    data(){
        return{
            select_img_action: false,
            show_loading: false,
            fileList: [],
        }
    },
    methods:{
        ...mapMutations([
            'setUserData',
            'handleRouter'
        ]),
        //图片读取前调用
        beforeRead(file){
            this.show_loading = true
            return true
        },
        //图片读取完毕 限制图片个数为 1
        afterRead(){
            this.fileList = this.fileList.slice(-1)
            this.show_loading = false
        },
        handleUploader(){

            const {fileList, $notify, upAvater, setUserData} = this
            //如果没有选择图片 提示选择图片
            if(!fileList[0]) return $notify({
                message:'请选择您的头像',
                color: '#000',
                background: '#f3f3f3'    
            })

            //否则就上传图片
            let formData = new FormData()
            
            formData.append('avater', fileList[0].file)
            //显示加载图标
            this.show_loading = true
            upAvater(formData).then(res =>{
                const {code, avater} = res.data
                if(code === 0) return  $notify({
                    message:'上传失败，请稍后再试',
                    color: '#000',
                    background: '#f3f3f3'    
                })

                setUserData({...this.$store.state.userData, avater})
                //关闭加载图标
                this.show_loading = false
                this.fileList = []
                $notify({
                    message:'上传成功',
                    type: 'info',
                    background: '#07c160'    
                })
            })

        }
    }
}
</script>

<style lang="less" scoped>
#change_himg{
  .c_i{
      padding: 10px;
  }
  .loading{
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -15px;
      margin-top: -15px;
  }
}
</style>