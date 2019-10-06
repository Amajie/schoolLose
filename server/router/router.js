
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
router.post('/reObject', checkToken, upload.array('objectImg', 3), (req, res) =>{

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

//消息的查找
router.get('/fInfo', (req, res) =>{
    const {cheId} = req.query

    if(!mongoose.Types.ObjectId.isValid(cheId)) return res.status(404).json({success: false, msg: '访问的页面不存在'})

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

        console.log(data)
        if(cheId && data[0].infoData.length === 0) return res.json({"msg": "暂无数据", "code": 0, data})

        res.json({"msg": "查找成功", "code": 200, data})
    })
})

router.get('/fDetailInfo', (req, res) =>{
    const {objectId, objectUserId} = req.query

    reInfo.findOne({objectId, objectUserId: mongoose.Types.ObjectId(objectUserId)}, (err, data) =>{

        if(!data) return res.json({"msg": "查找失败", "code": 0})

        res.json({"msg": "查找成功", "code": 200, "detailData": data})

    })

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