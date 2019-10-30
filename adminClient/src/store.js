import Vue from 'vue'
import Vuex from 'vuex'
import $router from './router/index.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: sessionStorage.getItem('a_state') ? JSON.parse(sessionStorage.getItem('a_state')):{
    // state:{
        token: '',
        lodingETag: false,
        lodingSTag: false,
        adminData: {},
        createCount: [],

        fullsLoad: false,
        // 用户
        searchUData: null,
        searchWord: '',
        searchUOPage: 0,
        searchUOTotal: 0,
        searchUOData: [],
        showUObjectTag: false,
        // 帖子
        searchOData: [],
        searchOPage: 0,
        searchOPageNum: 1,
        target: '',

        searchTotal: 0,

        pageSize: 2, //每一页展示几条

        //学院
        courtyardData: {},
        type_nav: {}
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

        // 设置某个 用户的个人信息
        setUserData(state, userData){
            state.userData = userData
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
        },

        // 账户退出
        logoutCount(state, {cookie, $router}){
            /**
             * 1、删除 sessionStorage数据
             * 2、初始化 state
             */
            
            sessionStorage.removeItem('a_state')
            cookie.remove('a_che_token')
            store.replaceState(JSON.parse(sessionStorage.getItem('a_empty_state')))
            $router.replace('/login')
        }
    },
    actions:{

    }
})


export default store