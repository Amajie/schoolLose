
const express = require('express')
const router = express.Router()
const md5 = require('md5')
const sendEmail = require('../nodemailer/nodemailer.js')

//数据库信息
//个人信息表
const userInfo = require('../mongodb/userInfo.js')
//邮箱 验证码信息表
const {emailInfo, emailSchema} = require('../mongodb/email.js')
//邮箱验证码的类型
const {CREGISTER} = require('./CONST.js')

//加密与解密
const {decrypt, encrypt} = require('../crypto/encrypt.js')

//生成和解析token
const {createToken} = require('../checkToken/jwt.js')


router.get('/hjj', (req, res) =>{
    emailInfo.create({limeTime: new Date(), checkCode: 'sadhasd', checkId: 'hasks', checkTag: CREGISTER}, (err, createDate) =>{
 
        // 插入验证码失败
        if(!createDate) return res.send('失败')

        // emailInfo.createIndexes(emailSchema.index({limeTime : 1}, {expires:5}), function(err, info){
        //     console.log('info---->' +info)
        //     console.log('err---->' +err)
        //     //插入数据成功
        //     res.send('插入成功')
        // })

        emailInfo.createIndexes(emailSchema.index({limeTime : 1}, {expires:60}), function(err, info){
            console.log('info---->' +info)
            console.log('err---->' +err)
            //插入数据成功
            res.send('插入成功')
        })
   })
})


router.get('/hj', (req, res) =>{


    req.session.name = '车神'
    const mf = md5('huangjie')
    const mm = md5('huangjie')
    res.send(mf+'----'+mm)
    return
    // 官方推荐 不再使用remove
    emailInfo.deleteOne({checkTag: CREGISTER}, (err, removeData) =>{
        console.log(removeData)
        res.send('删除')
    })
})

router.post('/text', (req, res) =>{
    console.log(req.headers['jie412.com-token'])
    res.status(200).json({
        success: false,
        message: '没有提供token！'
    })
})
router.get('/cookie', (req, res) =>{
    if(req.cookies.userName){
        console.log(req.cookies.userName)
        res.send('再次欢迎你')
    }else{
        res.cookie('userName', '车神-黄杰', {maxAge:5000})
        res.send('欢迎你')
    }
})

function getToken(id){
    return (Math.random() + Date.now() + id).toString(36)
}


module.exports = router