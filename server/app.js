const express = require('express')
const bodyParser = require('body-parser')

const constInfo = require('./mongodb/constant.js')
const {TYPE_NAV, COURTYARDDATA} = require('./router/CONST.js')

const app = express()

const router = require('./router/router.js')
const adminRouter = require('./router/adminRouter.js')

app.use(bodyParser.urlencoded({ extended: false, limit: '20000kb'}))
app.use(bodyParser.json({"limit": "20000kb"}))

//暴漏静态资源文件 暴漏之后我们可以通过域名访问该文件下的资源
app.use(express.static('p'))

app.use(router)
app.use(adminRouter)

// 初始化一些数据
// initData()

function initData(){
    let constantArr = []

    // 这是 分类id
    constantArr.push(new constInfo({
        constKey: 'type_nav',
        constVal: TYPE_NAV
    }))

    // 这是学院信息
    constantArr.push(new constInfo({
        constKey: 'courtyardData',
        constVal: COURTYARDDATA
    }))

    constInfo.insertMany(constantArr, (err, data) =>{
        console.log(data)
    })
}

app.listen(7070, function(){
    console.log('server is running at 7070...')
})