
const express = require('express')
const router = express.Router()

//路由api
const {enter, cUserInfo} = require('../api/api.js')
//生成和解析token
const {checkToken} = require('../checkToken/jwt.js')

const userInfo = require('../mongodb/userInfo.js')

// 注册、登陆、发送激活验证码、验证验证码是否正确
router.post('/register', enter.register)
router.get('/login', enter.login)
router.get('/sendE', enter.sendE)
router.get('/checkE', enter.checkE)


//用户信息的修改
router.post('/cn', checkToken, cUserInfo.cUserName)
router.post('/cp', checkToken, cUserInfo.cUserPassword)
router.post('/ce', checkToken, cUserInfo.cUserEmail)
router.post('/ci', checkToken, cUserInfo.cUserInfo)
router.post('/fi', checkToken, cUserInfo.fUserInfo)

module.exports = router