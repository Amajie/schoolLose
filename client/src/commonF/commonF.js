
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
    const {passStep} = store.state.userData
    
    // 说明身份没有得到同意
    if(passStep != 2){
        
        let message = '您的身份信息还没有完善，请尽快完善信息，并等待管理员的审核'
        if(passStep === 1) message = '管理员还没审核您提交的信息，审核通过后才能发布帖子'
        if(passStep === 3) message = '您的身份审核未通过，请确认信息无误后再次提交'
        Dialog.alert({message})

        return false
    }

    return true
}