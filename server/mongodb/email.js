const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/slose", { useNewUrlParser: true })

const emailSchema = new Schema({
    limeTime: {
        type: Object,
        required: true
    },
    checkId: {
        type: String,
        required: true
    },
    checkCode: {
        type: String,
        required: true
    },
    /*
    *@checkTag 标志着这个验证码 是验证什么
    *@params register 激活账户
    *
    */
   checkTag:{
        type: String,
        required: true
    }
})

exports.emailInfo = mongoose.model('emailCode', emailSchema)
exports.emailSchema = emailSchema