const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const router = require('./router/router.js')
const adminRouter = require('./router/adminRouter.js')

app.use(bodyParser.urlencoded({ extended: false, limit: '20000kb'}))
app.use(bodyParser.json({"limit": "20000kb"}))

//暴漏静态资源文件 暴漏之后我们可以通过域名访问该文件下的资源
app.use(express.static('p'))

app.use(router)
app.use(adminRouter)


app.listen(7070, function(){
    console.log('server is running at 7070...')
})