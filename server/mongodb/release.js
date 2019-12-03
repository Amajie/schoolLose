const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/slose", { useNewUrlParser: true })

const reSchema = new Schema({
    objectUserId: {// 楼主id
        type: Object,
        required: true
    },
    objectId: {// 消息id
        type: String,
        required: true
    },
    objectName: {// 物品的具体名称
        type: String,
        required: true
    },
    objectTime: {// 拾取 或者丢失 时间
        type: Number,
        required: true
    },
    objectAddress: {// 地址
        type: String,
        required: true
    },
    objectWay: {// 拾取 还是丢失 true 丢失 false 拾取
        type: Boolean,
        required: true
    },
    objectTypeId: {// 类型
        type: String,
        required: true
    },
    sendTime: {// 发布时间
        type: Number,
        required: true
    },
    objectImg: {// 物品图片
        type: Array,
        required: true
    },
    objectDesc: {// 说明
        type: String,
        default: ''
    },
    objectDelect: {//消息是否删除
        type: Boolean,
        default: true// true 未删除 false 已经删除
    },
    objectStepTag: {//审核步骤
        type: Number,
        default: 1// 1 信息的填写 2 未通过审核 3 通过审核
    },
    objectPassTag: {//消息是否通过审核
        type: Boolean,
        default: false // 默认没有通过审核
    },
    objectReason: {// 消息 不通过的时候 理由
        type: String,
        default: ''
    },

    objectAuthory: {// 消息 管理员可以通过设置该字段
                    // 决定是否可以访问
        type: Boolean,
        default: true
    },
    objectFinish: {// 消息 是否完成 默认没完成
        type: Boolean,
        default: true
    },
    finishTime: {// 消息 完成时间
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('release', reSchema)