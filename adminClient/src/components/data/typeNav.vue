<template>
    <div class="type-wrap">
        
        <div class="type-nav">
                <div class="title">
                <h2>分类数据</h2>
                <el-button @click.stop="showDiog">添加分类</el-button>
            </div>
            <div class="type-data">
                <el-table
                    :data="typeNavDataArr"
                    style="width: 100%">
                    <el-table-column
                    label="图标"
                    width="180">
                    <template slot-scope="scope">
                        <img class="type-icon" :src="scope.row.icon_link">
                    </template>
                    </el-table-column>
                    <el-table-column
                    label="分类"
                    width="180">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.type}}</el-tag>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleTypeEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleTypeDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 分类编辑和添加 -->
        <div class="add-type">
            <el-dialog :title="typeText" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="分类名称" label-width="100px">
                    <el-input v-model="form.type" placeholder="请输入分类名称" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <el-form>
                    <el-form-item label="图标选择" label-width="100px">
                        <div class="add-opa">
                            <el-upload
                                class="upload-demo"
                                action="1"
                                :show-file-list="false"
                                :http-request="handleUpload">
                                <el-button size="small" type="primary">选择图标</el-button>
                            </el-upload>
                            <img v-if="icon_pic" class="add-icon" :src="icon_pic">
                            <img v-else class="add-icon" src="http://127.0.0.1:7070/t_icon/init_icon.png">
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addType">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
    data(){
        return{
            typeNavDataArr: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            expandNode: true,
            form: {
                type: ''
            },
            fileIcon: null,
            icon_pic: '',
            edit_icon_pic: '',
            edit_key: '',
            dialogFormVisible: false,
            typeText: '',
            maxTypeLen: 99, //分类上限值
        }
    },
    computed:{
        ...mapState([
            'type_nav'
        ])
    },
    created(){
        this.initType()
    },
    methods:{
        ...mapMutations([
            'setState'
        ]),
       
        initType(){

            // 先清空
            this.typeNavDataArr = []

            const {type_nav, typeNavDataArr} = this
            for(let key in type_nav){
                const obj = Object.assign({}, type_nav[key])
                obj.typeKey = key
                typeNavDataArr.push(obj)
            }
        },

        // 编辑
        handleTypeEdit(index, row){

            // 编辑
            this.isEditType = true
            this.typeText = '编辑分类'
            // 显示弹窗
            this.dialogFormVisible = true
            this.form.type = row.type
            this.icon_pic = row.icon_link
            // 此时表示编辑 获取编辑数据
            this.edit_icon_pic = row.icon_link
            this.edit_key = row.typeKey
        },

        // 删除 某个
        handleTypeDelete(index, row){
            const {initType, delectConstType, $confirm, 
            $message, type_nav, setState} = this
            
            this.$confirm('是否删除该分类？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                delectConstType({
                    delectKey: row.typeKey,
                    type_nav: JSON.stringify(type_nav)
                })
                .then(res =>{
                    const {code, type_nav} = res.data
                    if(!code) return $message('操作失败')

                    // 设置新数据
                    setState({
                        type_nav
                    })

                    // 再次调用
                    initType()
                    $message({
                        message: '删除成功',
                        type: 'success'
                    })
                
                })

            }).catch(() => {})
        },
        // 添加分类
        addType(){
            const {form, fileIcon, type_nav, setState, typeNavDataArr,
                upConstType, $message, edit_icon_pic, edit_key, isEditType,
                initType} = this

            // 判断是否正确
            if(!form.type) return $message('请填写分类名称')
            if(!edit_icon_pic && !fileIcon) return $message('请选择图标')

            // 上传
            const formData = new FormData()
            // 说明为添加
            if(!isEditType){
                formData.append('t_icon', fileIcon)
            }else{
                // 编辑
                if(fileIcon){
                    formData.append('t_icon', fileIcon)
                }else{
                    formData.append('icon_link', edit_icon_pic)
                }

                formData.append('isEditType', true)
                formData.append('edit_key', edit_key)
            }
            formData.append('type', form.type)
            formData.append('type_nav', JSON.stringify(type_nav))

            upConstType(formData)
            .then(res =>{
                const {code, type_nav} = res.data
                if(!code) return $message('操作失败')

                // 设置新数据
                setState({
                    type_nav
                })
               // 再次调用
                initType()
                // 关闭弹窗
                this.dialogFormVisible = false
                $message({
                    message: '添加成功',
                    type: 'success'
                })
            })
        },

        // 显示添加分类弹窗
        showDiog(){

            // 分类已经达到上限
            if(Object.keys(this.type_nav).length > this.maxTypeLen) return this.$message('分类已经达到上限，不能在添加了')

            this.dialogFormVisible = true
            this.fileIcon = null
            this.icon_pic = ''
            this.form.type = ''
            // 不是编辑
            this.isEditType = false
            this.typeText = '添加分类'
        },

        // 自定义上传 自动调用
        handleUpload(f){
            this.fileIcon =f.file
            const _this = this

            // 下面的目的是为了 显示当前选择的图片
            const fileObj = new FileReader()
            fileObj.readAsDataURL(this.fileIcon)					
            fileObj.onloadend = function(){
                _this.icon_pic = this.result
            }	
        }
    }
}
</script>

<style lang="less" scoped>
.type-wrap{
    padding: 0 5%;
    .title{
        padding: 15px 0;
        display: flex;
        justify-content: space-between;
        h2{
            color: #666;
        }
    }

    .type-icon{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .add-type{
        .add-opa{
            position: relative;
            .add-icon{
                position: absolute;
                top: 0;
                left: 100px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin: 0 10px;
            }
        }
    }
}
</style>