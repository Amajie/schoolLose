
/**
*@api.js 这里封装发送请求的方法
*@get 请求 数据为 params
*@post 请求 数据为 data
*/
import {entryService, sendService, notService} from './request.js'


/**
 * @function 发送注册前去
 * @param {*} data 发送的数据
 */
export const register = data =>{
    return sendService({
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
    return sendService({
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
    return sendService({
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
    return sendService({
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
    return sendService({
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
    return sendService({
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
    return sendService({
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
    return sendService({
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
    return entryService({
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
    
    return sendService({
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
    return sendService({
        url: '/reObject',
        method: 'post',
        data
    })
}


/**
 * @function 消息的查找
 * @param {*} params 发送的数据
 */
export const gInfo = params =>{
    return entryService({
        url: '/fInfo',
        method: 'get',
        params
    })
}
/**
 * @function 消息详情页
 * @param {*} data 发送的数据
 */
export const getDetail = params =>{
    return entryService({
        url: '/fDetailInfo',
        method: 'get',
        params
    })
}


/**
 * @function 测试
 * @param {*} data 发送的数据
 */
export const text = data =>{
    return entryService({
        url: '/text',
        method: 'post',
        data
    })
}