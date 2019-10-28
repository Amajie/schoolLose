
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
export const aUserInfo = params =>{
    return service({
        url: '/a_userInfo',
        method: 'get',
        params
    })
}

/**
 * @function 用户的创建
 * @param {*} data 发送的数据
 */
export const cAdmin = data =>{
    return service({
        url: '/c_admin',
        method: 'post',
        data
    })
}
/**
 * @function 密码修改
 * @param {*} data 发送的数据
 */
export const cAdminPaw = data =>{
    return service({
        url: '/up_admin',
        method: 'post',
        data
    })
}


/**
 * @function 管理员登陆
 * @param {*} data 发送的数据
 */
export const lAdmin = data =>{
    return service({
        url: '/l_admin',
        method: 'post',
        data
    })
}
/**
 * @function 高级管理员查找用户
 * @param {*} params 发送的数据
 */
export const fAdminCount = params =>{
    return service({
        url: '/f_adminCount',
        method: 'get',
        params
    })
}
/**
 * @function 高级管理员删除用户
 * @param {*} data 发送的数据
 */
export const aDestroyCount = data =>{
    return service({
        url: '/a_destroycount',
        method: 'post',
        data
    })
}

/**
 * @function 用户搜索
 * @param {*} params 发送的数据
 */
export const aSearchUser = params =>{
    return service({
        url: '/a_searchUser',
        method: 'get',
        params
    })
}

/**
 * @function 修改用户的数据
 * @param {*} data 发送的数据
 */
export const aUpUInfo = data =>{
    return service({
        url: '/a_upUInfo',
        method: 'post',
        data
    })
}

/**
 * @function 查找帖子信息
 * @param {*} data 发送的数据
 */
export const aFInfo = params =>{
    return service({
        url: '/a_fInfo',
        method: 'get',
        params
    })
}


/**
 * @function 修改帖子信息
 * @param {*} data 发送的数据
 */
export const aUpOInfo = data =>{
    return service({
        url: '/a_upOInfo',
        method: 'post',
        data
    })
}


/**
 * @function 帖子的搜索 
 * @param {*} params 搜索的限制条件
 */
export const gSearchInfo = params =>{
    return service({
        url: '/search_f_info',
        method: 'get',
        params
    })
}