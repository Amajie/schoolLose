
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
        if(type_nav[key].type != val) return
        objectTypeId = key
    }

    return objectTypeId
}