
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const md5 = require('md5')

const multer = require('multer')
const storage = multer.diskStorage({
    //存储的位置
    destination(req, file, cb){
        cb(null, 'p/av/')
    },
    //文件名字的确定 multer默认帮我们取一个没有扩展名的文件名，因此需要我们自己定义
    filename(req, file, cb){
        let endFile = ''
        if(file.mimetype === 'image/png'){
            endFile = '.png'
        }else if(file.mimetype === 'image/jpeg'){
            endFile = '.jpg'
        }else if(file.mimetype === 'image/bmp'){
            endFile = '.bmp'
        }
        
        const path = `${file.fieldname + Date.now() + endFile}`

        cb(null, path)
    }
})

const upload = multer({storage}) 

//路由api
const {enter, cUserInfo} = require('../api/api.js')
//生成和解析token
const {checkToken, createToken} = require('../checkToken/jwt.js')

//邮箱验证码的类型
const {COURTYARDDATA, TYPE_NAV} = require('./CONST.js')

const userInfo = require('../mongodb/userInfo.js')
const reInfo = require('../mongodb/release.js')
const adminInfo = require('../mongodb/admin.js')
const commitInfo = require('../mongodb/commit.js')

//生成和解析token


/**
 * limit() //限制条数
 * skip() // 跳过条数
 */
router.get('/a_userInfo', (req, res) =>{
    const condition = JSON.parse(req.query.condition)
    // 获取总数 前端分页即可
    userInfo.find(condition, {password: 0, __v: 0}, (err, data) =>{
        res.json({"msg": "获取成功", "code": 200, "userData": data, "total": data.length})
    })
})

// 用户的搜素
router.get('/a_searchUser', (req, res) =>{
    const {searchWord} = req.query
    console.log(searchWord)
    userInfo.findOne({
        $or:[
            {userName: searchWord},
            {stId: searchWord},
            {name: searchWord},
            {email: searchWord}
        ]
    }, {password: 0, __v: 0}, (err, data) =>{
        console.log(data)
        if(!data) return res.json({"msg": "没有该用户", "code": 0, "searchUData": null})
        res.json({"msg": "获取成功", "code": 200, "searchUData": data})
    })
})


//更新用户的信息
router.post('/a_upUInfo', (req, res) =>{
    const {_id, data, remindInfo, email} = req.body

    // 如果密码存在就先 MD5加密
    console.log(data.password)
    if(data.password) data.password = md5(data.password)
    console.log(data.password)
    // 不需要获取总数
    userInfo.updateOne({_id}, data, (err, uData) =>{
        if(!uData.n) return res.json({"msg": "操作失败", "code": 0})

        // 如果有邮箱即为发送邮箱
        if(email){
            let text = '您的身份信息已经通过审核，感谢您的配合，快快去看看吧!'
            if(remindInfo) text = `您的身份信息未能通过审核！请按照正确的要求完善信息。原因：${remindInfo}` 
            // 创建一个邮件对象
            const mail = {
                // 发件人
                from: '车神寻物网<651762920@qq.com>', //昵称<发件人邮箱>
                // 主题
                subject: '身份信息验证',
                // 收件人
                to: email,
                // 邮件内容，也可以为HTML格式
                text
            }
            console.log(mail)
            //发送邮箱
            // sendEmail(mail) //这里可以走通 但是此时不需要发送邮箱 直接看数据库获取验证码 测试即可
        }
        res.json({"msg": "操作成功", "code": 200})
    })
})


// 审核帖子的查找
router.get('/a_fInfo', (req, res) =>{

    const {cheId, objectPassTag, objectStepTag} = req.query
        
    reInfo.aggregate([
        {
            $lookup:{
                from: 'users',
                localField: 'objectUserId',
                foreignField: '_id',
                as: 'userData'
            }
        },
        // 此时要根据 这个来排序
        {$sort:{sendTime: -1}},
        {$match: {
            "objectDelect": true,
            "objectStepTag": 1
        }},
        { $unwind: "$userData"},
        {$project:{
            objectId:"$objectId",
            objectDesc:"$objectDesc",
            objectName:"$objectName",
            objectAddress:"$objectAddress",
            sendTime:"$sendTime",
            objectTime:"$objectTime",
            objectPassTag:"$objectPassTag",
            objectStepTag:"$objectStepTag",
            objectId:"$objectId",
            objectTypeId:"$objectTypeId",
            objectWay:"$objectWay",
            objectImg:"$objectImg",
            userName:"$userData.userName",
            avater:"$userData.avater",
            cheId:"$userData._id",
            freezeTag:"$userData.freezeTag",
        }},
        {$match: {
            "freezeTag": true
        }},
    ], (err, data) =>{
        console.log(data)
        res.json({"msg": "成功", "code": 200, data, "total": data.length})
    })
})

//帖子的信息的更新
router.post('/a_upOInfo', (req, res) =>{
    const {objectId, data} = req.body

    reInfo.updateMany({objectId}, data, (err, uData) =>{
        if(!uData.n) return res.json({"msg": "操作失败", "code": 0})
        res.json({"msg": "操作成功", "code": 200, "userData": uData})
    })

})


//帖子的信息的更新
router.post('/a_upOssInfo', (req, res) =>{
    const {objectId, objectUserId, data} = req.body
    // 默认 单个操作 如果传入id即为操作全部的
    let op = {objectId}
    // 只有 符合mongodb的id形式才可以
    if(objectUserId && mongoose.Types.ObjectId.isValid(objectUserId)){
        op = {objectUserId: mongoose.Types.ObjectId(objectUserId)}
    }
    // 不需要获取总数
    reInfo.updateMany(op, data, (err, uData) =>{
        if(!uData.n) return res.json({"msg": "操作失败", "code": 0})
        res.json({"msg": "操作成功", "code": 200, "userData": uData})
    })

})

// 用户的创建
router.post('/c_admin', (req, res) =>{
    const {adminEmail, adminPassword} = req.body

    adminInfo.findOne({adminEmail}, (err, data) =>{
        if(data) return res.json({"msg": "邮箱已经存在", "code": 0})
        adminInfo.create({
            adminPassword: md5(adminPassword),
            adminEmail,
            adminGrade: 2,
        }, (err, data) =>{
            if(!data) return res.json({"msg": "创建失败", "code": -1})
            const {adminEmail, adminGrade, adminTag} = data
            res.json({
                "msg": "创建成功", 
                "code": 200, 
                createData: {adminEmail, adminGrade, adminTag}
            })
        })
    })
})

// 管理员登陆
router.post('/l_admin', (req, res) =>{
    const {adminName, adminPassword} = req.body

    adminInfo.findOne({
        $or:[
            {adminName},
            {adminEmail: adminName}
        ]
    }, (err, data) =>{
        if(!data) return res.json({"msg": "该用户不存在", "code": -1})
        const {adminName, adminEmail, adminGrade, adminTag} = data

        if(!adminTag) 
            return res.json({"msg": "账户已被冻结", "code": -2})

        if(data.adminPassword != md5(adminPassword))
            return res.json({"msg": "密码错误", "code": 0})

        // 密码正确 获取token
        const token = createToken({
            adminEmail, 
            adminGrade
        })

        res.json({
            "msg": "密码正确，登陆成功", "code": 200, 
            token, 
            type_nav: TYPE_NAV,
            adminData: {adminName, adminEmail, adminGrade}
        })
    })
})

// 管理员数据的更新
router.post('/up_admin', checkToken, (req, res) =>{
    let {cPawIpu, adminEmail, upData} = req.body
    // 因为解冻 冻结 是目标的邮箱 这里判断一些是否存在
    if(!adminEmail) adminEmail = req.adminEmail

    adminInfo.findOne({adminEmail}, (err, fData) =>{
        //用户不存在
        if(!fData) return res.json({"msg": "用户不存在", "code": 0})
        // 密码输入错误
        if(cPawIpu && (fData.adminPassword != md5(cPawIpu))) return res.json({"msg": "您的密码输入错误", "code": -2})
        adminInfo.updateOne({adminEmail}, upData, (err, data) =>{
            //修改失败
            if(!data.n) return res.json({"msg": "修改失败，请稍后再试", "code": -1})
            // 修改成功
            res.json({"msg": "修改成功", "code": 200})
        })
    })
})

// 高级管理员查找用户
router.get('/f_adminCount', checkToken, (req, res) =>{
    if(req.adminGrade != 1) return res.json({"msg": "不能随意访问哟", "code": 500, createCount:[]})
    adminInfo.find({adminGrade: 2},{
        _id: 0,
        adminName: 0,
        adminPassword: 0,
        __v: 0
    }, (err, createCount) =>{

        // 没有数据
        if(!createCount.length) return res.json({"msg": "没有创建账户", "code": 0, createCount})
        // 有数据
        res.json({"msg": "查找成功", "code": 200, createCount})
    })
})


// 高级管理员销毁账户
router.post('/a_destroycount', checkToken, (req, res) =>{
    if(req.adminGrade != 1) return res.json({"msg": "不能随意访问哟", "code": 500, createCount:[]})
    const {adminEmail} = req.body
    
    adminInfo.deleteOne({adminEmail}, (err, rData) =>{
        
        // 失败
        if(!rData.n) return res.json({"msg": "操作失败，请稍后再试", "code": 0})
        // 成功
        res.json({"msg": "销毁成功", "code": 200})
    })
})



router.get('/m_admin', (req, res) =>{

    adminInfo.create({
        adminName: '前端车神',
        adminPassword: md5('D9C4ABFDC1201ED3E5C54076701CCAEE'),
        adminEmail: '651762920@qq.com',
        adminGrade: 1,
        adminTag: true
    }, (err, data) =>{
        console.log(data)
        res.json({data})
    })
})


module.exports = router