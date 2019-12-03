const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/slose", { useNewUrlParser: true })

var constantSchema = new Schema({
    constKey:{
        type: String,
        required: true
    },
    constVal:{
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('constant', constantSchema)