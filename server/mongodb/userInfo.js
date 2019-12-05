

const {mongoose, Schema} = require('./connectData.js')

var userSchema = new Schema({

    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passStep: {
        type: Number,
        default: 0
    }, //默认 为 0 一旦信息完善 就设置为 1 通过验证设置为 2 未通过验证 设置为3
    credePic: {
        type: Array,
        default: []
    },// 证件照
    userType: {
        type: Number,
        required: true// 学生 老师
    },
    avater:{
        type: String,
        default: 'http://127.0.0.1:7070/init/init.png'
    }, //给他一张默认的图片
    myConcern:{
        type: Array,
        default: []
    }, //我的关注列表
    myCollection:{
        type: Array,
        default: []
    }, //他人关注列表
    userActive:{
        type: Boolean,
        default: false//false 未激活 true 已经激活
    },

// 一下信息统一修改
    name:{
        type: String,
        default: ''
    },
    stId:{ //学号 或者教工号
        type: String,
        default: ''
    },
    gender:{ //性别
        type: String,
        default: ''
    },
    courtyard:{ //学院
        type: String,
        default: ''
    },
    major:{ //专业
        type: String,
        default: ''
    },
    classes:{// 班级
        type: String,
        default: ''
    },
    address:{ //宿舍地址 类型为老师 直接设置 闽师大 即可
        type: String,
        default: ''
    },
    freezeTag:{ //账号的冻结与否
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('user', userSchema)