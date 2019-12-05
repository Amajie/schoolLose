const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost/slose", { useNewUrlParser: true })

exports.mongoose = mongoose
exports.Schema = mongoose.Schema