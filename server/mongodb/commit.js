const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/slose", { useNewUrlParser: true })

var commitSchema = new Schema({
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
    commit:{
        type: String,
        required: true
    },
    commitTime:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('commit', commitSchema)