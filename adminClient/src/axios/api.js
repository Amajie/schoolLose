
/**
*@api.js 这里封装发送请求的方法
*@get 请求 数据为 params
*@post 请求 数据为 data
*/
import service from './request.js'

/**
 * @function 获取数据
 * @param {*} params 发送的数据
 */
export const examineUser = params =>{
    return service({
        url: '/examine_user',
        method: 'get',
        params
    })
}

/**
 * @function 用户的创建
 * @param {*} data 发送的数据
 */
export const createAdmin = data =>{
    return service({
        url: '/create_admin',
        method: 'post',
        data
    })
}
/**
 * @function 密码修改
 * @param {*} data 发送的数据
 */
export const updataAdmin = data =>{
    return service({
        url: '/updata_admin',
        method: 'post',
        data
    })
}


/**
 * @function 管理员登陆
 * @param {*} data 发送的数据
 */
export const adminLogin = data =>{
    return service({
        url: '/admin_login',
        method: 'post',
        data
    })
}
/**
 * @function 高级管理员查找用户
 * @param {*} params 发送的数据
 */
export const getAdmin = params =>{
    return service({
        url: '/get_admin',
        method: 'get',
        params
    })
}
/**
 * @function 高级管理员删除用户
 * @param {*} data 发送的数据
 */
export const destroyCount = data =>{
    return service({
        url: '/destroy_count',
        method: 'post',
        data
    })
}


/**
 * @function 用户搜索
 * @param {*} params 发送的数据
 */
export const searchUser = params =>{
    return service({
        url: '/search_user',
        method: 'get',
        params
    })
}

/**
 * @function 修改用户的数据
 * @param {*} data 发送的数据
 */
export const updataUser = data =>{
    return service({
        url: '/updata_user',
        method: 'post',
        data
    })
}


/**
 * @function 查找帖子信息
 * @param {*} data 发送的数据
 */
export const examineObject = params =>{
    return service({
        url: '/examine_object',
        method: 'get',
        params
    })
}


/**
 * @function 修改帖子信息
 * @param {*} data 发送的数据
 */
export const updataObject = data =>{
    return service({
        url: '/updata_object',
        method: 'post',
        data
    })
}


/**
 * @function 帖子的搜索 
 * @param {*} params 搜索的限制条件
 */
export const searchObject = params =>{
    return service({
        url: '/search_object',
        method: 'get',
        params
    })
}