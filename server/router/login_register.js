
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

const maxAge = 1000*6


/**
* @function 用户注册
*   1 获取 用户的注册 用户名 电子邮件
*   2 查看用户名、电子邮件是否已经被使用过
*       1 有 提示用户换一个用户名 或者邮箱
*       2 没有 密码使用md5加密 再插入注册数据
*   3 注册成功 则提示用户可以跳转页面激活账户
*/


router.post('/register', (req, res) =>{
   
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
})

/**
 * 
 *@function 用户登陆
 *  1 获取 用户的登陆用户名 密码 以及 是否记住密码
 *  2 验证 用户名 或者密码是否正确
 *      1 错误 提示密码错误
 *      2 正确 则看是否记住密码
 *          1 记住密码 设置cookie 用户名 以及加密的 密码 过期时间为 30天   
 *          2 不记住密码 不设置 cookie 用户名 以及密码这些信息
 *      3 返回token
 */
   
router.get('/login', (req, res) =>{
    const {userName, password, remember} = req.query

    userInfo.findOne({$or:[
        {userName},
        {email:userName}
    ]}, (err, data) =>{

        // 用户名 或者 电子邮箱错误错误
        if(!data) return res.json({"msg": "该用户不存在", "code": -1})

        //验证密码是否正确
        if(data.password != md5(password)) return res.json({"msg": "密码错误", "code": 0})

        //密码正确
        res.json({"msg": "密码正确，登陆成功", "code": 200})
    })
})

/**
* @function 获取客户端的邮箱 发送邮箱验证码 
*   1 获取激活的邮箱账户
*   2 查看账户 是否绑定账户 再查看是否已经激活
*   3 查看验证码 是否已经发送
*       1 已经发送 无需再次发送
*       2 没有发送 获取验证码
*   5 验证码插入数据库 并发送邮箱验证码 并设置验证码24小时内有效 在这24小时无需要在发送
*
*
*/
router.get('/sendE', (req, res) =>{
    //获取激活邮箱
    const {email} = req.query

    //查看账户 是否绑定账户 是否已经激活
    userInfo.findOne({email}, (err, data) =>{
        
        // 没有绑定账户
        if(!data) return res.json({"msg": "该邮箱没有绑定任何账户", "code": 0})
        // if(!data) return res.send('无数据')

        
        //为true 说明已经激活 无需在激活
        if(data.userActive) return res.json({"msg": "绑定该邮箱的账户已经激活，无需重复激活", "code": 1})

        //查看验证码是否已经发送
        //获取用户的id
        const checkId = data._id
        emailInfo.findOne({checkId}, (err, findData) =>{

            // 已经发送 且有效 无需再次发送
            if(findData) return res.json({"msg": "该邮箱的验证码已经发送，可查看邮箱获取验证码", "code": 304, checkId})

            // 没有发送或者验证码已经失效 获取验证码
            const checkCode = Math.random().toString().slice(-6)

            /*
            *@function 向数据库插入验证码信息
            *@params checkId 即用户的 id
            *@params checkCode 验证码
            */
            emailInfo.create({limeTime: new Date(), checkCode, checkId, checkTag: CREGISTER}, (err, createDate) =>{
    
                // 插入验证码失败
                if(!createDate) return res.json({"msg": "获取验证码失败，请重新获取", "code": -1})
                //设置定时时间 24小时 因为mongodb 60s查询一下过期文档 因此 删除会有一点延时
                emailInfo.createIndexes(emailSchema.index({limeTime : 1}, {expires:120}),
                    function(err, info){                        
                        
                        console.log(email)
                        //发送邮箱
                        // sendEmail(email) //这里可以走通 但是此时不需要发送邮箱 直接看数据库获取验证码 测试即可
                        //插入数据成功 此时需要返回数据库的 checkId 输入验证码的时候需要带上 查询验证码
                        res.json({"msg": "验证码已经发送，请注意查收", "code": 200, checkCode, checkId})
                })
            })
        })
    })
})

/**
* @function 获取客户端的输入的验证码 查询数据库是否正确
*   1 根据 checkId 获取验证码
*       1 不存在 失效
*       2 存在 验证是否正确
*   2 验证码错误 激活失败 重新输入验证码
*   3 修改用户已经激活状态
*   4 验证码正确 激活成功 （不需要在还是拿出验证码 因为已经激活 时间到了自然会删除）
*/
router.get('/checkE', (req, res) =>{
    const {checkCode, checkId} = req.query

    // 查询验证码
    emailInfo.findOne({checkId}, (err, data) =>{
        // 不存在 提示
        if(!data) return res.json({"msg": "验证码不存在或者已失效，请重新获取", "code": 0})

        // 存在 验证是否正确 重新激活
        if(checkCode != data.checkCode) return res.json({"msg": "验证码错误，请重新输入!", "code": 1})

        // 修改用户为激活状态
        userInfo.updateOne({_id: checkId}, {userActive: true}, (err, upData) =>{
            console.log(upData)
            // 激活失败
            if(upData.nModified <= 0) return res.json({"msg": "激活失败，请重新输入验证码", "code": -1})

            // 验证码正确  并且修改用户为激活状态
            emailInfo.deleteOne({checkId, checkTag: CREGISTER}, (err, deleteData) =>{
                // 激活成功
                res.json({"msg": "验证码正确，激活成功", "code": 200})
            })
        })
    })
})

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

function getEmailCode(to){
    
    // 创建一个邮件对象
    return {
        // 发件人
        from: '车神寻物网<651762920@qq.com>', //昵称<发件人邮箱>
        // 主题
        subject: '激活验证码',
        // 收件人
        to,//收件人邮箱
        // 邮件内容，HTML格式
        text: `您的激活验证码为：${Math.random().toString().slice(-6)}, 请谨慎保管。` //可以是链接，也可以是验证码
    }
}

module.exports = router