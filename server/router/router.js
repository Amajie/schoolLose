
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

// 关注用户
router.post('/concren', checkToken, (req, res) =>{
    const {concrenId, concrenTag} = req.body
    
    // true 关注 false 取消关注
    let op = JSON.parse(concrenTag) ?{$push:{'myConcern': concrenId}} : {$pull:{'myConcern': concrenId}}

    userInfo.updateOne({_id: req.userId}, op, (err, data) =>{
        if(!data.n) return res.json({"msg": "关注失败", "code": 0})
        res.json({"msg": "关注成功", "code": 200})
    })
})

// 关注人信息的查找
router.get('/get_concren', (req, res) =>{
    const {concrenList} = req.query
    /**
     * 循环遍历 关注列表 数组包裹，每一条数据即为{_d: 5da3075072a90339f44cdf1a}
     */

     const orArr = JSON.parse(concrenList).map(item => {
         return {_id: item}
     })

    userInfo.find({$or: orArr},{

    }, (err, data) =>{
        console.log(data)
        const concrenData = data.map(item =>{
            return {
                userName: item.userName,
                avater: item.avater,
                cheId: item._id,
            }
        })

        res.json({"msg": "获取成功", "code": 200, concrenData})
    })
})


router.post('/collection', checkToken, (req, res) =>{
    const {collectionId, collectionTag} = req.body
    
    // true 关注 false 取消关注
    let op = JSON.parse(collectionTag) ?{$push:{'otherConcern': collectionId}} : {$pull:{'otherConcern': collectionId}}

    userInfo.updateOne({_id: req.userId}, {otherConcern}, (err, data) =>{
        if(!data.n) return res.json({"msg": "关注失败", "code": 0})
        res.json({"msg": "关注成功", "code": 200})
    })
})

router.post('/mCollection', checkToken, (req, res) =>{

    const {otherConcern} = req.body

    userInfo.update({_id: '5da68019edd6263de477e2e4'}, {otherConcern}, (err, data) =>{
        if(!data.n) return res.json({"msg": "取消失败", "code": 0})
        res.json({"msg": "取消成功", "code": 200})
    })
})

// 收藏信息的查找
router.get('/get_collection', (req, res) =>{
    const collectionList = JSON.parse(req.query.collectionList)
    const orArr = collectionList.map(item => {
        return {objectId: item}
    })

    reInfo.find({$or: orArr}, (err, reData) =>{
        console.log(reData)
        let arr = []
        let userArr = []
        let reArr = []

        // 先排序
        const newReData = collectionList.map((key, index) =>{

            const i = reData.findIndex(item =>{

                return key === item.objectId.toString()
            })
            return reData[i]

        })
      
        newReData.filter(item => {
            let id = item.objectUserId.toString()
            const i = arr.indexOf(id)
            if(i === -1){
                arr.push(id)
                userArr.push({_id: item.objectUserId})
                reArr[reArr.length] = [item]
            }else{
                reArr[i].push(item)
            }
        })

        userInfo.find({$or: userArr}, (err, userData) =>{

            // 此时这里先要排序
            const newUserData = userArr.map((key, index) =>{

                const i = userData.findIndex(item =>{
                    return key._id.toString() === item._id.toString()
                })
                return userData[i]
    
            })

            const collectionData = newUserData.map((item, index) => {
                const obj = {}
                obj.userName = item.userName
                obj.avater = item.avater
                obj.cheId = item.avater
                obj.objectData = reArr[index]
                return obj
            })

            res.json({"msg": "获取成功", "code": 200, collectionData})
        })

    })

})


router.get('/c', checkToken, (req, res) =>{
    
    // true 关注 false 取消关注

    userInfo.updateOne({_id: '5da3075072a90339f44cdf1a'}, {$push:{'otherConcern': ''}}, (err, data) =>{
        if(!data.n) return res.json({"msg": "关注失败", "code": 0})
        res.json({"msg": "关注成功", "code": 200})
    })
})


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
        {
            $match:{
                "objectUserId": mongoose.Types.ObjectId(cheId),
                "objectDelect": "0"
            }
        },
        { $unwind: "$userData"},
        {$project:{
            objectId:"$objectId",
            objectDesc:"$objectDesc",
            objectName:"$objectName",
            objectAddress:"$objectAddress",
            sendTime:"$sendTime",
            objectId:"$objectId",
            objectTypeId:"$objectTypeId",
            objectWay:"$objectWay",
            objectImg:"$objectImg",
            userName:"$userData.userName",
            avater:"$userData.avater",
            cheId:"$userData._id"
        }}
    ], (err, data) =>{
        console.log(data)

        // 存在数据
        if(data.length != 0) return res.json({"msg": "查找成功", "code": 200, data})     
        
        //不存在数据
        userInfo.findOne({_id: cheId}, (err, fData) =>{
            
            // 用户名 或者 电子邮箱错误错误
            if(!fData) return res.status(404).json({"msg": "404页面", "code": -1})


            res.json({
                "msg": "没有数据", "code": 1, 
                userInfo: {
                    userName: fData.userName,
                    avater: fData.avater
                }
            })
        })
    })
})

router.get('/fInddfo', (req, res) =>{
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

        // 这里 必须要的 因为 objectDelect是隐藏在
        // infoData数组里面 因此这里需要过滤 一下
        data[0].infoData = data[0].infoData.filter(item => item.objectDelect === '0')

        // console.log( 1< data[0].infoData[0].sendTime)

        res.json({"msg": "查找成功", "code": 200, data})
    })
})


//首页 消息的查找
router.get('/home_f_info', (req, res) =>{
    let {pageNum, page} = req.query

    // 因为是字符串
    pageNum = parseInt(pageNum)
    page = parseInt(page)
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
        {$skip : pageNum*page},
        {$limit: pageNum},
        { $unwind: "$userData"},
        {$project:{
            objectId:"$objectId",
            objectDesc:"$objectDesc",
            objectName:"$objectName",
            objectAddress:"$objectAddress",
            sendTime:"$sendTime",
            objectId:"$objectId",
            objectTypeId:"$objectTypeId",
            objectWay:"$objectWay",
            objectImg:"$objectImg",
            userName:"$userData.userName",
            cheId:"$userData._id"
        }}
    ], (err, data) =>{
        if(!data.length) return res.json({"msg": "查找成功", "code": 0, homeData: data})
        res.json({"msg": "查找成功", "code": 200, homeData: data})
    })
})

//搜素 消息的查找
router.get('/search_f_info', (req, res) =>{
    // target 用户搜索关键字
    let {target, page, pageNum, upDownTag} = req.query
    page = parseInt(page)
    pageNum = parseInt(pageNum)

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
        {$sort:{sendTime: parseInt(upDownTag)}},
        // 可以根据查询
        {"$match": getMatch(req.query)},
        { $unwind: "$userData"},
        {$project:{
            objectId:"$objectId",
            objectDesc:"$objectDesc",
            objectName:"$objectName",
            objectAddress:"$objectAddress",
            sendTime:"$sendTime",
            objectId:"$objectId",
            objectTypeId:"$objectTypeId",
            objectWay:"$objectWay",
            objectImg:"$objectImg",
            userName:"$userData.userName",
            cheId:"$userData._id",
            _id:"$__v"
        }}
    ], (err, searchData) =>{
        
        let data = []
        // 如果搜索文字存在 就过滤 不存在就搜索全部符合情况即可
        if(target){
            data = searchData.filter(item =>{
                // 此时这里根据 想要的相似度 来返回相应的数据
                console.log(similarStr(item.objectName, target))
                console.log(item.objectName, target)
                if(similarStr(item.objectName, target) > 0.4) return item
            })
        }else{
            data = searchData
        }

        const newData = data.slice(pageNum*page, pageNum*(page+1))
        //此时可 返回数据 结束加载
        console.log("长度："+ newData.length)
        if(!newData.length) return res.json({"msg": "查找成功", "code": 0, data: []})
        res.json({"msg": "查找成功", "code": 200, data: newData})
    })
})

// 详情页的查找
router.get('/fDetailInfo', (req, res) =>{
    // 此时需要判断以下 这个userId是否符合情况
    const {objectId, objectUserId} = req.query
    // 此时要判断 用户的id是否正确
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
    let {infoId, page, pageNum} = req.query
    page = parseInt(page)
    pageNum = parseInt(pageNum)
    console.log(page)
    console.log(pageNum)
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
        {$skip : pageNum*page},
        {$limit: pageNum},
        {$unwind: "$commitData" }
    ], function(err, data){
        console.log(data)
        const commitData = data.map((item, index, array) =>{
            const {fromId, toId, commit, commitTime, commitData, replayData} = item

            const replayUserInfo = replayData[0]
            let arrData = {}
            arrData.fromId = fromId
            arrData.toId = toId
            arrData.commit = commit
            arrData.commitTime = commitTime

            // 评论人的信息 评论人的信息 id不需要了 与上面的fromId 和 toId相同
            arrData.fromUserName = commitData.userName
            arrData.fromAvater = commitData.avater
            arrData.toUserName = ''
            arrData.toAvater = ''
            // 没值直接返回
            if(!replayUserInfo) return arrData

            //否则返回数据
            return {
                ...arrData, 
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


function getMatch({startTime, endTime, objectTypeId, objectWay, objectUserId}){
    
    const $match = {}

    // 要判断 时间段是否存在
    if(startTime && endTime){
        $match.sendTime = {$gte : parseInt(startTime), $lt: parseInt(endTime)}
    }else if(startTime){
        $match.sendTime = {$gte : parseInt(startTime), $lt: Date.now()}
    }else if(endTime){
        $match.sendTime = {$gte : new Date('2008-01-01 00:00:00').getTime(), $lt: parseInt(endTime)}
    }

    if(objectTypeId) $match.objectTypeId = objectTypeId
    if(objectWay) $match.objectWay = objectWay
    // 因为 objectUserId比较特殊 如果不是 查找的时候需要转为 ObjectId
    // 因此 需要判断是否符合 mongodb转为 该类型的参数
    if(objectUserId && mongoose.Types.ObjectId.isValid(objectUserId)) {
        $match.objectUserId = mongoose.Types.ObjectId(objectUserId)
    }else if(objectUserId && !mongoose.Types.ObjectId.isValid(objectUserId)){
        $match.objectUserId = ''
    }


    // return JSON.stringify($match) != '{}' ? $match : 
    //     {$gte : new Date('1971-01-01 00: 00').getTime(), $lt: Date.now()}
    console.log($match)
    return $match
}

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