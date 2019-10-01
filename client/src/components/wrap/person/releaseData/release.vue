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
                <div class="info">
                     <van-cell-group>
                        <van-field
                            clearable
                            label="地点"
                            v-model="objectAddress"
                            placeholder="丢失或者拾获地点"
                        />
                        <van-field
                            clearable
                            label="时间"
                            v-model="objectTime"
                            placeholder="丢失或者拾获时间点"
                        />
                        <van-field
                            readonly
                            clickable
                            label="物品类型"
                            v-model="objectType"
                            placeholder="选择物品的类型"
                        />
                        <van-field
                            v-model="objectDesc"
                            label="说明"
                            type="textarea"
                            placeholder="请输入说明"
                            rows="1"
                            autosize
                        />
                    </van-cell-group>
                </div>
                <div class="uploader-img">
                    <van-uploader v-model="fileList"/>
                </div>
                <div class="type">
                    <div class="ds">
                        <van-radio-group v-model="type">
                            <van-radio name="1">我是失主</van-radio>
                        </van-radio-group>
                    </div>
                    <div class="sh">
                        <van-radio-group v-model="type">
                            <van-radio name="2">我是拾主</van-radio>
                        </van-radio-group>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            type: '1',
            objectAddress: '',
            objectTime: '',
            objectType: '',
            objectDesc: '',
            fileList: []
        }
    },
    methods:{}
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
                > div{
                    float: left;
                }
                .ds{

                }
                .sh{
                    margin-left: 20px;
                }
            }
            .uploader-img{
                padding: 10px 0;
            }
        }
    }
}
</style>