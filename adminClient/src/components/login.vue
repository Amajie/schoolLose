<template>
    <div id="a-login">
      <div class="header">
        <div class="logo">
            <el-image
              style="width: 100%; height: 100%"
              src="http://192.168.43.124:7070/av/che_logo.png"
              fit="fill">
            </el-image>
        </div>
        <div class="aName">
          <span>车神寻物网：</span>
          <span>后台管理系统</span>
        </div>
      </div>
      <div class="login-wrap">
        <h2 class="title">用户登陆</h2>
        <div class="a-input">
          <div class="a-adminName">
              <el-input clearable placeholder="请输入用户名" 
                v-model="adminName"
                prefix-icon="el-icon-s-custom"
              >
              </el-input>
          </div>
          <div class="a-paw">
              <el-input clearable placeholder="请输入密码" 
                v-model="adminPassword"
                type="password"
                prefix-icon="el-icon-s-promotion"
              >
              </el-input>
          </div>
          <div class="a-btn">
            <el-button style="width: 100%;" @click.native="handleLogin" size="medium" type="success">登陆</el-button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        adminName: '前端车神',
        adminPassword:'huang661775'
      }
    },
    created(){
      
    },
    methods: {
     handleLogin(){
       const {adminName, adminPassword, lAdmin,
       $message, $alert, encrypt, $msg, cookie, $store, $router} = this

      // 可以在这里设置想要的密码
      // console.log(encrypt('huang661775'))
       // 存在则关闭
       $msg && $msg.close()

       if(!adminName) return this.$msg = $message('请输入用户名')
       if(!adminPassword) return this.$msg = $message('请输入密码')
       
       lAdmin({
         adminName,
         adminPassword: encrypt(adminPassword)
       }).then(res =>{

         const {code, token, adminData} = res.data
        console.log(res.data)
         if(code === -1) return this.$msg = $message('用户名错误!')
         if(code === -2) return $alert('该管理员账户已被冻结，暂时无法登陆', '提示', {
            confirmButtonText: '确定',
            //清空数据
            callback: action => {
              this.adminName = ''
              this.adminPassword = ''
           }
         })
         if(code === 0) return this.$msg = $message('密码错误!')

          // 设置
          $store.commit('setState', {adminData})
          cookie.set('che_token', token, 300)
          this.$router.replace('/')
          
       })
     }
    }
  }
</script>

<style lang="less" scoped>
#a-login{
  position: relative;
  width: 100%;
  height: 100%;
  // background: url('../assets/img/login-bg.jpg');
  background: #034dd3;
  background-size: 100% 100%;
  .header{
    position: relative;
    width: 100%;
    height: 80px;
    background-color: rgba(0, 0, 0, 0.5);
    .logo{
      position: absolute;
      left: 0;
      top: 50%;
      margin-left: 100px;
      margin-top: -25px;
      width: 50px;
      height: 50px;

    }
    .aName{
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      line-height: 80px;
      font-size: 25px;
      color: #fff;
      margin-left: 180px;
    }
  }
  .login-wrap{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    padding: 20px 5px;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.9);
    .title{
      text-align: center;
      padding-bottom: 10px;
    }
    .a-input{
      padding: 0 5px;
      > div{
        margin: 5px 0;
      }
    }
  }
}
</style>