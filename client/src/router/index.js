import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/entry/Login.vue'
import Register from '../components/entry/Register.vue'
import CheckEmail from '../components/entry/Check_email.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
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
    }
  ]
})
