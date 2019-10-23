
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

/**
 * limit() //限制条数
 * skip() // 跳过条数
 */
router.get('/a_userInfo', (req, res) =>{
    let {page, pageNum} = req.query
    page = parseInt(page)
    pageNum = parseInt(pageNum)

    // 不需要获取总数
    if(page) return userInfo.find({passTag: true}, {password: 0, __v: 0}, (err, fData) =>{
        res.json({"msg": "获取成功", "code": 280, "userData": fData, "total": fData.length})
    }).skip(page*pageNum).limit(pageNum)

    // 获取总数
    userInfo.find({passTag: true}, {password: 0, __v: 0}, (err, fData) =>{
        res.json({"msg": "获取成功", "code": 200, "userData": fData, "total": fData.length})
    })
})


router.post('/a_upInfo', (req, res) =>{
    const {_id, data} = req.body

    // 不需要获取总数
    userInfo.update({_id}, data, (err, uData) =>{
        if(!uData.n) return res.json({"msg": "操作失败", "code": 0})
        res.json({"msg": "操作成功", "code": 200, "userData": uData})
    })

})




module.exports = router