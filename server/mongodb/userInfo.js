const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/graproject", { useNewUrlParser: true })

var userSchema = new Schema({

    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emaild: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    gender:{ //性别
        Type: String,
        default: ''
    },
    headerImg:{
        type: String,
        default: ''
    },
    userId:{ //学号 
        Type: String,
        default: ''
    },
    college:{ //学院
        Type: String,
        default: ''
    },
    address:{ //宿舍地址 类型为老师 直接设置 闽师大 即可
        Type: String,
        default: ''
    },
})

module.exports = mongoose.model('user', userSchema)