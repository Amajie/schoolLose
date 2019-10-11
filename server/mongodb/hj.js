const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/slose", { useNewUrlParser: true })

var userSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    
    array: {
        type: Array,
        required: true
    },

})

module.exports = mongoose.model('hj', userSchema)