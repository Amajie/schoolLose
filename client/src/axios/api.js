
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
 * @function 获取个人信息是否被激活
 * @param {*} params 发送的数据
 */
export const getAuthoryTag = params =>{
    return notService({
        url: '/get_authory',
        method: 'get',
        params
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
export const insertObject = data =>{
    return sendService({
        url: '/insert_object',
        method: 'post',
        data
    })
}

/**
 * @function 寻物消息的更新
 * @param {*} data 发送的数据
 */
export const editObject = data =>{
    return sendService({
        url: '/edit_Object',
        method: 'post',
        data
    })
}


/**
 * @function 寻物消息的删除
 * @param {*} params 发送的数据
 * @param {*} objectDelect 其实就是把该字段置为 1 即可
 */
export const deObject = params =>{
    return sendService({
        url: '/de_object',
        method: 'get',
        params
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
 * @param {*} params 发送的数据
 */
export const getDetail = params =>{
    return entryService({
        url: '/get_detail',
        method: 'get',
        params
    })
}

/**
 * @function 关注
 * @param {*} data 发送的数据
 */
export const concren = data =>{
    return sendService({
        url: '/concren',
        method: 'post',
        data
    })
}
/**
 * @function 关注列表查找
 * @param {*} params 发送的数据
 */
export const getConcren = params =>{
    return entryService({
        url: '/get_concren',
        method: 'get',
        params
    })
}


/**
 * @function 搜藏 取消搜藏
 * @param {*} data 发送的数据
 */
export const sendCollection = data =>{
    return sendService({
        url: '/collection',
        method: 'post',
        data
    })
}

/**
 * @function 搜藏列表查找
 * @param {*} params 发送的数据
 */
export const getCollection = params =>{
    return entryService({
        url: '/get_collection',
        method: 'get',
        params
    })
}

/**
 * @function 我的留言列表查找
 * @param {*} params 发送的数据
 */
export const getMyCommit = params =>{
    return notService({
        url: '/f_my_commit',
        method: 'get',
        params
    })
}

/**
 * @function 留言删除
 * @param {*} params 发送的数据
 */
export const delectMyCommit = params =>{
    return notService({
        url: '/d_my_commit',
        method: 'get',
        params
    })
}


/**
 * @function 首页消息的查找
 * @param {*} params 发送的数据
 */
export const gHomeData = params =>{
    return notService({
        url: '/get_home_data',
        method: 'get',
        params
    })
}


/**
 * @function 消息的搜索 此时应该只有 内容区显示加载 后面再改
 * @param {*} params 搜索的限制条件
 */
export const searchObject = params =>{
    return notService({
        url: '/search_object',
        method: 'get',
        params
    })
}


/**
 * @function 写留言
 * @param {*} data 发送的数据
 */
export const insertCommit = data =>{
    return sendService({
        url: '/insertCommit',
        method: 'post',
        data
    })
}
/**
 * @function 查找留言
 * @param {*} params 发送的数据
 */
export const getObjectCommit = params =>{
    
    return notService({
        url: '/get_object_commit',
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