
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

/**
 * 这里先用 用户名来查找用户 之后在换成id查找用户
 * 
 */
const userName = '车神-黄杰'
const oldName = userName

/**
 * 
 * @function 修改 用户名
 *  1 判断新输入的用户名是否存在
 *      1 存在 提示 已存在
 *      2 不存在 更新数据
 * 
 */
router.post('/cn', (req, res) =>{

    const {userName} = req.body

    userInfo.findOne({userName}, (err, data) =>{
        //用户名已经存在
        if(data) return res.json({"msg": "用户名已经存在", "code": 0})
        userInfo.updateOne({userName: oldName}, {userName}, (err, upData) =>{
            // 更新失败
            if(upData.nModified <= 0) return res.json({"msg": "修改失败，请稍后再试", "code": -1})
            // 修改成功
            res.json({"msg": "该用户名可以使用", "code": 200})
        })
    })


})


/**
 * 
 * @function 修改 密码
 *  1 判断当前密码输入是否正确
 *      1 错误 提示 提示当前密码输入错误
 *      2 正确 更新数据
 * 
 */
router.post('/cp', (req, res) =>{

   const {password, oldPassword} = req.body
   
   userInfo.findOne({userName}, (err, data) =>{
    //查找用户失败
    if(!data) return res.json({"msg": "用户不存在", "code": 1})
    //验证当前旧密码是否错误
    if(data.password != md5(oldPassword)) return res.json({"msg": "当前密码输入错误", "code": 0})

    userInfo.updateOne({userName}, {password: md5(password)}, (err, upData) =>{
        // 更新失败
        if(upData.nModified <= 0) return res.json({"msg": "修改失败，请稍后再试", "code": -1})
        // 修改成功
        res.json({"msg": "修改密码成功", "code": 200})
    })
})

})

/**
 * 
 * @function 发送修改邮箱验证码
 *  1 修改邮箱 需要密码 修改成功之后 发送通知到旧邮箱即可
 *  2 验证密码是否正确
 *      1 不正确 提示错误
 *      2 正确 更新邮箱数据
 *  
 */
router.post('/ce', (req, res) =>{
    const {email, password} = req.body
    userInfo.findOne({userName}, (err, data) =>{
        //查找用户失败
        if(!data) return res.json({"msg": "用户不存在", "code": 1})
        //验证当前旧密码是否错误
        if(data.password != md5(password)) return res.json({"msg": "密码输入错误", "code": 0})
    
        userInfo.updateOne({userName}, {email}, (err, upData) =>{
            // 更新失败
            if(upData.nModified <= 0) return res.json({"msg": "修改失败，请稍后再试", "code": -1})
            
            // 创建一个邮件对象
            const mail = {
                // 发件人
                from: '车神寻物网<651762920@qq.com>', //昵称<发件人邮箱>
                // 主题
                subject: '邮箱修改',
                // 收件人
                to: data.email,
                // 邮件内容，也可以为HTML格式
                text: `您绑定车神寻物网的账号邮箱已被修改为：${email}，若不是本人所为，请及时登陆修改!` //可以是链接，也可以是验证码
            }

            console.log('发送提示邮箱成功')

            //发送有邮件
            // sendEmail(mail)

            // 修改成功
            res.json({"msg": "修改邮箱成功", "code": 200})
        })
    })
})

/**
 * 
 * @function 修改用户的个人信息
 *  1 每次修改都是 发送全部的数据 (这个不行 因为有数据不变的话 会更新错误)
 *  2 想办法解决
 * 
 */
router.post('/cInfo', (req, res) =>{
    return res.send('哈哈哈')
})


/**
 * @function 验证token
 * 
 */

const jwt = require('jsonwebtoken')
const secre = 'app.get'
let token = ''
router.get('/jwt', (req, res) =>{
    token = jwt.sign({name: '车神-黄杰', age: 23}, secre, {
        expiresIn: 60
    })

    res.send(token)
})

router.get('/jw', (req, res) =>{
    token = jwt.sign({name: '车神', age: 23}, secre, {
        expiresIn: 60
    })

    res.send(token)
})



router.get('/jie', (req, res) =>{

    //返回值为 undefind
    jwt.verify(token, secre, (err, decoded) =>{
        console.log(err)
        console.log(decoded)
        res.send('获取token')
    })

})




/**
 * @function 可以传递多个函数 next() 即可执行下一个函数 并且在req.name 可以设置值
 * 
 */
router.get('/c', (req, res, next) =>{
    const {name} = req.query
    if(!name) return res.send('哈哈哈')
    
    req.name = '车神-黄杰'
    next()

}, (req, res) =>{

    console.log(req.name)

    res.send('乐乐了')
})


module.exports = router