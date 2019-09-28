const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const app = express()

//解决跨域
// app.all('*',function (req, res, next) {
//     // res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Origin', 'http://192.168.43.124:8080/');
//     res.header('Access-Control-Allow-Credentials: true')
//     // res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     if (req.method == 'OPTIONS') {
//         res.send(200)
//     }
//     else {
//         next()
//     }
// })

const router = require('./router/router.js')
const re_lo = require('./router/login_register.js')

app.use(bodyParser.urlencoded({ extended: false, limit: '20000kb'}))
app.use(bodyParser.json({"limit": "20000kb"}))

app.use(cookieParser())

//session 向浏览器返回数据才能 获取得到
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000*60*10
    }
}))

//当有请求过来的时候 会刷新session 注意此时是在使用session之后
app.use(function(req, res, next){
    req.session._garbage = Date()
    req.session.touch()
    next()
})

app.use(router)
app.use(re_lo)


app.listen(7070, function(){
    console.log('server is running at 7070...')
})