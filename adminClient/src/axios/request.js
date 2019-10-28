import axios from 'axios'

import cookie from 'vue-cookies'
import store from '../store.js'
import router from '../router/index.js'

const createObj = {
    //baseURL: 'http://192.168.43.124:7070',  // 这里即为 url 加上 这里baseURL  即指定了域名和端口 
    baseURL: '/api',
    timeout: 5000,  //请求超时时间
    crossDomain: true,//设置cross跨域
    withCredentials: true
}

const service = axios.create(createObj)

service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'


//请求处理  此时可以把token 保存在session中 并设置过期时间
service.interceptors.request.use(config =>{

    console.log(config)

    store.commit('setState', {fullsLoad: true})

    //此时需要token 后台判断是否需要 token 
    config.headers['jie412.com-token'] = cookie.get('che_token')

    return config

}, error =>{
    console.log('超时')
})

//响应处理
service.interceptors.response.use(response => {

    store.commit('setState', {fullsLoad: false})

    return response
}, error => {

    store.commit('setState', {fullsLoad: false})

    //这里只是打印 并不需要 还需要处理500错误
    return Promise.reject(error.response.data)
})

export default service