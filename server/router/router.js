
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

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
router.post('/ci', checkToken, upload.array('uCredePic', 2), cUserInfo.cUserInfo)

router.post('/fi', checkToken, cUserInfo.fUserInfo)

router.get('/gi', checkToken, (req, res) =>{
    const {_id} = req.query
    userInfo.findOne({_id: req.userId}, (err, data) =>{
        if(!data) return res.json({"msg": "查询失败", "code": 0, authory: false})

        res.json({"msg": "查询成功", "code": 200, data, authory: data.authory})
    })
})


// 导航我的列表数据



// 关注用户
router.post('/concren', checkToken, (req, res) =>{
    const {myConcern} = req.body
    
    // true 关注 false 取消关注

    userInfo.updateOne({_id: req.userId}, {myConcern}, (err, data) =>{
        if(!data.n) return res.json({"msg": "关注失败", "code": 0})
        res.json({"msg": "关注成功", "code": 200})
    })
})

// 关注人信息的查找
router.get('/get_concren', (req, res) =>{
    const concrenList = JSON.parse(req.query.concrenList)
    /**
     * 循环遍历 关注列表 数组包裹，每一条数据即为{_d: 5da3075072a90339f44cdf1a}
     */

     const orArr = concrenList.map(item => {
         return {_id: item}
     })

    userInfo.find({$or: orArr},{

    }, (err, data) =>{
        const newData = concrenList.map((key, index) =>{

            const i = data.findIndex(item =>{

                return key === item._id.toString()
            })
            return data[i]

        })

        const concrenData = newData.map(item =>{
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

    const {myCollection} = req.body

    userInfo.update({_id: req.userId}, {myCollection}, (err, data) =>{
        if(!data.n) return res.json({"msg": "取消失败", "code": 0})
        res.json({"msg": "取消成功", "code": 200})
    })
})

// 收藏信息的查找
router.get('/get_collection', checkToken, (req, res) =>{
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
      
        // 这里先排序 帖子顺序
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

            // 再排个人信息的顺序
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
                obj.cheId = item._id
                obj.objectData = reArr[index]
                return obj
            })

            res.json({"msg": "获取成功", "code": 200, collectionData})
        })

    })

})



// 留言管理查询 
router.get('/f_my_commit', (req, res) =>{
    //这里 要根据这个 数据
    let {cheId, page, pageNum} = req.query

    page = parseInt(page)
    pageNum = parseInt(pageNum)  

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
                as: 'replyData'
            }
        },
        {
            $lookup:{
                from: 'users',
                localField: 'toId',
                foreignField: '_id',
                as: 'replyData'
            }
        },
        {$sort: {commitTime: -1}},
        {$match:{
            // 此时可以正则表达式
            commitTag: {$regex: cheId}
        }},
        {$skip : pageNum*page},
        {$limit: pageNum},
        {$unwind: "$commitData" }
    ], function(err, data){
        console.log(data)
        const commitData = data.map((item, index, array) =>{
            const {fromId, toId, infoId, infoUserId, commit, commitId, commitTag,
                 replyCommit, commitTime, commitData, replyData} = item

            const replyUserInfo = replyData[0]
            let arrData = {}
            arrData.fromId = fromId
            arrData.toId = toId
            arrData.infoUserId = infoUserId
            arrData.infoId = infoId
            arrData.commit = commit
            arrData.commitId = commitId
            arrData.commitTag = commitTag
            arrData.replyCommit = replyCommit
            arrData.commitTime = commitTime

            // 评论人的信息 评论人的信息 id不需要了 与上面的fromId 和 toId相同
            arrData.fromUserName = commitData.userName
            arrData.fromAvater = commitData.avater
            arrData.toUserName = ''
            arrData.toAvater = ''
            // 没值直接返回
            if(!replyUserInfo) return arrData

            //否则返回数据
            return {
                ...arrData, 
                toUserName: replyUserInfo.userName,
                toAvater: replyUserInfo.avater,
            }
        })

        res.json({"msg": "获取评论成功", "code": 200, commitData})
    })

})


// 留言删除 
router.get('/d_my_commit', (req, res) =>{

    const {commitId, commitTag} = req.query
    commitInfo.updateOne({commitId}, {commitTag}, (err, data) =>{
        if(!data.n) return res.json({"msg": "删除失败，请稍后再试"})

        res.json({"msg": "修改成功", "code": 200})
    })

})


router.get('/c', checkToken, (req, res) =>{
    
    // true 关注 false 取消关注

    userInfo.updateOne({_id: '5da3075072a90339f44cdf1a'}, {$push:{'myCollection': ''}}, (err, data) =>{
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
        objectImg,
        objectStepTag: 1
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
    console.log(req.body.objectTypeId)

    //消息的 id不用在此获取上传过来
    reInfo.updateOne({
        objectUserId: mongoose.Types.ObjectId(req.userId),
        objectId
    },{...req.body, objectImg, objectStepTag: 1}, (err, upData) =>{
        console.log(upData)
        // 更新失败 也要的
        //此时返回数据
        res.json({"msg": "发布成功", "code": 200})
    })
})
/**
 * @function 这里是发布消息的删除
 *          其实就是把字段 objectDelect 设置为 false
 */
router.get('/deObject', checkToken, (req, res) =>{
    const {objectId} = req.query

    //消息的 id不用在此获取上传过来
    reInfo.updateOne({
        objectUserId: mongoose.Types.ObjectId(req.userId),
        objectId,
    },
    {objectDelect: false}, (err, upData) =>{
       
        if(!upData.n) return res.json({"msg": "删除失败", "code": 0})
        //此时返回数据
        res.json({"msg": "发布成功", "code": 200})
    })
})

//个人中心 消息的查找
router.get('/fInfo', (req, res) =>{

    const {cheId, objectFinish, objectPassTag, 
            objectStepTag, stopShow} = req.query

    if(!cheId || (cheId && !mongoose.Types.ObjectId.isValid(cheId)))
        return res.status(404).json({success: false, msg: '访问的页面不存在'})
        
    
    // 默认为未删除
    const $match = {
        "objectUserId": mongoose.Types.ObjectId(cheId),
        "objectDelect": true,
    }

    // 是否是需要通过审核的
    if(objectPassTag){
        $match.objectPassTag = JSON.parse(objectPassTag)
    }

    // 是否需要已经完成的
    if(objectFinish){
        $match.objectFinish = JSON.parse(objectFinish)
    }

    // 是否需要哪个步骤的
    if(objectStepTag){
        $match.objectStepTag = parseInt(objectStepTag)
    }
    // 完成列表 需要获取已经完成的
    if(stopShow){
        $match.stopShow = parseInt(stopShow)
    }

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
        {$match},
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
            objectFinish:"$objectFinish",
            objectId:"$objectId",
            objectTypeId:"$objectTypeId",
            objectWay:"$objectWay",
            objectImg:"$objectImg",
            objectReason:"$objectReason",
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
                "userInfo": {
                    userName: fData.userName,
                    avater: fData.avater
                },
                "code": 200
            })
        })
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
        {"$match": {
            objectPassTag: true, // 审核通过
            objectAuthory: true, // 管理员没有冻结
            objectFinish : true, // 没有完成的
            objectDelect : true // 没有删除的
        }},
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
            freezeTag:"$userData.freezeTag",
            cheId:"$userData._id"
        }},
        // 只能搜素 没有冻结的账号
        {"$match": {
            freezeTag: true
        }},
    ], (err, data) =>{
        if(!data.length) return res.json({"msg": "查找成功", "code": 0, homeData: data})
        res.json({"msg": "查找成功", "code": 200, homeData: data})
    })
})

//搜素 消息的查找
router.get('/search_f_info', checkToken, (req, res) =>{
    // target 用户搜索关键字
    let {target, page, pageNum, upDownTag} = req.query
    page = parseInt(page)
    pageNum = parseInt(pageNum)

    // 正则搜素
    let regText = ''
    let $regex = new RegExp(``)

    // 如果为 存在req.adminGrade则为管理员搜素 
    // 否则用户搜素 需要搜素没有冻结的
    let freezeMatch = req.adminGrade ? {}: {
        // 没有删除
        objectDelect: true,
        freezeTag: true
    }


    // 如果有关键字 则使用正则
    if(target){
        regText = target[0]
        for(let i = 1; i< target.length; i++){
            regText += `|${target[i]}`
        }

        $regex = new RegExp(`${regText}`, "i")
    }

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
        {$sort:{sendTime: parseInt(upDownTag? upDownTag : -1)}},
        {$match:{
            // 此时可以正则表达式
            objectName: {$regex}
        }},
        // 可以根据查询
        {"$match": getMatch(req.query)},
        { $unwind: "$userData"},
        {$project:{
            objectId:"$objectId",
            objectDesc:"$objectDesc",
            objectName:"$objectName",
            objectAddress:"$objectAddress",
            sendTime:"$sendTime",
            objectTime:"$objectTime",
            objectId:"$objectId",
            objectTypeId:"$objectTypeId",
            objectWay:"$objectWay",
            objectImg:"$objectImg",
            objectStepTag:"$objectStepTag",
            objectPassTag:"$objectPassTag",
            objectAuthory:"$objectAuthory",
            objectFinish:"$objectFinish",
            objectDelect:"$objectDelect",
            userName:"$userData.userName",
            avater:"$userData.avater",
            cheId:"$userData._id",
            freezeTag:"$userData.freezeTag",
            _id:"$__v"
        }},
        // 只能搜素 没有冻结的账号
        {"$match": freezeMatch}
    ], (err, searchData) =>{

        const total = searchData.length

        const newData = searchData.slice(pageNum*page, pageNum*(page+1))

        //此时可 返回数据 结束加载
        if(!newData.length) return res.json({"msg": "查找成功", "code": 0, data: [], total})
        res.json({"msg": "查找成功", "code": 200, data: newData, total})
    })
})

// 详情页的查找
router.get('/fDetailInfo', (req, res) =>{
    // 此时需要判断以下 这个userId是否符合情况
    const {objectId, objectUserId} = req.query

    console.log(objectId)
    console.log(objectUserId)
    // 此时要判断 用户的id是否正确
    reInfo.findOne({
        objectId, 
        objectDelect: true,
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
    // 是回复 不需要生成唯一id
    if(toId){
        toId = mongoose.Types.ObjectId(toId)
    // 不是回复 需要生成唯一id
    }

    const commitId = getId()

    commitInfo.create({
        ...req.body,
        commitId,
        toId,
        fromId: mongoose.Types.ObjectId(fromId)
    }, (err, data) =>{
        if(!data) return res.json({"msg": "留言失败", "code": 0})
        
        res.json({"msg":"留言成功", "code": 200, "commitData": data, commitId})
    })
})
// 留言的查询
router.get('/fCommit', (req, res) =>{
    //这里 要根据这个 数据
    let {infoId, page, pageNum} = req.query
    page = parseInt(page)
    pageNum = parseInt(pageNum)

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
                as: 'replyData'
            }
        },
        {$match:{infoId}},
        {$skip : pageNum*page},
        {$limit: pageNum},
        {$unwind: "$commitData" }
    ], function(err, data){
        console.log(data)
        const commitData = data.map((item, index, array) =>{
            const {fromId, toId, infoId, infoUserId, commit, commitId, replyCommit, commitTime, commitData, replyData} = item

            const replyUserInfo = replyData[0]
            let arrData = {}
            arrData.fromId = fromId
            arrData.toId = toId
            arrData.infoUserId = infoUserId
            arrData.infoId = infoId
            arrData.toId = toId
            arrData.commit = commit
            arrData.commitId = commitId
            arrData.replyCommit = replyCommit
            arrData.commitTime = commitTime

            // 评论人的信息 评论人的信息 id不需要了 与上面的fromId 和 toId相同
            arrData.fromUserName = commitData.userName
            arrData.fromAvater = commitData.avater
            arrData.toUserName = ''
            arrData.toAvater = ''
            // 没值直接返回
            if(!replyUserInfo) return arrData

            //否则返回数据
            return {
                ...arrData, 
                toUserName: replyUserInfo.userName,
                toAvater: replyUserInfo.avater,
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


function getMatch({startTime, endTime, objectTypeId, objectWay, objectUserId, objectPassTag}){

    const $match = {}

    // 要判断 时间段是否存在
    if(startTime && endTime){
        $match.sendTime = {$gte : parseInt(startTime), $lt: parseInt(endTime)}
    }else if(startTime){
        $match.sendTime = {$gte : parseInt(startTime), $lt: Date.now()}
    }else if(endTime){
        $match.sendTime = {$gte : new Date('2008-01-01 00:00:00').getTime(), $lt: parseInt(endTime)}
    }else if(objectPassTag){// 如果有传值 即为搜素 普通用户搜素
        $match.objectPassTag = true
        $match.objectAuthory = true
    }

    if(objectTypeId) $match.objectTypeId = objectTypeId
    if(objectWay) $match.objectWay = objectWay
    // 因为 objectUserId比较特殊 如果不是 查找的时候需要转为 ObjectId
    // 因此 需要判断是否符合 mongodb转为 该类型的参数
    if(objectUserId && mongoose.Types.ObjectId.isValid(objectUserId)) {
        $match.objectUserId = mongoose.Types.ObjectId(objectUserId)
    }else if(objectUserId && !mongoose.Types.ObjectId.isValid(objectUserId)){
        $match.objectUserId = ''// 此时肯定不会搜素到数据
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