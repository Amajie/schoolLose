<template>
    <div id="admin">
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
    </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
  data() {
    return {
      newChangePassword: '',
      changePasswordPaw: ''
    }
  },
  computed:{
    ...mapState([
        'adminData'
    ])
  },
  methods:{
    ...mapMutations([
      'setState',
      'logoutCount'
    ]),
    // 退出登陆
    handleOut(){
        const {logoutCount, $confirm, $router, 
            cookie, adminData, outCount} = this
        $confirm('是否退出登陆?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            outCount({
                userId: adminData.cheId
            }).then(res =>{
                
                // 操作失败
                if(res.data.code != 200) return dAlert('操作失败，请稍后再试')
                // 操作成功
                logoutCount({cookie, $router})
            })
        }).catch(() => {
                
        })
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

    //发送修改请求
    sendChange(upData, cPawIpu){
        const {updataAdmin, showMsg} = this
        updataAdmin({
            cPawIpu,
            upData
        }).then(res =>{

            const {code, msg} = res.data
            if(code != 200) return this.$message(msg)
            this.$message({
                message: msg,
                type: 'success'
            })

            this.newChangePassword = ''
            this.changePasswordPaw = ''
        })
    },
  }
}
</script>

<style lang="less" scoped>
#admin{
  > div{
    overflow: hidden;
  }
  .a-title{
    padding: 5px 0;
    font-size: 20px;
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
}
</style>