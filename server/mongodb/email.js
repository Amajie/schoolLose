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

const emailInfo = mongoose.model('emailCode', emailSchema)
const expires = 60

// // 这里虽然可以 但是 但是不是很理想
// emailInfo.createIndexes(emailSchema.index({limeTime : 1}, {expires}),
//     function(err, info){                        
//         console.log(`验证吗已经插入, 定时${expires}秒`)

// })


exports.emailInfo = emailInfo
exports.emailSchema = emailSchema