
const express = require('express')
const router = express.Router()
const md5 = require('md5')

const multer = require('multer')

const storage = multer.diskStorage({
    //存储的位置
    destination(req, file, cb){
        cb(null, `p/${file.fieldname}/`)
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

//生成和解析token
const {checkToken} = require('../checkToken/jwt.js')

const {examineData, searchData, manageData, updaData} = require('../api/admin_api.js')

const adminInfo = require('../mongodb/admin.js')


// 用户的审核
router.get('/examine_user', checkToken, examineData.userData)
// 更新用户数据
router.post('/updata_user', checkToken, examineData.updataUser)
// 帖子的审核
router.get('/examine_object', checkToken, examineData.objectData)
// 更新帖子数据
//帖子的信息的更新
router.post('/updata_object', checkToken, examineData.updataObject)

//数据的搜素
// 搜素用户
router.get('/search_user', checkToken, searchData.searchUser)
// 搜索帖子 与客户端接口一样

// 管理
// 高级管理员创建账号
router.post('/create_admin', checkToken, manageData.createAdmin)
// 管理员数据更新
router.post('/updata_admin', checkToken, manageData.updataAmin)
// 高级管理员查找普通管理员
// 高级管理员查找用户
router.get('/get_admin', checkToken, manageData.getAdmin)
// 账号销毁
router.post('/destroy_count', checkToken, manageData.destroyCount)
// 管理员登陆
router.post('/admin_login', manageData.adminLogin)





// 更新数据
router.post('/up_type_data', checkToken, upload.single("t_icon"), updaData.upTypeData)

// 删除数据
router.post('/delect_type_data', checkToken, updaData.delectTypeData)

// 添加学院
router.post('/up_cour_data', checkToken, updaData.upCourData)



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