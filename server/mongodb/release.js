const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/slose", { useNewUrlParser: true })

const emailSchema = new Schema({
    userId: {// 楼主id
        type: Object,
        required: true
    },
    objectId: {// 消息id
        type: String,
        required: true
    },
    objectTime: {//时间
        type: String,
        required: true
    },
    objectAddress: {// 地址
        type: String,
        required: true
    },
    objectTag: {// 标志着是否完成
        type: String,
        required: true
    },
    objectWay: {// 拾取 还是丢失
        type: String,
        required: true
    },
    objectImg: {// 物品图片
        type: Array,
        default: []
    },
    objectDesc: {// 说明
        type: String,
        default: ''
    }
})

exports.emailInfo = mongoose.model('emailCode', emailSchema)
exports.emailSchema = emailSchema