
const express = require('express')
const router = express.Router()

const sendEmail = require('../nodemailer/nodemailer.js')

//数据库信息
const userInfo = require('../mongodb/userInfo.js')

const emailInfo = require('../mongodb/email.js').emailInfo
const emailSchema = require('../mongodb/email.js').emailSchema

const {CREGISTER} = require('./CONST.js')


//---------------------------------------------------------->

router.post('/register', (req, res) =>{
    /*
        1 一个邮箱只能 注册一个账户 因此需要判断 邮箱是否使用过
        2 用户名是否存在 图形验证码(后期在做这是前端验证的)
        http://localhost:7070/register?userName=ches&email=651762920&userType=%E7%94%B7&password=123456
    */
   const {userName, email} = req.body
   //使用或查询
   userInfo.findOne({$or:[
       {userName},
       {email}
   ]}, (err, data) =>{

        // 这里 已经用户名或者 邮箱被使用过了
       if(data) return res.json({"msg": "用户名或者邮箱已经被使用过", "code": 0})

       userInfo.create(req.body, (err, createDate) =>{

            /*
               注册
                1、插入数据
                2、跳转到激活页面
                3、编辑验证码，发送验证码
                4、用户激活 返回token
                5、进入首页
            */

            // 插入数据失败
            if(!createDate) return res.json({"msg": "注册失败，请稍后再试", "code": -1})

            //插入数据成功 提示用户前往激活页面
            res.json({"msg": "注册成功, 请先激活", "code": 200})

       })
   })
})
   
   
router.get('/login', (req, res) =>{

})

/*
* @function 获取客户端的邮箱 发送邮箱验证码 
*   1 获取激活的邮箱账户
*   2 查看账户 是否绑定账户 再查看是否已经激活
*   3 获取验证码
*   4 验证码插入数据库 并发送邮箱验证码 并设置验证码24小时内有效 在这24小时无需要在发送
*
*
*/
router.get('/sendE', (req, res) =>{
    //获取激活邮箱
    const {email} = req.query
    console.log(email)
    //查看账户 是否绑定账户 是否已经激活
    userInfo.findOne({email}, (err, data) =>{
 
         // 没有绑定账户
        // if(!data) return res.json({"msg": "该邮箱没有绑定任何账户", "code": 0})
        if(!data) return res.send('无数据')

        //为true 说明已经激活 无需在激活
        if(data.userActive) return res.json({"msg": "绑定该邮箱的账户已经激活，无需重复激活", "code": 1})

        //获取验证码
        const checkCode = Math.random().toString().slice(-6)

        /*
        *@function 向数据库插入验证码信息
        *@params userId 即用户的 id
        *@params checkCode 验证码
        */
        emailInfo.create({limeTime: new Date(), checkCode, userId: data._id, checkTag: CREGISTER}, (err, createDate) =>{
 
            // 插入验证码失败
            if(!createDate) return res.json({"msg": "获取验证码失败，请重新获取", "code": -1})
             //设置定时时间 24小时 因为mongodb 60s查询一下过期文档 因此 删除会有一点延时
            emailInfo.createIndexes(emailSchema.index({limeTime : 1}, {expires:60}),
                function(err, info){
                    
                    // 创建一个邮件对象
                    const mail = {
                        // 发件人
                        from: '车神寻物网<651762920@qq.com>', //昵称<发件人邮箱>
                        // 主题
                        subject: '激活验证码',
                        // 收件人
                        to:email,//收件人邮箱
                        // 邮件内容，HTML格式
                        text: `您的激活验证码为：${checkCode}, 请24小时内有效，请谨慎保管。` //可以是链接，也可以是验证码
                    }

                    //发送邮箱
                    sendEmail(mail)
                    //插入数据成功 此时需要返回数据库的 userId 输入验证码的时候需要带上 查询验证码
                    // res.json({"msg": "注册成功, 请先激活", "code": 200})
                    res.send('60s')//完成搞定
            })
        })
    })
})


/*
* @function 获取客户端的输入的验证码 查询数据库是否正确
*   1 根据 userId 获取验证码
*       1 不存在 失效
*       2 存在 验证是否正确
*   2 验证码错误 激活失败 重新输入验证码
*   3 验证码正确 激活成功 删除验证码
*/
router.get('/checkE', (req, res) =>{
    const {checkCode, userId} = req.query
    //查询验证码
    emailInfo.findOne({userId}, (err, data) =>{
        //不存在 提示
        if(!data) return res.json({"msg": "验证码不存在或者已失效，请重新获取", "code": 0})
        
        //存在 验证是否正确
        if(checkCode != data.checkCode) return res.json({"msg": "验证码错误", "code": 1})

        // 验证码正确 激活成功 删除验证码
        emailInfo.remove({userId, checkTag: CREGISTER}, (err, removeData) =>{

        })
        res.json({"msg": "验证码正确，激活成功", "code": 200})
    })
})


router.get('/hjj', (req, res) =>{
    emailInfo.create({limeTime: new Date(), checkCode: 'sadhasd', userId: 'hasks', checkTag: CREGISTER}, (err, createDate) =>{
 
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
    emailInfo.deleteOne({checkTag: CREGISTER}, (err, removeData) =>{
        console.log(removeData)
        res.send('删除')
    })
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