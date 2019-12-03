<template>
        <div class="courtyard-wrap">
            <div class="courtyarddata">
                <div class="title">
                    <h2>学院数据</h2>
                    <el-button @click.native="showAddBox('添加学院', '请输入学院名称', addCouryard)">添加学院</el-button>
                </div>
                <div class="cour-data">
                    <el-tree
                        :data="courtyardDataArr"
                        :props="defaultProps"
                        :expand-on-click-node="expandNode"
                        @node-click="handleNodeClick"
                        accordion>
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                                <el-button
                                    type="text"
                                    size="mini"
                                    v-if="data.id === 1"
                                    @click="showAddBox('添加专业', `请输入<${data.label}>的新专业吧`, addMajor, node)">
                                    添加专业
                                </el-button>
                                <el-button
                                    type="text"
                                    size="mini"
                                    v-if="data.id === 1"
                                    @click="showAddBox('编辑学院', `请编辑<${data.label}>专业的新名称`, editCouryard, node)">
                                    编辑学院
                                </el-button>
                                <el-button
                                    type="text"
                                    size="mini"
                                    v-else
                                    @click="showAddBox('编辑专业', `请编辑<${data.label}>学院的新名称`, editMajor, node)">
                                    编辑专业
                                </el-button>
                                <el-button
                                    type="text"
                                    size="mini"
                                    v-if="data.id === 1"
                                    @click="delectCouryard(data)">
                                    删除学院
                                </el-button>
                                <el-button
                                    type="text"
                                    size="mini"
                                    v-else
                                    @click="delectMajor(node)">
                                    删除专业
                                </el-button>
                            </span>
                        </span>


                    </el-tree>
                </div>
            </div>
        </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
    data(){
        return{
            courtyardDataArr: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            expandNode: true
        }
    },
    computed:{
        ...mapState([
            'courtyardData',
        ])
    },
    created(){
        this.initCour()
    },
    methods:{
        ...mapMutations([
            'setState'
        ]),
        initCour(){
            // 初始化 学院数据
            this.courtyardDataArr = this.courtyardData.map((item, index) =>{

                let obj = {}
                // 键肯定即为key
                obj.label = item.courtyard
                obj.id = 1
                obj.index = index

                obj.children = item.major.map((item, i) =>{
                    return {
                        label: item,
                        id: 2,
                        i
                    }
                })
                return obj
            })
        },

        // 显示编辑界面
        showAddBox(title, content, callBack, node){

            const {$message, addCouryard, $prompt} = this
            this.expandNode = false
            $prompt(content, title, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator:function(val){
                    if(!val) return false
                    return true
                },
                inputErrorMessage: '请输入内容'
            }).then(({ value }) => {
                
                callBack(value, node)

            }).catch(() => {})
        },

        // 添加学院
        addCouryard(courtyard){
            this.handleEditSend({
                courtyard,
                major: []
            }, 'addC')
        },

        // 编辑学院
        editCouryard(newCourtyard, node){
            this.handleEditSend({
                index: node.data.index,
                newCourtyard
            }, 'editC')
        },
        // 删除学院
        delectCouryard(data){
            this.handleDelectSend({
                index: data.index
            }, 'delectC', `是否删除学院<${data.label}>？`)
        },
        // 添加专业
        addMajor(major, node){
            this.handleEditSend({
                index: node.data.index,
                major
            }, 'addM')
        },

        // 编辑专业
        editMajor(newMajor, node){
            this.handleEditSend({
                index: node.parent.data.index,
                i: node.data.i,
                newMajor
            }, 'editM')
        },

        // 删除专业
        delectMajor(node){
            this.handleDelectSend({
                index: node.parent.data.index,
                i: node.data.i
            }, 'delectM', `是否删除专业<${node.data.label}>？`)
        },

        // 发送编辑请求
        handleEditSend(upData, tag){
            const {addCourData, courtyardData, opSuccee} = this

            addCourData(
                {
                    courtyardData: JSON.stringify(courtyardData),
                    upData,
                    courtyardTag: tag
                }
            ).then(res =>{
                opSuccee(res)
            })
        },
        // 发送删除请求
        handleDelectSend(upData, tag, msg){
            const {addCourData, courtyardData, $confirm, opSuccee} = this
            // 不展开
            this.expandNode = false
            // 弹窗询问
            $confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                addCourData(
                    {
                        courtyardData: JSON.stringify(courtyardData),
                        upData,
                        courtyardTag: tag
                    }
                ).then(res =>{
                    opSuccee(res)
                })
            }).catch(() => {})
        },

        // 请求处理
        opSuccee(res){
            const {code, courtyardData} = res.data
            const {setState, $message, initCour} = this
            if(!code) return $message('操作失败')

            // 设置新数据
            setState({
                courtyardData
            })

            // 再次调用
            initCour()
            $message({
                message: '操作成功',
                type: 'success'
            })
        },

        handleNodeClick(){
            this.expandNode = true
        },
        remove(node, data){
            this.expandNode = false
        },
        append(data){
            this.expandNode = false
        }
    }
}
</script>

<style lang="less" scoped>
.courtyard-wrap{
    padding: 0 5%;
    .title{
        padding: 15px 0;
        display: flex;
        justify-content: space-between;
        h2{
            color: #666;
        }
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
}
   
</style>