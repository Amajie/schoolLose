import axios from 'axios'

const service = axios.create({
    baseURL: 'http://localhost:7070',  // 这里即为 url 加上 这里baseURL  即指定了域名和端口 
    timeout: 5000  //请求超时时间
})


//请求处理  此时可以把token 保存在session中 并设置过期时间
service.interceptors.request.use(config =>{

    // 后台也已经允许什么请求头可以传到后台
    config.headers['Authorization'] = 'jie412.com'//注意请求头不能出现中文 不然会报错
    return config
}, error =>{
    console.log('超时')
})

//响应处理
service.interceptors.response.use(response =>{

    return response
}, error =>{
    console.log(111+error)
})



export default service