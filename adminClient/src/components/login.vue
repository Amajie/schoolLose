<template>
    <div id="a-login">
      <div class="header">
        <div class="logo">
            <el-image
              style="width: 100%; height: 100%"
              src="http://127.0.0.1:7070/init/che_logo.png"
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
          <div class="a-btn">
            <el-button style="width: 100%;" @click.native="initAdmin" size="medium" type="success">init</el-button>
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
        adminPassword:'huang661775',
        minTime: 60*60*5
      }
    },
    methods: {

      handleLogin(){

       const {adminName, adminPassword, encrypt, $message, sendLogin, $msg} = this

       // 存在则关闭
       $msg && $msg.close()

       if(!adminName) return this.$msg = $message('请输入用户名')
       if(!adminPassword) return this.$msg = $message('请输入密码')
       
        sendLogin(adminName, encrypt(adminPassword))
     },
     
     // 发送登陆请求
     sendLogin(adminName, adminPassword){
        const {adminLogin, minTime,
          $message, $alert, encrypt, cookie, $store, $router} = this
        
        // 密码加密
        adminLogin({
         adminName,
         adminPassword
        }).then(res =>{

          const {code, token, adminData, type_nav, courtyardData} = res.data

          if(code === -1) return $message('用户名错误!')
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
            $store.commit('setState', {adminData, type_nav, courtyardData})
            // 这里每次都是重置token 因此 自动登陆无需携带token到后台
            // 这里与前台有所区别
            cookie.set('a_che_token', token, minTime)
            cookie.set('a_che_in', encrypt(adminName), minTime)
            cookie.set('a_che_id', adminPassword, minTime)
            this.$router.replace('/')
        })
     },

      // 清除cookie数据
      clearCookie(){
        const {cookie, $store} = this
        cookie.remove('a_che_token')
        sessionStorage.removeItem('a_state')
        $store.replaceState(JSON.parse(sessionStorage.getItem('a_empty_state')))
      },

     initAdmin(){
       this.initData().then(res =>{
         console.log(res)
       })
     }
    },
    beforeRouteEnter (to, from, next) {
      /**
       * 这里判断 是否存在cookie 和sessionStor
       *  1 cookie存在 说明还在登陆着 此时应该直接跳转到首页
       *      1 sessionStor 存在 则同一页面访问登陆路由 直接跳转首页
       *      2 sessionStor 不存在 判断cookie的用户名以及密码存在与否 
       *          调用自动登陆函数
       *  2 cookie不存在
       *    清空 内容 sessionStor 以及初始化state
       */
      
      next(vm =>{
        const {cookie, sendLogin, decrypt, $store, clearCookie} = vm
        const token = cookie.get('a_che_token')
        const name = cookie.get('a_che_in')
        const paw = cookie.get('a_che_id')

        // token存在
        if(token && name && paw){
            console.log('存在token')
            sendLogin(decrypt(name), paw)
        //token不存在 或者 token存在 但是用户名 密码不存在 删除cookie信息
        }else if(!token || !(name && paw)){
            console.log('不存在token')
            clearCookie()
        }
      })
    },
    mounted(){
      console.log(this.$store.state)
      !sessionStorage.getItem('a_empty_state') && sessionStorage.setItem('a_empty_state', JSON.stringify(this.$store.state))
    }
  }
</script>

<style lang="less" scoped>
#a-login{
  position: relative;
  width: 100%;
  height: 100%;
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