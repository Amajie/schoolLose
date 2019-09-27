import Vue from 'vue'
import Router from 'vue-router'

// 登陆注册
import Login from '../components/entry/Login.vue'
import Register from '../components/entry/Register.vue'
import CheckEmail from '../components/entry/Check_email.vue'

// 内容
import Wrap from '../components/wrap/Wrap.vue'
import Home from '../components/wrap/home/Home.vue'
import Info from '../components/wrap/Info/Info.vue'
import Person from '../components/wrap/person/Person.vue'
//设置
import Setting from '../components/wrap/person/page/setting.vue'
import CName from '../components/wrap/person/set/c_name.vue'
import CPassword from '../components/wrap/person/set/c_password.vue'
import CEmail from '../components/wrap/person/set/c_email.vue'
import CInfo from '../components/wrap/person/set/c_info.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // 登陆注册
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/cemail',
      name: 'CheckEmail',
      component: CheckEmail
    },
    //内容
    {
      path: '/',
      name: 'Wrap',
      redirect: '/home',
      component: Wrap,
      children:[
        {
          path: 'home',
          name: 'Home',
          component: Home
        },
        {
          path: 'info',
          name: 'Info',
          component: Info
        },
        {
          path: 'person',
          name: 'Person',
          component: Person
        }
      ]
    },
    //设置
    {
      path: '/set',
      name: 'Setting',
      component: Setting
    },
    //修改用户名
    {
      path: '/cn',
      name: 'CName',
      component: CName
    },
    //修改密码
    {
      path: '/cp',
      name: 'CPassword',
      component: CPassword
    },
    //修改邮箱
    {
      path: '/ce',
      name: 'CEmail',
      component: CEmail
    },
    //修改个人信息
    {
      path: '/ci',
      name: 'CInfo',
      component: CInfo
    },

  ]
})
