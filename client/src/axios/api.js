
// 此时在这里分装我们的请求处理
import service from './request.js'

//此时这些方法都是返回Promise对象 可以对返回结果进行操作
export const register = data =>{
    return service({
        url: '/md',
        method: 'get',
        data
    })
}