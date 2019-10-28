import Vue from 'vue'
import Router from 'vue-router'

// 登陆注册
import Login from '../components/entry/Login.vue'
import Register from '../components/entry/Register.vue'
import CheckEmail from '../components/entry/Check_email.vue'

// 内容
import Wrap from '../components/wrap/Wrap.vue'
import Home from '../components/wrap/home/Home.vue'
import Examine from '../components/wrap/examine/examine.vue'
import Person from '../components/wrap/person/Person.vue'
//设置
import Setting from '../components/wrap/person/page/setting.vue'
import CName from '../components/wrap/person/set/c_name.vue'
import CPassword from '../components/wrap/person/set/c_password.vue'
import CEmail from '../components/wrap/person/set/c_email.vue'
import CInfo from '../components/wrap/person/set/c_info.vue'

//个人中心
import CWrap from '../components/wrap/person/page/c_wrap.vue'
import Cimg from '../components/wrap/person/page/change_himg.vue'
import Center from '../components/wrap/person/my_center/center.vue'
import Releasedata from '../components/wrap/person/my_center/release.vue'
import Deatil from '../components/wrap/person/my_center/detail.vue'

// 个人执行的cell点击列表
import Concren from '../components/wrap/person/page/concren.vue'
import Collection from '../components/wrap/person/page/collection.vue'
import Commit from '../components/wrap/person/page/commit.vue'


//搜素
import Search from '../components/seach/search.vue'

import store from '../store.js'


Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    // 登陆注册
    {
      path: '/login',
      name: 'Login',
      meta: {
        noRequireToken: true,
      },
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      meta: {
        noRequireToken: true,
      },
      component: Register
    },
    {
      path: '/cemail',
      name: 'CheckEmail',
      meta: {
        noRequireToken: true,
      },
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
          meta: {
            noRequireToken: true,
          },
          component: Home
        },
        //审核列表列表
        {
          path: '/examine',
          name: 'Examine',
          component: Examine
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
    //个人中心
    {
      path: '/c',
      name: 'CWrap',
      redirect: '/c/center',
      meta: {
        noRequireToken: true,
      },
      component: CWrap,
      children:[
        // 个人首页
        {
          path: 'center/:cheId',
          name: 'Center',
          meta: {
            noRequireToken: true,
          },
          component: Center
        },
        //消息的发布
        {
          path: 'redata/:cheId',
          name: 'Releasedata',
          meta: {
            noRequireToken: true,
            reType: true
          },
          component: Releasedata
        },
        //消息的更新
        {
          path: 'updata/:cheId/:objectId',
          name: 'Releasedata',
          meta: {
            noRequireToken: true,
            reType: false
          },
          component: Releasedata
        },
        //消息的详情页
        {
          path: 'detail/:cheId/:objectId',
          name: 'Deatil',
          meta: {
            noRequireToken: true,
          },
          component: Deatil
        },
      ]
    },
    //头像上传
    {
      path: '/cimg',
      name: 'Cimg',
      component: Cimg
    },
    //关注列表
    {
      path: '/concren',
      name: 'Concren',
      meta: {
        noRequireToken: true,
      },
      component: Concren
    },
    //收藏列表
    {
      path: '/collection',
      name: 'Collection',
      meta: {
        noRequireToken: true,
      },
      component: Collection
    },
    //留言列表
    {
      path: '/commit/:cheId',
      name: 'Commit',
      meta: {
        noRequireToken: true,
      },
      component: Commit
    },
    // 首页的搜索
    {
      path: '/search/:objectTypeId',
      name: 'Search',
      meta: {
        noRequireToken: true,
      },
      component: Search
    },
    // 用户的个人中心搜索
    {
      path: '/pSearch/:cheId',
      name: 'Search',
      meta: {
        noRequireToken: true,
      },
      component: Search
    },
    {
      path: '*',
      redirect: '/home',
    },
  ]
})


router.beforeEach((to, from, next) => {
  
  // 不需要权限 或者权限存在 不需要重新登陆 后面在有逻辑 在使用 if...else
  if (to.meta.noRequireToken || localStorage.getItem('token')) return next()

  // 否则 跳转到登陆页面 并保存当前路由信息
  next({
    path: '/login',
    query: {redirect: to.fullPath}
  })
}) 


export default router
