
/**
*@api.js 这里封装发送请求的方法
*@get 请求 数据为 params
*@post 请求 数据为 data
*/
import service from './request.js'


/**
 * @function 发送注册前去
 * @param {*} data 发送的数据
 */
export const register = data =>{
    return service({
        url: '/register',
        method: 'post',
        data
    })
}


/**
 * @function 获取验证码
 * @param {*} params 发送的数据
 */
export const sendEmailCode = params =>{
    return service({
        url: '/sendE',
        method: 'get',
        params
    })
}

/**
 * @function 发送前台验证码
 * @param {*} params 发送的数据
 */

export const checkEmailCode = params =>{
    return service({
        url: '/checkE',
        method: 'get',
        params
    })
}

/**
 * @function 发送登陆请求
 * @param {*} params 发送的数据
 */
export const login = params =>{
    return service({
        url: '/login',
        method: 'get',
        params
    })
}