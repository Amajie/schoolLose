import axios from 'axios'

const service = axios.create({
    //baseURL: process.env.BASE_URL,  // api的base_url 即为具体url
    //baseURL: 'http://localhost:7070',  // 这里即为 url 加上 这里baseURL  即指定了域名和端口 
    baseURL: '/api',  // 这里即为 url 加上 这里baseURL  即指定了域名和端口 
    timeout: 5000  //请求超时时间
})


//请求处理
service.interceptors.request.use(config =>{

    // config.headers.token = 'id序列'   不能直接设置 token取名字 因为请求头已经规定了什么变量
    // 后台也已经允许什么请求头可以传到后台
    config.headers['Authorization'] = 'che-hj'//注意请求头不能出现中文 不然会报错
    // console.log(config.headers.common)
    return config
}, error =>{
    console.log('超时')
})

//响应处理
service.interceptors.response.use(response =>{
    //后台发现没有token 即返回一个数据 表示没有 token
    return response
}, error =>{
    console.log(111+error)
})



export default service