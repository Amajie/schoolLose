
const {mongoose, Schema} = require('./connectData.js')

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