import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/less/index.less'
Vue.use(ElementUI)


//请求函数的封装
import {aUserInfo, aUpInfo} from './axios/api.js'
Vue.prototype.aUserInfo = aUserInfo//获取用户的审核信息
Vue.prototype.aUpInfo = aUpInfo//获取用户的审核信息


Vue.config.productionTip = false

new Vue({
  el: '#admin',
  router,
  store,
  components: { App },
  template: '<App/>'
})
