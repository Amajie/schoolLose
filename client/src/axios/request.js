import axios from 'axios'
import {request, requestError, response, responseError} from './handle_request.js'

const createObj = {
    // baseURL: 'http://192.168.43.124:7070',  // 这里即为 url 加上 这里baseURL  即指定了域名和端口 
    baseURL: '/api',
    timeout: 5000,  //请求超时时间
    crossDomain: true,//设置cross跨域
    withCredentials: false
}

const eService = axios.create(createObj)
const sService = axios.create(createObj)
const nService = axios.create(createObj)

eService.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
sService.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
nService.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'


//请求处理  此时可以把token 保存在session中 并设置过期时间
eService.interceptors.request.use(config => request({config, tag: true}), error => {requestError(error)})
sService.interceptors.request.use(config => request({config, tag: false}), error => {requestError(error)})
nService.interceptors.request.use(config => request({config, notLoad: true}), error => {requestError(error)})

//响应处理
eService.interceptors.response.use(res => response(res), error => {responseError(error)})
sService.interceptors.response.use(res => response(res), error => {responseError(error)})
nService.interceptors.response.use(res => response(res), error => {responseError(error)})

export const entryService = eService
export const sendService = sService
export const notService = nService