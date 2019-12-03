import Vue from 'vue'
import Vuex from 'vuex'
import $router from './router/index.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: sessionStorage.getItem('c_state') ? JSON.parse(sessionStorage.getItem('c_state')):{
        lodingETag: false,
        lodingSTag: false,
        userData: {},

        // 评论的最长字数
        maxCommit: 88,

        homeData: [],
        homePage: 0,
        homePageNum: 16,
        homeFinished: false,
        type_nav_data: [],

        centerData: [],
        centerPage: 0,
        centerPageNum: 16,

        searchData: [],
        searchPage: 0,
        searchPageNum: 16,
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
        removeToken(state, cookie){
            cookie.remove('c_che_token')
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

        // 需要验证码修改用户信息 处理函数
        handleCheckCode(state, vm){

            const {checkCode, checkId, $router, checkTag,
                dAlert, checkEmailCode, changeData, cookie} = vm

            checkEmailCode({
                checkCode, 
                checkId,
                checkTag,
                changeData
            }).then(res =>{

                const {code} = res.data

                if(code === 0) return dAlert('验证码不存在或者已失效，请重新获取!')

                if(code === 1) return dAlert('验证码错误，请重新输入!')

                if(code === -1) return dAlert('操作失败，请重新输入验证码!')

                if(code === 200)  return dAlert('验证码正确，激活成功!')
                    .then(() =>{
                        //激活成功 前往登陆页面
                        $router.replace('/login')
                        cookie.remove('c_che_remeber')
                    })
            })
        },
        // 账户退出
        logoutCount(state, {cookie, $router}){
            
            // 只是删除 token
            sessionStorage.removeItem('c_state')
            cookie.remove('c_che_token')
            store.replaceState(JSON.parse(sessionStorage.getItem('c_empty_state')))
            $router.replace('/login')
        },

        // token存在 自动登陆 这是针对 登陆后 不能在访问的路由
        autoLogin(state, {vm, next}){
            const {cookie, $store} = vm
            const token = cookie.get('c_che_token')
            
            // token 存在 直接返回首页
            if(token){
                next('/home')
            
            // token不存在 则删除数据
            }else{
                sessionStorage.removeItem('c_state')
                $store.replaceState(JSON.parse(sessionStorage.getItem('c_empty_state')))
            }
        }
    },
    actions:{

    }
})


export default store