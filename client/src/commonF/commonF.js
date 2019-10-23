
import store from '../store.js'
import {Dialog} from 'vant'

/**
 * @function 遍历该分类列表 是否存在某个id
 * @param {*} type_nav 物品列表
 * @param {*} val      选择物品的键
 */
export const findTypeId = (type_nav, targetKey) =>{
    let objectType = ''
    for(var key in type_nav){
        if(key === targetKey) return objectType = type_nav[key].type
    }

    return objectType
}

/**
 * @function 根据用户选择的物品类型---返回相应的key
 * @param {*} type_nav 物品列表
 * @param {*} val      选择物品的键
 */
export const selectTypeId = (type_nav, val) =>{
    let objectTypeId = ''
    for(var key in type_nav){
        if(type_nav[key].type === val)
            objectTypeId = key
    }
    
    return objectTypeId
}

/**
 * @function 是否获取权限
 * @param {*}
 * @param {*}
 */
export const getAuthory = () =>{
    const {authory} = store.state.userData
    if(authory) return authory
    Dialog.alert({
        message: '您的身份还没有通过审核，如已完善信息，请耐心等待'
    })
    return authory
}