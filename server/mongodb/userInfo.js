const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/graproject", { useNewUrlParser: true })

var userSchema = new Schema({
    userId:{
        type: Object,
        required: true
    },
    realName: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: '*'
    },
    trade: {
        type: String,
        default: '*'
    },
    year: {
        type: String,
        default: '*'
    },
    month: {
        type: String,
        default: '*'
    },
    data: {
        type: String,
        default: '*'
    },
    province: {
        type: String,
        default: '*'
    },
    city: {
        type: String,
        default: '*'
    },
    intronl: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('user', userSchema)