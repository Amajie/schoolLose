
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


/**
 * @function 用户名的修改
 * @param {*} data 发送的数据
 */
export const cName = data =>{
    return service({
        url: '/cn',
        method: 'post',
        data
    })
}

/**
 * @function 密码的修改
 * @param {*} data 发送的数据
 */
export const cPaw = data =>{
    return service({
        url: '/cp',
        method: 'post',
        data
    })
}


/**
 * @function 邮箱的修改
 * @param {*} data 发送的数据
 */
export const cEmail = data =>{
    return service({
        url: '/ce',
        method: 'post',
        data
    })
}

/**
 * @function 个人信息的修改
 * @param {*} data 发送的数据
 */
export const cInfo = data =>{
    return service({
        url: '/ci',
        method: 'post',
        data
    })
}
/**
 * @function 个人信息的获取
 * @param {*} params 发送的数据
 */
export const fInfo = params =>{
    return service({
        url: '/fi',
        method: 'post',
        params
    })
}


/**
 * @function 头像的上传
 * @param {*} data 发送的数据
 */
export const upAvater = data =>{
    
    return service({
        url: '/upAvatar',
        method: 'post',
        data
    })
}


/**
 * @function 寻物消息的发布
 * @param {*} data 发送的数据
 */
export const reObject = data =>{
    return service({
        url: '/reObject',
        method: 'post',
        data
    })
}


/**
 * @function 测试
 * @param {*} data 发送的数据
 */
export const text = data =>{
    return service({
        url: '/text',
        method: 'post',
        data
    })
}