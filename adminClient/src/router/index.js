import Vue from 'vue'
import Router from 'vue-router'

import cookie from 'vue-cookies'
import store from '../store.js'

import Wrap from '../components/wrap.vue'
import PersonInfo from '../components/person_info/person_info.vue'
import Examine from '../components/person_info/examine.vue'
import SearchUser from '../components/person_info/searchUser.vue'
import SearchInfo from '../components/person_info/searchInfo.vue'

import Login from '../components/login.vue'

// 高级管理员
import SeniorAdmin from '../components/person_info/seniorAdmin.vue'
// 普通管理员
import GeneralAdmin from '../components/person_info/generalAdmin.vue'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Wrap',
      component: Wrap,
      redirect: '/p/1',
      children:[
        {
          path: 'p/:key',
          name: 'PersonInfo',
          component: PersonInfo,
        },
        {
          path: 'e/:key',
          name: 'Examine',
          component: Examine,
        },
        {
          path: 'su/:key',
          name: 'SearchUser',
          component: SearchUser,
        },
        {
          path: 'si/:key',
          name: 'SearchInfo',
          component: SearchInfo,
        },
        // 普通管理员
        {
          path: '/g/:key',
          name: 'GeneralAdmin',
          component: GeneralAdmin
        },
        // 高级管理员
        {
          path: '/che_hj',
          name: 'SeniorAdmin',
          component: SeniorAdmin
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        loginRequire: true
      },
      component: Login,
    },
   
  ]
})



router.beforeEach((to, from, next) => {
    const {loginRequire} = to.meta
    console.log(to)
    // 此时打开新的窗口 但是cookie信息存在 但是store 状态数据初始化了 此时跳转到登陆页面
    if(!loginRequire && cookie.get('a_che_token') && !sessionStorage.getItem('a_empty_state')){
      console.log(11111)
      return next('/login')
    }
    
    // 如果cookie存在即可以访问 如果cookie不存在 不能访问
    if(loginRequire || cookie.get('a_che_token')) return next()

    next({
      path: '/login',
      query: {redirect: to.fullPath}
    })
})


export default router
