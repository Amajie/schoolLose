import Vue from 'vue'
import Vuex from 'vuex'
import $router from './router/index.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: sessionStorage.getItem('a_state') ? JSON.parse(sessionStorage.getItem('a_state')):{
        token: '',
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
        // searchOPageNum: 1,
        target: '',

        // 搜索帖子 的公共数据
        searchTotal: 0, // 搜索的总页数 默认为 0
        searchPageSize: 10, //每一页展示几条

        //学院
        courtyardData: {},
        type_nav: {}
    },
    mutations: {
        
        //设置 state属性
        setState(state, setState){
            for(let key in setState){
                state[key] = setState[key]
            }
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