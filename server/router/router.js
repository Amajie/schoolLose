
const express = require('express')
const router = express.Router()
const {FORGET_PASSWORD} = require('./CONST.js')
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

//个人信息表
const userInfo = require('../mongodb/userInfo.js')
//邮箱 验证码信息表
const {emailInfo, emailSchema} = require('../mongodb/email.js')


//路由api
const {enter, cUserInfo, meList, centerData, homeData} = require('../api/api.js')
//生成和解析token
const {checkToken} = require('../checkToken/jwt.js')

// 注册、登陆、发送激活验证码、验证验证码是否正确
router.post('/register', enter.register)
router.get('/login', enter.login)
router.get('/send_forget_e', enter.sendForgetPassword)
router.get('/send_active_e', enter.sendActiveE)
router.get('/checkE', enter.checkE)


//用户信息的修改
router.post('/cn', checkToken, cUserInfo.cUserName)
router.post('/cp', checkToken, cUserInfo.cUserPassword)
router.post('/ce', checkToken, cUserInfo.cUserEmail)
router.post('/ci', checkToken, upload.array('uCredePic', 2), cUserInfo.cUserInfo)

router.post('/check_authory', checkToken, cUserInfo.checkAuthory)


// -----------------------------------------------我的 路由管理
//头像的上传
router.post('/upAvatar', checkToken, upload.single("avater"), meList.upAvatar)
//个人中心 消息的查找
router.get('/fInfo', checkToken, meList.fCenterData)
// 关注他人
router.post('/concren', checkToken, meList.concren)
// 关注人信息的查找
router.get('/get_concren', checkToken, meList.getConcren)
// 收藏帖子
router.post('/collection', checkToken, meList.collection)
// 收藏信息的查找
router.get('/get_collection', checkToken, meList.getCollection)
// 留言的插入
router.post('/insertCommit', checkToken, meList.insertCommit)
// 留言信息的查找
router.get('/f_my_commit', checkToken, meList.getCommit)
// 留言删除 
router.get('/d_my_commit', checkToken, meList.dMyCommit)
// -----------------------------------------------我的 路由管理

// -----------------------------------------------个人中心 路由管理
// 详情页的查找
router.get('/get_detail', checkToken, centerData.getDetail)
// 留言的查询
router.get('/get_object_commit', checkToken, centerData.getObjectCommit)
//数据的发布
router.post('/insert_object', checkToken, upload.array('objectPic', 3), centerData.insertObject)
// 数据的编辑
router.post('/edit_object', checkToken, upload.array('objectPic', 3), centerData.editObject)
// 数据的删除 其实没有删除
router.get('/de_object', checkToken, centerData.delectObject)
// 获取个人信息是否通过审核
router.get('/get_authory', checkToken, centerData.getAuthoryTag)
// -----------------------------------------------个人中心 路由管理


// -----------------------------------------------首页 路由管理
// 首页数据显示查找
router.get('/get_home_data', checkToken, homeData.getHomeData)
// 搜素数据的查找
router.get('/search_object', checkToken, homeData.searchObject)
// -----------------------------------------------首页 路由管理


/**
 * @function 比较两个字符串的相似度
 * @param {*} source 源字符串
 * @param {*} target 目标字符串
 * 源字符串 与 目标字符串相同字符的个数 / 字符串最长的长度
 */
function similarStr(source, target){

    //如果其中有一个为 空 相似度为 0
    if(!source || !target) return
    
    //比较字符串长度 获取字符串最长的长度
    // 这里不先去重 在获取了
    let maxLen = source.length > target.length ? source.length : target.length
    
    source = DRemoval(source)
    target = DRemoval(target)

    let count = 0
    

    for(let i = 0; i< source.length; i++){
        if(target.indexOf(source[i]) != -1) 
            count++
    }

    return count/maxLen
}

/**
 * @function 字符串去重
 * @param {*} target 目标字符串
 */
function DRemoval(target){
    let newStr = ''
    for(let i=0; i< target.length; i++){
        if(newStr.indexOf(target[i])=== -1){
            newStr = newStr + target[i]
        }
    }
    return newStr;
}



module.exports = router