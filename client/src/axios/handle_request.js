

import store from '../store.js'
import router from '../router/index.js'
import cookie from 'vue-cookies'
import {dAlert} from '../components/vant/vant.js'

export const request = ({config, tag, notLoad}) =>{

    // 后台也已经允许什么请求头可以传到后台
    //注意请求头不能出现中文

    // config.method.toLowerCase() === 'post' ?
    //     config.data = qs.stringify({...config.data}): config.params = {...config.params}

    // tag --> true 全白  false   透明
    !notLoad && store.commit('setState', {
        lodingETag: tag,
        lodingSTag: !tag
    })

    //此时需要token 后台判断是否需要 token 
    config.headers['jie412.com-token'] = cookie.get('c_che_token')

    return config

}

export const requestError = () =>{
    console.log('超时')
}


export const response = response =>{

    const {code} = response.data
    
    // 显示相应的加载图标
    store.commit('setState', {
        lodingETag: false,
        lodingSTag: false
    })

    switch(code){
        case 401: 
            // 可以提示登陆时间到，需要重新登陆 
            //删除token
            store.commit('removeToken', cookie)
            // 前往登陆 获取路由信息 登陆成功自动跳转
            router.replace({
                path:'login',
                query: {redirect: router.currentRoute.fullPath}
            })
        break
        /**
         * 500错误 应该服务器错误
         * 
         */
        case 110:  
            dAlert('该账号已在别处登陆，您已被强制下线！若不是本人操作，请尽快修改密码')
            .then(() =>{
                cookie.remove('c_che_token')
                router.replace('/login')
            })
        break
    }


    return response
}

export const responseError = error =>{

    // 关闭相应的加载图标
    store.commit('setState', {
        lodingETag: false,
        lodingSTag: false
    })

    //这里只是打印 并不需要 还需要处理500错误
    return Promise.reject(error.response.data)
}
