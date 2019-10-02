
const express = require('express')
const router = express.Router()

const multer = require('multer')
const storage = multer.diskStorage({
     //存储的位置
     destination(req, file, cb){
        cb(null, 'p/av/')
    },
    //文件名字的确定 multer默认帮我们取一个没有扩展名的文件名，因此需要我们自己定义
    filename(req, file, cb){
        const fileName = file.originalname.split('.')[0]
        const fileSuffix = file.originalname.split('.')[1]
        console.log(fileName)
        console.log((fileName + Date.now()).toString(36).slice(-15))
        const path = `${(fileName + Date.now()).toString(36).slice(-15)}.${fileSuffix}`
        cb(null, path)
    }
})

const upload = multer({storage}) 

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

router.post('/reObject', (req, res) =>{
    console.log(req.body)

    res.json({"msg": "哈哈哈", "code": 200})
})



module.exports = router