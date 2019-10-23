const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/slose", { useNewUrlParser: true })

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
    authory: {
        type: Boolean,
        default: false
    },// 是否具有权限 只有管理员才能修改
    passTag: {
        type: Boolean,
        default: false
    },// 默认为false 即用户没有完善信息 当完善信息后 修改为true
        // 管理员 不通过 修改false 因此管理员只能看到为true的信息
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
        default: 'http://192.168.43.124:7070/av/init.png'
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
    }
})

module.exports = mongoose.model('user', userSchema)