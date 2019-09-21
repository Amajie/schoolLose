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
    }

  ]
})
