import Vue from 'vue'
import Router from 'vue-router'

import cookie from 'vue-cookies'

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
      path: '/chelogin',
      name: 'Login',
      meta: {
        noRequireToken: true,
      },
      component: Login,
    },
   
  ]
})



router.beforeEach((to, from, next) => {
  
  // 不需要权限 或者权限存在 不需要重新登陆 后面在有逻辑 在使用 if...else
  if (to.meta.noRequireToken || cookie.get('che_token')) return next()

  // 否则 跳转到登陆页面 并保存当前路由信息
  next({
    path: '/chelogin',
    query: {redirect: to.fullPath}
  })
}) 


export default router
