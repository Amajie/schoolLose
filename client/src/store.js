import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { Toast, Dialog} from 'vant'
const store = new Vuex.Store({
    state:{
        token: '',
        lodingETag: false,
        lodingSTag: false,
        regEmail: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"),
        userData: {},
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
            ['校园卡']:{name: 'school_car', url: '/', id: 43},
            ['借书证']:{name: 'library_card', url: '/', id: 54},
            ['身份证']:{name: 'id_car', url: '/', id: 56},
            ['手机']:{name: 'phone', url: '/', id: 12},
            ['耳机']:{name: 'headset', url: '/', id: 94},
            ['U盘']:{name: 'usb_drive', url: '/', id: 73},
            ['首饰']:{name: 'jewelry', url: '/', id: 84},
            ['眼镜']:{name: 'glasses', url: '/', id: 71},
            ['手表']:{name: 'watch', url: '/', id: 99},
            ['书籍']:{name: 'book', url: '/', id: 34},
            ['水杯']:{name: 'water', url: '/', id: 10},
            ['雨伞']:{name: 'umbrella', url: '/', id: 77}
        },
        type_list: [
            '校园卡',
            '借书证',
            '身份证',
            '手机',
            '耳机',
            'U盘',
            '首饰',
            '眼镜',
            '手表',
            '书籍',
            '水杯',
            '雨伞'
        ]

    },
    mutations: {
        //删除token
        removeToken(state){
            localStorage.removeItem('token')
        },
        //设置 state属性
        setState(state, setState){
            for(let item in setState){
                state[item] = setState[item]
            }
        },

        // 设置某个 用户的个人信息
        setUserData(state, userData){
            state.userData = userData
        }
    },
    actions:{

    }
})


export default store