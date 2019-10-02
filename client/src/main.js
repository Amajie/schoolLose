
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

//样式文件
import './assets/less/index.less'


//cookie
import cookie from 'vue-cookies'
Vue.prototype.cookie = cookie

//vant ui库的封装
import {dConfirm, dAlert, tText} from './components/vant/vant.js'
Vue.prototype.dConfirm = dConfirm// 确认 取消消息框
Vue.prototype.dAlert = dAlert// 确认消息框
Vue.prototype.tText = tText// 轻提示

//请求函数的封装
import {register, sendEmailCode, checkEmailCode, login,
  cName, cPaw, cEmail, cInfo, fInfo, upAvater, reObject,
  text} from './axios/api.js'
Vue.prototype.register = register//发送注册请求
Vue.prototype.sendEmailCode = sendEmailCode//发送邮箱验证码
Vue.prototype.checkEmailCode = checkEmailCode//发送 输入的 验证码
Vue.prototype.login = login//发送 登陆请求
Vue.prototype.cName = cName//发送 用户名修改请求
Vue.prototype.cPaw = cPaw//发送 密码修改请求
Vue.prototype.cEmail = cEmail//发送 密码修改请求
Vue.prototype.cEmail = cEmail//发送 密码修改请求
Vue.prototype.cInfo = cInfo//发送 个人信息的修改
Vue.prototype.fInfo = fInfo//发送 个人信息的获取
Vue.prototype.upAvater = upAvater//发送 头像的修改
Vue.prototype.reObject = reObject//发送 寻物消息

Vue.prototype.text = text//发送 密码修改请求

// 密码加密 
import {decrypt, encrypt} from './assets/crypto/encrypt.js'
Vue.prototype.decrypt = decrypt// 解密
Vue.prototype.encrypt = encrypt// 加密


//svg 图片的使用
import IconSvg from 'vue2-svg-icon/Icon.vue'
Vue.component('icon', IconSvg)

// 字体图标库
import './assets/iconfont/iconfont.css'

// ui view组件库
import {Button, Icon, NavBar,
Field, CellGroup, Cell,
RadioGroup, Radio, Picker, Popup,
Checkbox, CheckboxGroup,
Tabbar, TabbarItem, Row, Col,
Search, Grid, GridItem, Tab, Tabs,
Sticky, ImagePreview, ActionSheet, 
Uploader, Loading, Notify, Switch,
DatetimePicker} from 'vant'
Vue.use(Button)
  .use(Icon)
  .use(NavBar)
  .use(Field)
  .use(CellGroup)
  .use(Cell)
  .use(RadioGroup)
  .use(Radio)
  .use(Picker)
  .use(Popup)
  .use(CheckboxGroup)
  .use(Checkbox)
  .use(TabbarItem)
  .use(Tabbar)
  .use(Row)
  .use(Col)
  .use(Search)
  .use(GridItem)
  .use(Grid)
  .use(Tab)
  .use(Tabs)
  .use(Sticky)
  .use(ImagePreview)
  .use(ActionSheet)
  .use(Uploader)
  .use(Loading)
  .use(Notify)
  .use(Switch)
  .use(DatetimePicker)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store
})
