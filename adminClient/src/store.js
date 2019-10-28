import Vue from 'vue'
import Vuex from 'vuex'
import $router from './router/index.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        token: '',
        lodingETag: false,
        lodingSTag: false,
        regEmail: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"),
        adminData: {adminGrade: 1, adminEmail: '651762920@qq.com'},
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
        courtyardData: [
            '物理与信息工程学院',
            '文学院',
            '外国语学院',
            '法学与公共管理学院',
            '数学与统计学院',
            '化学与环境学院',
            '历史系',
            '计算机学院',
            '教育科学学院',
            '体育学院',
            '商学院',
            '生物科学与技术学院',
            '艺术学院',
            '新闻传播学院',
            '马克思主义学院',
        ],
        //专业
        majorData: {
            '物理与信息工程学院':[
                '物理学', '电气工程及其自动化',
                '电子信息工程', '电子信息科学与技术',
                '应用电子技术教育', '光电信息科学与工程',
            ],
            '文学院':['汉语言文学', '汉语国际教育'],
            '外国语学院':['英语', '日语', '翻译', '商务英语'],
            '法学与公共管理学院':['法学', '政治学与行政学', '社会工作', '劳动与社会保障'],
            '数学与统计学院':['数学与应用数学', '信息与计算科学', '统计学', '应用统计学'],
            '化学与环境学院':[
                '物理学', '电气工程及其自动化', 
                '电子信息工程', '电子信息科学与技术', 
                '应用电子技术教育', '光电信息科学与工程'
            ],
            '历史系':['人文教育', '历史学', '地理科学'],
            '计算机学院':['计算机科学与技术', '网络工程', '软件工程'],
            '教育科学学院':['教育技术学', '学前教育', '小学教育', '心理学'],
            '体育学院':['体育教育', '社会体育指导与管理'],
            '商学院':[
                '经济学', '经济统计学', 
                '国际经济与贸易', '农林经济管理', 
                '经济与金融', '市场营销', '财务管理', 
                '人力资源管理', '旅游管理', 
                '旅游管理与服务教育', '文化产业管理'
            ],
            '生物科学与技术学院':[
                '生物科学', '食品科学与工程', '园林',
                '食品质量与安全', '园艺', '动物科学'
            ],
            '艺术学院':['音乐学', '美术学', '公共艺术'],
            '新闻传播学院':['广播电视学', '广告学', '编辑出版学', '广播电视编导'],
            '马克思主义学院':['思想政治教育'],
        },
        type_nav: {
            ['000']:{name: 'home_school_car', type: '银行卡'},
            ['001']:{name: 'home_id_car',  type: '证件类'},
            ['002']:{name: 'home_phone',  type: '电子产品'},
            ['003']:{name: 'home_jewelry',  type: '首饰'},
            ['004']:{name: 'home_life',  type: '生活用品'},
            ['005']:{name: 'home_book',  type: '书籍'},
            ['006']:{name: 'home_pet',  type: '宠物'},
            ['007']:{name: 'home_other',  type: '其他'}
        }
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
            console.log(data)
            
        }
    },
    actions:{

    }
})


export default store