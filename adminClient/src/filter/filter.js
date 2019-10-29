

import store from '../store.js'


/**
 * @function 根据分类id拿取相应的分类
 * @param {*} key 这是 物品类型分类 key值
 */
export const  filterTypeName = (key) => {
    console.log(store.state.type_nav)
    // 这个过滤器 在组件初始化的时候会调用一次 因此 值可能为undefined的
    if(!key) return 

    return store.state.type_nav[key].type
}

 /**
 * tag 为true 即为显示年月日 小时 分
 *      false 即为显示年月日
 */
export const filterTime = (time, tag) =>{
    const data = new Date(Number(time))
    if(!tag) return `${data.getFullYear()}-${('0'+(1+data.getMonth())).slice(-2)}-${('0'+data.getDate()).slice(-2)}`
    return `${data.getFullYear()}-${('0'+(1+data.getMonth())).slice(-2)}-${('0'+data.getDate()).slice(-2)} 
                    ${('0'+data.getHours()).slice(-2)}:
                    ${('0'+data.getMinutes()).slice(-2)}`
}