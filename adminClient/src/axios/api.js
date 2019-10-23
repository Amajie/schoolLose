
/**
*@api.js 这里封装发送请求的方法
*@get 请求 数据为 params
*@post 请求 数据为 data
*/
import {entryService, sendService, notService} from './request.js'


/**
 * @function 获取数据
 * @param {*} params 发送的数据
 */
export const aUserInfo = params =>{
    return notService({
        url: '/a_userInfo',
        method: 'get',
        params
    })
}

/**
 * @function 修改用户的数据
 * @param {*} data 发送的数据
 */
export const aUpInfo = data =>{
    return notService({
        url: '/a_upInfo',
        method: 'post',
        data
    })
}