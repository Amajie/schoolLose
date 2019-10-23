import Vue from 'vue'
import Router from 'vue-router'

import Wrap from '../components/wrap.vue'
import PersonInfo from '../components/person_info/person_info.vue'
import UserInfo from '../components/person_info/user_info.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Wrap',
      component: Wrap,
      children:[
        {
          path: 'p',
          name: 'PersonInfo',
          component: PersonInfo,
        },
        {
          path: 'u',
          name: 'UserInfo',
          component: UserInfo,
        }
      ]
    }
  ]
})
