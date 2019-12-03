

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

    store.commit('setState', {
        lodingETag: false,
        lodingSTag: false
    })

    // 说明账户已经在别处登陆过
    if(response.data.code === 110){
        dAlert('该账号已在别处登陆，您已被强制下线！若不是本人操作，请尽快修改密码')
        .then(() =>{
            cookie.remove('c_che_token')
            router.replace('/login')
        })
    }


    return response
}

export const responseError = error =>{
    const {status} = error.response
    console.log(error.response)
    switch(status){
        /**
         * 1 此时表示 token存在 但是已经过期
         * 2 删除 token 跳转到登陆页面上
         * 3 跳转到登陆页面 并获取当前的路由信息(router.currentRoute.fullPath) 
         *      当登陆成功后跳转到该路由下
         */
        case 401:  
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
        case 500:  
            /**
             * 显示友好页面 但是此时是 根据返回的数据来是否显示404
             * 但是如果此时网络较差的话 还是会显示具体页面在跳转的404页面
             */
            console.log('500错误')
        break
    }

    store.commit('setState', {
        lodingETag: false,
        lodingSTag: false
    })

    //这里只是打印 并不需要 还需要处理500错误
    // return Promise.reject(error.response.data)
}
