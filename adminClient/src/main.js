import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/less/index.less'
Vue.use(ElementUI)


//cookie
import cookie from 'vue-cookies'
Vue.prototype.cookie = cookie

//请求函数的封装
import {createAdmin, adminLogin, getAdmin, 
  destroyCount, updataAdmin, examineUser, 
  searchUser, updataUser, examineObject,
  updataObject, searchObject} from './axios/api.js'
Vue.prototype.createAdmin = createAdmin//用户的创建
Vue.prototype.updataAdmin = updataAdmin//用户的创建
Vue.prototype.getAdmin = getAdmin//高级管理员账户的查找
Vue.prototype.destroyCount = destroyCount//高级管理员 删除账户
Vue.prototype.adminLogin = adminLogin//密码修改
Vue.prototype.examineUser = examineUser//获取用户的审核信息
Vue.prototype.searchUser = searchUser//搜素用户
Vue.prototype.updataUser = updataUser//更新账户的信息
Vue.prototype.examineObject = examineObject//获取待审核的帖子
Vue.prototype.updataObject = updataObject// 帖子的审核
Vue.prototype.searchObject = searchObject//帖子的搜索

import {encrypt, decrypt} from '../.../../../client/src/assets/crypto/encrypt.js'
Vue.prototype.encrypt = encrypt//加密
Vue.prototype.decrypt = decrypt//解密

import * as filters from './filter/filter.js';

Object.keys(filters).forEach(key => {
  return  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#admin',
  router,
  store,
  components: { App },
  template: '<App/>'
})
