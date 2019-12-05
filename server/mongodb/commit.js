
const {mongoose, Schema} = require('./connectData.js')

var commitSchema = new Schema({
    infoUserId:{
        type: String,
        required: true
    },
    infoId:{
        type: String,
        required: true
    },
    fromId:{
        type: Object,
        required: true
    },
    toId:{
        type: Object,
        default: ""
    },
    commitId:{
        type: String,
        default: ''
    },
    commit:{
        type: String,
        required: true
    },
    replyCommit:{
        type: String,
        default: ""
    },
    commitTime:{
        type: String,
        required: true
    },
    commitTag:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('commit', commitSchema)