import axios from 'axios'

import qs from 'qs'
import router from '../router/index.js'
import store from '../store.js'

// axios.defaults.withCredentials = true

const service = axios.create({
    //baseURL: 'http://192.168.43.124:7070',  // 这里即为 url 加上 这里baseURL  即指定了域名和端口 
    baseURL: '/api',
    timeout: 5000,  //请求超时时间
    crossDomain: true,//设置cross跨域
    withCredentials: true
})

service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'


//请求处理  此时可以把token 保存在session中 并设置过期时间
service.interceptors.request.use(config =>{

    // 后台也已经允许什么请求头可以传到后台
    //注意请求头不能出现中文

    config.method.toLowerCase() === 'post' ?
        config.data = qs.stringify({...config.data}): config.params = {...config.params}

    //此时需要token 后台判断是否需要 token 
    config.headers['jie412.com-token'] = localStorage.getItem('token')

    return config
}, error =>{
    console.log('超时')
})

//响应处理
service.interceptors.response.use(response =>{
    
    return response
}, error =>{
    const {status} = error.response

    switch(status){
        /**
         * 1 此时表示 token存在 但是已经过期
         * 2 删除 token 跳转到登陆页面上
         * 3 跳转到登陆页面 并获取当前的路由信息(router.currentRoute.fullPath) 
         *      当登陆成功后跳转到该路由下
         */
        case 401:  
            //删除token
            store.commit('removeToken')
            // 前往登陆 获取路由信息 登陆成功自动跳转
            router.replace({
                path:'login',
                query: {redirect: router.currentRoute.fullPath}
            })
        break
    }

    return Promise.reject(error.response.data)
})



export default service