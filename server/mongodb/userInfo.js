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
    userType: {
        type: String,
        required: true// 0 表示 学生 1 表示 老师
    },
    gender:{ //性别
        type: String,
        default: ''
    },
    headerImg:{
        type: String,
        default: ''
    }, //给他一张默认的图片
    userId:{ //学号 
        type: String,
        default: ''
    },
    college:{ //学院
        type: String,
        default: ''
    },
    address:{ //宿舍地址 类型为老师 直接设置 闽师大 即可
        type: String,
        default: ''
    },
    userActive:{
        type: Boolean,
        default: false//false 未激活 true 已经激活
    }
})

module.exports = mongoose.model('user', userSchema)