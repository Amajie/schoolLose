
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const http = require('http')

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
const {checkToken} = require('../checkToken/jwt.js')

const userInfo = require('../mongodb/userInfo.js')
const reInfo = require('../mongodb/release.js')
const commitInfo = require('../mongodb/commit.js')

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

//头像的上传
router.post('/upAvatar', checkToken, upload.single("avater"), (req, res) =>{

    if(req.file.filename) {
        const avater = `http://192.168.43.124:7070/av/${req.file.filename}`
        userInfo.updateOne({_id: req.userId}, {avater}, (err, data) =>{
            if(data.n <= 0) return res.json({"msg": "上传失败", "code": 0})
            
            res.json({"msg": "上传成功", "code": 200, avater})
        })
    }
})


/**
 * @function 这里是插入发布消息的数据
 *  1 首先获取一个唯一的id 标志着该消息
 *  2 插入数据
 *  3 返回 提示
 */
router.post('/reObject', checkToken, upload.array('objectPic', 3), (req, res) =>{

    let objectImg = null
    // 如果有值 上传图片则
    if(req.files.length){
        objectImg = req.files.map(item =>{
            return `http://192.168.43.124:7070/av/${item.filename}`
        })
    //否则显示默认图片
    }else{
        objectImg = ['http://192.168.43.124:7070/av/init.png']
    }

    reInfo.create({
        ...req.body, 
        objectId: getId(), //可以直接获取 不需要定义一个函数
        objectUserId: mongoose.Types.ObjectId(req.userId), //与用户信息表的userId相同
        objectImg
    },(err, upData) =>{
        if(!upData) return res.json({"msg": "发布失败", "code": 0})
        
        //此时返回数据
        res.json({"msg": "发布成功", "code": 200})
    })
})

/**
 * @function 这里是发布消息的更新
 */
router.post('/upObject', checkToken, upload.array('objectPic', 3), (req, res) =>{

    // 因为是数组 因此也不需要在重新设置
    let objectImg = JSON.parse(req.body.objectImg)
    let objectId = req.body.objectId

    // 此时删除这个消息 也可以不用删除 数据一样其他也会更新
    // delete req.body.objectId

    // 如果有值 上传图片则
    if(req.files.length){
        req.files.map(item =>{
            objectImg.push(`http://192.168.43.124:7070/av/${item.filename}`)
        })
    // 此时只能说 用户删除了所有的图片 显示默认的图片
    }else if(!objectImg.length){
        objectImg = ['http://192.168.43.124:7070/av/init.png']
    }

    //消息的 id不用在此获取上传过来
    reInfo.updateOne({
        objectUserId: mongoose.Types.ObjectId(req.userId),
        objectId
    },{...req.body, objectImg}, (err, upData) =>{
        console.log(upData)
        
        //此时返回数据
        res.json({"msg": "发布成功", "code": 200})
    })
})
/**
 * @function 这里是发布消息的删除
 *          其实就是把字段 objectDelect 设置为 1
 */
router.get('/deObject', checkToken, (req, res) =>{
    const {objectId} = req.query


    //消息的 id不用在此获取上传过来
    reInfo.updateOne({
        objectUserId: mongoose.Types.ObjectId(req.userId),
        objectId,
    },
    {objectDelect: '1'}, (err, upData) =>{
       
        if(!upData.n) return res.json({"msg": "删除失败", "code": 0})
        //此时返回数据
        res.json({"msg": "发布成功", "code": 200})
    })
})

//个人中心 消息的查找
router.get('/fInfo', (req, res) =>{
    const {cheId} = req.query

    if(!cheId || (cheId && !mongoose.Types.ObjectId.isValid(cheId)))
        return res.status(404).json({success: false, msg: '访问的页面不存在'})
        

    userInfo.aggregate([
        {
            $lookup:{
                from: 'releases',
                localField: '_id',
                foreignField: 'objectUserId',
                as: 'infoData'
            }
        },
        {
            $match:{"_id": mongoose.Types.ObjectId(cheId)}
        },
        {$project:{
            cheId:"$_id",
            userName: "$userName",
            email: "$email",
            userType: "$userType",
            avater: "$avater",
            userActive: "$userActive",
            otherConcern: "$otherConcern",
            name: "$name",
            stId: "$stId",
            gender: "$gender",
            courtyard: "$courtyard",
            major: "$major",
            classes: "$classes",
            address: "$address",
            infoData: "$infoData",
            _id: "$__v"
        }}
    ], (err, data) =>{

        if(cheId && data[0].infoData.length === 0) return res.json({"msg": "暂无数据", "code": 0, data})

        data[0].infoData = data[0].infoData.filter(item => item.objectDelect === '0')

        console.log(data)

        res.json({"msg": "查找成功", "code": 200, data})
    })
})


//首页 消息的查找
router.get('/home_f_info', (req, res) =>{
    reInfo.aggregate([
        {
            $lookup:{
                from: 'users',
                localField: 'objectUserId',
                foreignField: '_id',
                as: 'infoData'
            }
        },
        { $unwind: "$infoData"},
        {$project:{
            objectId:"$objectId",
            objectDesc:"$objectDesc",
            objectName:"$objectName",
            objectAddress:"$objectAddress",
            sendTime:"$sendTime",
            objectId:"$objectId",
            objectType:"$objectType",
            objectWay:"$objectWay",
            objectImg:"$objectImg",
            userName:"$infoData.userName",
            cheId:"$infoData._id"
        }}
    ], (err, data) =>{
        console.log(data)
        res.json({"msg": "查找成功", "code": 200, homeData: data})
    })
})


// 详情页的查找
router.get('/fDetailInfo', (req, res) =>{
    // 此时需要判断以下 这个userId是否符合情况
    const {objectId, objectUserId} = req.query

    reInfo.findOne({
        objectId, 
        objectDelect: '0',
        objectUserId: mongoose.Types.ObjectId(objectUserId)
    }, (err, data) =>{
        if(!data) return res.json({"msg": "查找失败", "code": 0})

        res.json({"msg": "查找成功", "code": 200, "detailData": data})

    })

})

// 留言的插入
router.post('/rCommit', (req, res) =>{
    console.log(req.body)
    let {toId, fromId} = req.body
    if(toId){
        toId = mongoose.Types.ObjectId(toId)
    }

    commitInfo.create({
        ...req.body,
        toId,
        fromId: mongoose.Types.ObjectId(fromId)
    }, (err, data) =>{
        if(!data) return res.json({"msg": "留言失败", "code": 0})
        
        res.json({"msg":"留言成功", "code": 200, "commitData": data})
    })
})
// 留言的查询
router.get('/fCommit', (req, res) =>{
    //这里 要根据这个 数据
    const {infoId} = req.query
    console.log(infoId)
    commitInfo.aggregate([
        {
            $lookup:{
                from: 'users',
                localField: 'fromId',
                foreignField: '_id',
                as: 'commitData'
            }
        },
        {
            $lookup:{
                from: 'users',
                localField: 'toId',
                foreignField: '_id',
                as: 'replayData'
            }
        },
        {$match:{infoId}},
        { $unwind: "$commitData" }
    ], function(err, data){

        if(!data) return res.json({"msg": "获取评论失败", "code": -1})

        if(data.length === 0) return res.json({"msg": "暂无评论", "code": 0})

        const commitData = data.map((item, index, array) =>{
            const {fromId, toId, commit, commitTime, commitData, replayData} = item

            const replayUserInfo = replayData[0]
            let arrData = {}
            arrData.fromId = fromId
            arrData.toId = toId
            arrData.commit = commit
            arrData.commitTime = commitTime

            // 评论人的信息 评论人的信息 id不需要了 与上面的fromId 和 toId相同
            // arrData.fromCheId = commitData._id
            arrData.fromUserName = commitData.userName
            arrData.fromAvater = commitData.avater
            // arrData.toCheId = ''
            arrData.toUserName = ''
            arrData.toAvater = ''
            // 没值直接返回
            if(!replayUserInfo) return arrData

            //否则返回数据
            return {
                ...arrData, 
                // toCheId: replayUserInfo._id,
                toUserName: replayUserInfo.userName,
                toAvater: replayUserInfo.avater,
            }
        })

        res.json({"msg": "获取评论成功", "code": 200, commitData})
    })

})


const hjInfo = require('../mongodb/hj.js')
router.get('/hj', (req, res) =>{
    console.log(req.query)
    hjInfo.create({name: 'hjj', array:[{name: '车神1', age: 53}]}, (err, data) =>{
        res.send('插入成功')
    })
})

router.get('/hjj', (req, res) =>{
    hjInfo.update({'array.name': '我是黄杰', 'array.age': 23}, {$set:{'array.$.name': '黄家驹'}}, (err, data) =>{
        console.log(data)
    })
})
router.get('/hjjj', (req, res) =>{
    const s = hjInfo.find({})
    console.log(s)
})

//消息的查找
//http://192.168.43.124:7070/f
router.get('/f', (req, res) =>{
    userInfo.aggregate([
        {
            $lookup:{
                from: 'releases',
                localField: '_id',
                foreignField: 'objectUserId',
                as: 'infoData'
            }
        },
        {$project:{
            cheId:"$_id",
            userName: "$userName",
            email: "$email",
            userType: "$userType",
            avater: "$avater",
            userActive: "$userActive",
            name: "$name",
            stId: "$stId",
            gender: "$gender",
            courtyard: "$courtyard",
            major: "$major",
            classes: "$classes",
            address: "$address",
            infoData: "$infoData",
            _id: "$__v"
        }}
    ], function(err, data){
       res.json
    })
})


function getId(){
    return (Math.random() + Date.now()).toString(36)
}


module.exports = router