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
import {cAdmin, lAdmin, fAdminCount, 
  aDestroyCount, cAdminPaw, aUserInfo, 
  aSearchUser, aUpUInfo, aFInfo,
  aUpOInfo, gSearchInfo} from './axios/api.js'
Vue.prototype.cAdmin = cAdmin//用户的创建
Vue.prototype.cAdminPaw = cAdminPaw//用户的创建
Vue.prototype.fAdminCount = fAdminCount//高级管理员账户的查找
Vue.prototype.aDestroyCount = aDestroyCount//高级管理员 删除账户
Vue.prototype.lAdmin = lAdmin//密码修改
Vue.prototype.aUserInfo = aUserInfo//获取用户的审核信息
Vue.prototype.aSearchUser = aSearchUser//搜素用户
Vue.prototype.aUpUInfo = aUpUInfo//更新账户的信息
Vue.prototype.aFInfo = aFInfo//获取待审核的帖子
Vue.prototype.aUpOInfo = aUpOInfo// 帖子的审核
Vue.prototype.gSearchInfo = gSearchInfo//帖子的搜索

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
