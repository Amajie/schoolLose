<template>
    <div id="senior">
        <div class="content wrap">
            <div class="my-info">
                <h2 class="a-title">我</h2>
                <div class="my-count">
                    <el-input
                        readonly
                        v-model="adminData.adminEmail">
                    </el-input>
                </div>
                <div class="logout">
                    <el-button @click.native="handleOut" type="danger">退出登陆</el-button>
                </div>
            </div>
            <div class="changePaw">
                <h2 class="a-title">修改密码</h2>
                <div class="newpaw">
                    <el-input
                        clearable
                        type="password"
                        placeholder="请输入新密码"
                        maxlength="16"
                        v-model="newChangePassword">
                    </el-input>
                </div>
                <div class="oldpaw">
                    <el-input
                        clearable
                        type="password"
                        placeholder="请输入旧密码"
                        v-model="changePasswordPaw">
                    </el-input>
                </div>
                <div class="c-paw">
                    <el-button @click.native="handleChangePaw" type="success">提交</el-button>
                </div>
            </div>
            <div class="createCount">
                <h2 class="a-title">创建普通账号</h2>
                <div class="cemail">
                    <el-input
                        clearable
                        type="email"
                        placeholder="请输入邮箱"
                        v-model="createAdminEmail">
                    </el-input>
                </div>
                <div class="c-count">
                    <el-button @click.native="handleCreateCount" type="success">创建</el-button>
                </div>
            </div>
            <div class="myCreateCount">
                <h2 class="a-title">我的创建</h2>
                <div class="list">
                    <el-table
                        :data="createCount"
                        style="width: 100%">
                        <el-table-column
                            label="邮箱"
                            :width="tabW">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.adminEmail }}</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="状态"
                            :width="tabW">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <el-tag :type="scope.row.adminTag?'': 'danger'" size="medium">{{scope.row.adminTag ?'正常': '已冻结'}}</el-tag>
                                </div>
                            </template>
                        </el-table-column>


                        <el-table-column label="操作">
                            <template slot-scope="scope">

                                <!-- 冻结 -->
                                <el-button
                                    size="mini"
                                    v-if="scope.row.adminTag"
                                    @click="handleFreezeCount(false, scope.row)">冻结账号</el-button>

                                <!-- 解冻 -->
                                <el-button
                                    size="mini"
                                    v-else
                                    @click="handleFreezeCount(true, scope.row)">解冻账号</el-button>
                                
                                <!-- 销毁 -->
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDestoryCount(scope.$index, scope.row.adminEmail)">销毁账号</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="myCreateCount">
                <h2 class="a-title">我的账户</h2>
                <div class="change-name">
                    <div class="c-name">
                        <el-input
                            clearable
                            placeholder="请输入新用户名"
                            v-model="newChangeName">
                        </el-input>
                    </div>
                    <div class="c-name-paw">
                        <el-input
                            clearable
                            type="password"
                            placeholder="请输入密码"
                            v-model="changeNamePaw">
                        </el-input>
                    </div>
                    <div class="c-name-btn">
                        <el-button @click.native="handleChangeName" type="success">修改用户名</el-button>
                    </div>
                </div>
                <div class="change-email">
                    <div class="c-email">
                        <el-input
                            type="password"
                            placeholder="请输入新用户名"
                            v-model="newChangeEmail">
                        </el-input>
                    </div>
                    <div class="c-email-paw">
                        <el-input
                            type="password"
                            placeholder="请输入密码"
                            v-model="changeEmailPaw">
                        </el-input>
                    </div>
                    <div class="c-email-btn">
                        <el-button @click.native="handleChangeEmail" type="success">修改邮箱</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    data(){
        return {
            changePasswordPaw: '',
            newChangePassword: '',
            // 修改用户名
            newChangeName: '',
            changeNamePaw: '',
            
            // 修改邮箱
            newChangeEmail: '',
            changeEmailPaw: '',
            changeKey: '',
            createAdminEmail: '',
            tabW: 220
        }
    },
    computed:{
        ...mapState([
            'adminData',
            'createCount',
            'regEmail'
        ])
    },
    created(){
        this.handleCreate()
    },
    methods:{
        ...mapMutations([
            'setState',
            'logoutCount'
        ]),
        // 初始化一些数据
        handleCreate(){
            const {createCount, fAdminCount, setState} = this
            if(!createCount.length){
                fAdminCount().then(res =>{
                    const {code, createCount} = res.data
                    if(code === 200) return setState({createCount})
                    console.log('没有创建账号')
                })
            }
        },
        handleOut(){
            const {logoutCount, $confirm, $router, cookie} = this
            $confirm('是否退出登陆?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                logoutCount({cookie, $router})
            }).catch(() => {
                    
            })
        },
        // 创建账户
        handleCreateCount(){
            const {$message, cAdmin, createAdminEmail, 
            encrypt, showMsg, regEmail} = this
            if(!createAdminEmail) return $message('请输入邮箱')
            if(!regEmail.test(createAdminEmail)) return $message('邮箱格式不正确')
            this.changeKey = 'c'
            cAdmin({
                adminEmail: createAdminEmail,
                adminPassword: encrypt(createAdminEmail)
            }).then(res =>{
                showMsg(res.data)
            })
        },
        //修改用户名
        handleChangeName(){
            const {$message, sendChange, encrypt, changeNamePaw, newChangeName} = this
            if(!newChangeName) return $message('请输入信息的用户名')
            if(!changeNamePaw) return $message('请输入密码')
            this.changeKey = 'n'
            sendChange({
                adminName: newChangeName
            }, encrypt(changeNamePaw))
        },

        //修改邮箱
        handleChangeEmail(){
            const {$message, sendChange, encrypt, changeEmailPaw, newChangeEmail,
                regEmail} = this
            if(!newChangeEmail) return $message('请输入新的邮箱')
            if(!regEmail.test(newChangeEmail)) return $message('邮箱格式不正确')
            if(!changeEmailPaw) return $message('请输入密码')
            this.changeKey = 'e'
            sendChange({
                adminEmail: newChangeEmail
            }, encrypt(changeEmailPaw))
        },

        //修改密码
        handleChangePaw(){
            const {$message, sendChange, encrypt, changePasswordPaw, newChangePassword} = this
            if(!changePasswordPaw) return $message('请输入旧密码')
            if(!newChangePassword) return $message('请输入新密码')
            if(newChangePassword.length < 8) return $message('密码长度至少8位数')
            this.changeKey = 'p'
            sendChange({
                adminPassword: encrypt(newChangePassword)
            }, encrypt(changePasswordPaw))
        },

        // 冻结 解冻
        handleFreezeCount(adminTag, currentRow){
            const {$message, cAdminPaw} = this
            
            this.$confirm(adminTag?'是否解冻该账号': '是否冻结该账号', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 发送请求
                cAdminPaw({
                    adminEmail: currentRow.adminEmail,
                    upData:{
                        adminTag
                    }
                }).then(res =>{
                    const {code, msg} = res.data
                    if(code != 200) return $message(msg)

                    // 成功
                    $message({
                        message: adminTag? '已解冻该账号':'已冻结该账号',
                        type: 'success'
                    })
                    currentRow.adminTag = adminTag
                })
            }).catch(() =>{})
        },
        // 销毁账号
        handleDestoryCount(index, adminEmail){

            const {$message, aDestroyCount, createCount} = this
            
            this.$confirm('一旦销毁，不可找回，请谨慎处理', '谨慎', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 发送请求
                aDestroyCount({
                    adminEmail
                }).then(res =>{
                    const {code, msg} = res.data
                    console.log(res)
                    if(code != 200) return $message('操作失败，请稍后再试')

                    // 成功
                    $message({
                        message: '已销毁该账号',
                        type: 'success'
                    })
                    // 删除该条数据会影响原数组
                    createCount.splice(index, 1)
                })
            }).catch(() =>{})
        },

        //发送修改请求
        sendChange(upData, cPawIpu){

            const {cAdminPaw, showMsg} = this
            cAdminPaw({
                cPawIpu,
                upData
            }).then(res =>{
                showMsg(res.data)
            })
        },
        // 显示信息
        showMsg({code, msg}){
            if(code != 200) return this.$message(msg)

            this.$message({
                message: msg,
                type: 'success'
            })

            if(this.changeKey === 'p'){
                this.changePasswordPaw = ''
                this.newChangePassword = ''
            }else if(this.changeKey === 'n'){
                this.newChangeName = ''
                this.changeNamePaw = ''
            }else if(this.changeKey === 'e'){
                this.newChangeEmail = ''
                this.changeEmailPaw = ''
            }else if(this.changeKey === 'c'){
                
                //设置值
                this.createCount.unshift({
                    adminEmail: this.createAdminEmail,
                    adminGrade: 2,
                    adminTag: true
                })
                //清空值
                this.createAdminEmail = ''
            }
        }
    }
}
</script>
<style lang="less" scoped>
#senior{
    .wrap{
        padding: 0 5%;
        .a-title{
            padding: 5px 0;
            font-size: 20px;
        }
        > div{
            margin: 10px 0;
            overflow: hidden;
        }
        .my-info{
           
            > div{
                float: left;
                margin-right: 10px;
            }
        }
        .changePaw{
            > div{
                float: left;
                margin: 0 3px;
            }
        }
        .createCount{
            > div{
                float: left;
                margin: 0 3px;
            }
        }
        .myCreateCount{
            > div{
                overflow: hidden;
                margin: 10px 0;
                > div{
                    float: left;
                    margin: 0 3px;
                }
            }
        }
    }
}
</style>