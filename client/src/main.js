// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store'

import {Button, Icon, NavBar,
  Field, CellGroup, Cell,
  RadioGroup, Radio} from 'vant'

Vue.use(Button)
Vue.use(Icon)
Vue.use(NavBar)
Vue.use(Field)
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(RadioGroup)
Vue.use(Radio)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store
})
