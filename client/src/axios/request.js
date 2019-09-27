import axios from 'axios'

import qs from 'qs'

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
    //此时发送到后台的 都是文本 boolean数据发送不了 只能约定了
    config.method.toLowerCase() === 'post' ?
        config.data = qs.stringify({...config.data}): config.params = {...config.params}

    //此时需要token 后台判断是否需要 token 
    // config.headers['Authorization'] = localStorage.token
    config.headers['jie412.com-token'] = 'che-hj'
    return config
}, error =>{
    console.log('超时')
})

//响应处理
service.interceptors.response.use(response =>{
    // 这里限制 某些url 不需要 token 根据数据返回是 code 是否为 55555
    return response
}, error =>{
    console.log(111+error)
})



export default service