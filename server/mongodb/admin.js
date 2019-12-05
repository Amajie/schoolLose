
const {mongoose, Schema} = require('./connectData.js')

const adminSchema = new Schema({
    adminName: {// 用户名
        type: String,
        default: ''
    },
    adminPassword: {// 密码
        type: String,
        required: true
    },
    adminEmail: {// 邮箱
        type: String,
        required: true
    },
    adminGrade:{// 权限等级
        type: Number,
        required: true
    },
    adminTag:{// 是否被冻结 true 未冻结 false 冻结
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('admin', adminSchema)