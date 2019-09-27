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

exports.enter = {
    register: (req, res) =>{
   
        const {userName, email, password} = req.body
        
        req.body.password = md5(password)
        
        //使用或查询
        userInfo.findOne({$or:[
            {userName},
            {email}
        ]}, (err, data) =>{
     
             // 这里 已经用户名或者 邮箱被使用过了
            if(data){
                if(data.userName === userName) return res.json({"msg": "用户名已经被使用过", "code": 1})
                if(data.email === email) return res.json({"msg": "者邮箱已经被使用过", "code": 0})
            }
     
            //加密 保存
            req.body.password = md5(password)
     
            userInfo.create(req.body, (err, createDate) =>{
     
                 // 插入数据失败
                 if(!createDate) return res.json({"msg": "注册失败，请稍后再试", "code": -1})
     
                 //插入数据成功 提示用户前往激活页面
                 res.json({"msg": "注册成功, 请先激活", "code": 200})
     
            })
        })
    }
}