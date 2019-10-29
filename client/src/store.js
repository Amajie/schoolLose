import Vue from 'vue'
import Vuex from 'vuex'
import $router from './router/index.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: sessionStorage.getItem('c_state') ? JSON.parse(sessionStorage.getItem('c_state')):{
        remeberCount: false,
        lodingETag: false,
        lodingSTag: false,
        regEmail: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"),
        userData: {},

        homeData: [],
        homePage: 0,
        homePageNum: 4,
        homeFinished: false,

        centerData: [],
        centerPage: 0,
        centerPageNum: 1,

        searchData: [],
        searchPage: 0,
        searchPageNum: 6,
        searchFinished: false,
        searchParams: {},
        
        // examine
        infoTag: false,
        //学院 信息
        courtyardData:{},
        // 分类信息
        type_nav:{}
    },
    mutations: {
        //删除token
        removeToken(state){
            localStorage.removeItem('token')
        },
        //设置 state属性
        setState(state, setState){
            for(let key in setState){
                state[key] = setState[key]
            }
        },

        // 前往详细信息页面
        toDetail(state, {cheId, objectId}){
            /**
             * 跳转到详情页 以下数据可通过 homeData获取
             *  1 用户的 cheId id
             *  2 信息的 objectId id
             */
            $router.push(`/c/detail/${cheId}/${objectId}`)
        },
        // 前往用户的个人中心
        toUserCenter(state, cheId){
            $router.push(`/c/center/${cheId}`)
        },
        /**
         * 
         * @param {*} state 
         * @param {*} urlData 跳转的数据 tag 方式 url 路径
         */
        handleRouter(state, {tag, url}){
            
            switch(tag){
                case 'r':
                    $router.replace(url)
                    break
                case 'p':
                    $router.push(url)
                    break
                default:
                    return $router.go(-1)
                    
            }
        },

        /**
         * 
         * @param {*} state 
         * @param {*} param1 key 合并的数据(必须是数组) data合并的内容
         */
        concatArr(state, {key, data}){
            state[key] = state[key].concat(data)
            console.log(data)
            
        },
        // 账户退出
        logoutCount(state, {cookie, $router}){
            
            // 只是删除 token
            sessionStorage.removeItem('c_state')
            cookie.remove('c_che_token')
            store.replaceState(JSON.parse(sessionStorage.getItem('c_empty_state')))
            $router.replace({name: 'Login', params:{logoutTag: state.remeberCount}})
        }
    },
    actions:{

    }
})


export default store