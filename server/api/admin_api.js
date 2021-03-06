
const express = require('express')
const md5 = require('md5')


//生成和解析token
const {createToken} = require('../checkToken/jwt.js')

//常量获取
const {TYPE_NAV} = require('../router/CONST.js')

const userInfo = require('../mongodb/userInfo.js')
const reInfo = require('../mongodb/release.js')
const adminInfo = require('../mongodb/admin.js')
const constInfo = require('../mongodb/constant.js')

// 获取审核数据
exports.examineData = {
    // 审核用户
    userData: (req, res) =>{
        const condition = JSON.parse(req.query.condition)
        // 获取总数 前端分页即可
        userInfo.find(condition, {password: 0, __v: 0}, (err, data) =>{
            res.json({"msg": "获取成功", "code": 200, "userData": data, "total": data.length})
        })
    },
    // 审核帖子
    objectData: (req, res) =>{

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
            if(!data) return res.json({"msg": "服务器错误", "code": -1, data: [], "total": 0})

            res.json({"msg": "成功", "code": 200, data, "total": data.length})
        })
    },
    // 用户数据的更新
    updataUser: (req, res) =>{
        const {_id, data, remindInfo, email} = req.body
    
        // 如果密码存在就先 MD5加密
        if(data.password) data.password = md5(data.password)
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
    },
    //帖子数据的更新
    updataObject: (req, res) =>{
        const {objectId, data} = req.body
    
        reInfo.updateMany({objectId}, data, (err, uData) =>{
            if(!uData.n) return res.json({"msg": "操作失败", "code": 0})
            res.json({"msg": "操作成功", "code": 200, "userData": uData})
        })
    
    }
}


// 搜素
exports.searchData = {
    // 搜素用户
    searchUser: (req, res) =>{
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
    }
}

// 管理
exports.manageData = {
    // 普通管理的创建
    createAdmin: (req, res) =>{
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
    },
    // 管理员登陆
    adminLogin: (req, res) =>{
        const {adminName, adminPassword} = req.body
    
        adminInfo.findOne({
            $or:[
                {adminName},
                {adminEmail: adminName}
            ]
        }, (err, data) =>{
            if(!data) return res.json({"msg": "该用户不存在", "code": -1})
            const {adminName, adminEmail, adminGrade, adminTag, _id} = data
    
            if(!adminTag) 
                return res.json({"msg": "账户已被冻结", "code": -2})
    
            if(data.adminPassword != md5(adminPassword))
                return res.json({"msg": "密码错误", "code": 0})
    

                constInfo.find({$or:[
                    {constKey: 'type_nav'},
                    {constKey: 'courtyardData'},
                ]}, (err, constData) =>{

                    // 默认值
                    let constObj = {
                        type_nav:{},
                        courtyardData: []
                    }

                    // 有数据则获取
                    if(constData.length){
                        // 拿取数据
                        constData.forEach(item =>{
                            constObj[item.constKey] = item.constVal
                        })
                    }
                    // 密码正确 获取token
                    const token = createToken({
                        adminEmail, 
                        adminGrade,
                        userId: _id
                    })

                    res.json({
                        "msg": "密码正确，登陆成功", "code": 200, 
                        token, 
                        courtyardData: constObj.courtyardData,
                        type_nav: constObj.type_nav,
                        adminData: {adminName, adminEmail, adminGrade, cheId: _id}
                    })
    
                })
        })
    },
    // 数据的更新
    updataAmin: (req, res) =>{
        let {cPawIpu, adminEmail, upData} = req.body
        // 因为解冻 冻结 是目标的邮箱 这里判断一些是否存在
        if(!adminEmail) adminEmail = req.adminEmail
    
        adminInfo.findOne({adminEmail}, (err, fData) =>{
            //用户不存在
            if(!fData) return res.json({"msg": "用户不存在", "code": 0})
            // 密码输入错误
            if(cPawIpu && (fData.adminPassword != md5(cPawIpu))) return res.json({"msg": "您的密码输入错误", "code": -2})
            // 如果是修改密码 先MD5加密
            if(cPawIpu) upData.adminPassword = md5(upData.adminPassword)
            adminInfo.updateOne({adminEmail}, upData, (err, data) =>{
                //修改失败
                if(!data.n) return res.json({"msg": "修改失败，请稍后再试", "code": -1})
                // 修改成功
                res.json({"msg": "修改成功", "code": 200})
            })
        })
    },
    // 查找 普通管理员的数据
    getAdmin: (req, res) =>{
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
    },
    // 账户销毁
    destroyCount: (req, res) =>{
        if(req.adminGrade != 1) return res.json({"msg": "不能随意访问哟", "code": 500, createCount:[]})
        const {adminEmail} = req.body
        
        adminInfo.deleteOne({adminEmail}, (err, rData) =>{
            
            // 失败
            if(!rData.n) return res.json({"msg": "操作失败，请稍后再试", "code": 0})
            // 成功
            res.json({"msg": "销毁成功", "code": 200})
        })
    }
}

// 学院、分类数据更新
exports.updaData = {
    // 分类数据更新
    upTypeData: (req, res) =>{
        let {type, type_nav, icon_link, edit_key, isEditType} = req.body
        // 图片上传失败 直接返回
        if(!icon_link && !req.file) return res.json({"msg":"更新失败", "code": 0})
    
        type_nav = JSON.parse(type_nav)
    
        if(!isEditType){
            const maxLen = Object.keys(type_nav).length
    
            // 最大值为 99 个分类
            const typeKey = 99 - maxLen
            const typeNavObj = {
                type,
                icon_link: `http://127.0.0.1:7070/t_icon/${req.file.filename}`
            }
            type_nav[typeKey] = typeNavObj
        }else{
            type_nav[edit_key] = {
                type,
                icon_link: !req.file ? icon_link : `http://127.0.0.1:7070/t_icon/${req.file.filename}`
            }
        }
    
        constInfo.updateOne({constKey: 'type_nav'}, {constVal: type_nav}, (err, updata) =>{
            // 失败
            if(!updata.n) return res.json({"msg":"更新失败", "code": 0})
            // 成功
            res.json({"msg":"更新成功", "code": 200, type_nav})
        })
    },
    // 删除分类
    delectTypeData: (req, res) =>{
    
        let {delectKey, type_nav} = req.body
        type_nav = JSON.parse(type_nav)
        delete type_nav[delectKey]
    
        constInfo.updateOne({constKey: 'type_nav'}, {constVal: type_nav}, (err, updata) =>{
            // 失败
            if(!updata.n) return res.json({"msg":"更新失败", "code": 0})
            // 成功
            res.json({"msg":"更新成功", "code": 200, type_nav})
        })
    },
    upCourData : (req, res) =>{
    
        let {courtyardData, upData, courtyardTag} = req.body
    
        // 添加数据
        courtyardData = JSON.parse(courtyardData)
        switch(courtyardTag){
            case 'addC':
                courtyardData.unshift(upData)
                break
            case 'addM':
                courtyardData[upData.index].major.unshift(upData.major)
                break
            case 'editC':
                courtyardData[upData.index].courtyard = upData.newCourtyard
                break
            case 'editM':
                courtyardData[upData.index].major[upData.i] = upData.newMajor
                break
            case 'delectC':
                // 对原数组有影响
                courtyardData.splice(upData.index, 1)
                break
            case 'delectM':
                // 对原数组有影响
                courtyardData[upData.index].major.splice(upData.i, 1)
                break
            default:
                break
        }
    
        // 添加数据
        constInfo.updateOne({constKey: 'courtyardData'}, 
        {constVal: courtyardData}, (err, data) =>{
            //  更新失败
            if(!data.n) return res.json({"msg":"更新失败", "code": 0})
    
            res.json({"msg":"更新失败", "code": 200, courtyardData})
    
        })
    }
}