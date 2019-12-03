const md5 = require('md5')
const sendEmail = require('../nodemailer/nodemailer.js')
const mongoose = require('mongoose')
//数据库信息
//个人信息表
const userInfo = require('../mongodb/userInfo.js')
const reInfo = require('../mongodb/release.js')
const commitInfo = require('../mongodb/commit.js')
//邮箱 验证码信息表
const {emailInfo, emailSchema} = require('../mongodb/email.js')
const constInfo = require('../mongodb/constant.js')
//邮箱验证码的类型
const {CREGISTER, FORGET_PASSWORD, COURTYARDDATA, TYPE_NAV, AVATER_INIT} = require('../router/CONST.js')

//加密与解密
const {decrypt, encrypt} = require('../crypto/encrypt.js')

//生成和解析token
const {createToken} = require('../checkToken/jwt.js')

// 登陆、注册
exports.enter = {
    /**
    * @function 用户注册
    *   1 获取 用户的注册 用户名 电子邮件
    *   2 查看用户名、电子邮件是否已经被使用过
    *       1 有 提示用户换一个用户名 或者邮箱
    *       2 没有 密码使用md5加密 再插入注册数据
    *   3 注册成功 则提示用户可以跳转页面激活账户
    */
    register: (req, res) =>{
   
        const {userName, email, password} = req.body
        
        req.body.password = md5(password)
        
        //使用或查询
        userInfo.findOne({$or:[
            {userName},
            {email}
        ]}, (err, data) =>{
     
             // 这里 已经用户名或者 邮箱被使用过了
            if(data){
                if(data.userName === userName) return res.json({"msg": "用户名已经被使用过", "code": 1})
                if(data.email === email) return res.json({"msg": "者邮箱已经被使用过", "code": 0})
            }
     
            //加密 保存
            req.body.password = md5(password)
     
            userInfo.create({...req.body, avater: AVATER_INIT}, (err, createDate) =>{
     
                 // 插入数据失败
                 if(!createDate) return res.json({"msg": "注册失败，请稍后再试", "code": -1})
     
                 //插入数据成功 提示用户前往激活页面
                 res.json({"msg": "注册成功, 请先激活", "code": 200})
     
            })
        })
    },

    /**
    * 
    *@function 用户登陆
    *  1 获取 用户的登陆用户名 密码 以及 是否记住密码
    *  2 验证 用户名 或者密码是否正确
    *      1 错误 提示密码错误
    *      2 正确 则看是否记住密码
    *          1 记住密码 设置cookie 用户名 以及加密的 密码 过期时间为 30天   
    *          2 不记住密码 不设置 cookie 用户名 以及密码这些信息
    *      3 返回token
    */ 
    login: (req, res) =>{
        let {userName, password, token} = req.query
        userInfo.findOne({$or:[
            {userName},
            {email:userName}
        ]}, (err, data) =>{
            
            // 用户名 或者 电子邮箱错误
            if(!data) return res.json({"msg": "该用户不存在", "code": -1})

            const {
                userName, email, _id, userType, myConcern,
                avater, name, stId, gender, userActive, myCollection,
                courtyard, major, classes, address, credePic, passStep,
                authory, freezeTag    
            } = data
            if(!userActive) return res.json({"msg": "该用户还没有激活", "code": 1})
            // 已被冻结
            if(!freezeTag) return res.json({"msg": "该账户已被冻结", "code": -2})

    
            //验证密码是否正确
            if(data.password != md5(password)) return res.json({"msg": "密码错误", "code": 0})
            

            // 查询数据
            constInfo.find({$or:[
                {
                    constKey: 'type_nav'
                },
                {
                    constKey: 'courtyardData'
                }
            ]}, (err, constData) =>{

                if(!constData.length) return res.json({"msg": "获取数据失败", "code": 2})
                let constObj = {}
                constData.forEach(item =>{
                    constObj[item.constKey] = item.constVal
                })

                //获取token
                token = token ? token : createToken({userName, email, userId: _id})

                res.json({
                    "msg": "密码正确，登陆成功", "code": 200, 
                    token, 
                    userData: {
                        userName, email, userType, cheId: _id,
                        avater, name, stId, gender, myConcern, myCollection, 
                        courtyard, major, classes, address, credePic, passStep,
                        authory     
                    },
                    courtyardData: constObj.courtyardData,
                    type_nav: constObj.type_nav
                })

            })
        })
    },

    // 发送忘记密码修改验证码
    sendForgetPassword: (req, res) =>{
        //获取 找回密码验证码
        const {email} = req.query
        //查看是否有 该用户
        userInfo.findOne({email}, (err, data) =>{
            
            // 没有绑定账户
            if(!data) return res.json({"msg": "该邮箱没有绑定任何用户", "code": 0})
    
            //查看验证码是否已经发送
            //获取用户的id
            const checkId = data._id
            emailInfo.findOne({checkId}, (err, findData) =>{
    
                // 已经发送 且有效 无需再次发送
                if(findData) return res.json({
                    "msg": "该邮箱的验证码已经发送，可查看邮箱获取验证码", 
                    "code": 304, 
                    checkId,
                    checkTag: FORGET_PASSWORD
                })
    
                // 没有发送或者验证码已经失效 获取验证码
                const checkCode = Math.random().toString().slice(-6)
    
                /*
                *@function 向数据库插入验证码信息
                *@params checkId 即用户的 id
                *@params checkCode 验证码
                */
                emailInfo.create({limeTime: new Date(), checkCode, checkId, checkTag: FORGET_PASSWORD}, (err, createDate) =>{
        
                    // 插入验证码失败
                    if(!createDate) return res.json({"msg": "获取验证码失败，请重新获取", "code": -1})
                    
                    //设置定时时间 24小时 因为mongodb 60s查询一下过期文档 因此 删除会有一点延时 试一下 这个是否可以删除
                    emailInfo.createIndexes(emailSchema.index({limeTime : 1}, {expires:120}),
                        function(err, info){
                                                    
                            // 创建一个邮件对象
                            const mail = {
                                // 发件人
                                from: '车神寻物网<651762920@qq.com>', //昵称<发件人邮箱>
                                // 主题
                                subject: '修改密码验证码',
                                // 收件人
                                to: email,
                                // 邮件内容，也可以为HTML格式
                                text: `您修改密码验证码为：${checkCode}, 请24小时内有效，请谨慎保管。` //可以是链接，也可以是验证码
                            }
                            console.log(mail)
                            //发送邮箱
                            //sendEmail(mail) //这里可以走通 但是此时不需要发送邮箱 直接看数据库获取验证码 测试即可
                            //插入数据成功 此时需要返回数据库的 checkId 输入验证码的时候需要带上 查询验证码
                            res.json({
                                "msg": "验证码已经发送，请注意查收",
                                "code": 200, 
                                checkId,
                                checkTag: FORGET_PASSWORD
                                
                            })
                    })
                })
            })
        })
    },

    /**
    * @function 获取客户端的邮箱 发送邮箱验证码 
    *   1 获取激活的邮箱账户
    *   2 查看账户 是否绑定账户 再查看是否已经激活
    *   3 查看验证码 是否已经发送
    *       1 已经发送 无需再次发送
    *       2 没有发送 获取验证码
    *   5 验证码插入数据库 并发送邮箱验证码 并设置验证码24小时内有效 在这24小时无需要在发送
    */
   sendActiveE:  (req, res) =>{
        //获取激活邮箱
        const {email} = req.query
        //查看账户 是否绑定账户 是否已经激活
        userInfo.findOne({email}, (err, data) =>{
            
            // 没有绑定账户
            if(!data) return res.json({"msg": "该邮箱没有绑定任何用户", "code": 0})
    
            
            //为true 说明已经激活 无需在激活
            if(data.userActive) return res.json({"msg": "绑定该邮箱的账户已经激活，无需重复激活", "code": 1})
    
            //查看验证码是否已经发送
            //获取用户的id
            const checkId = data._id
            emailInfo.findOne({checkId}, (err, findData) =>{
    
                // 已经发送 且有效 无需再次发送
                if(findData) return res.json({
                    "msg": "该邮箱的验证码已经发送，可查看邮箱获取验证码", 
                    "code": 304, 
                    checkId,
                    checkTag: CREGISTER
                })
    
                // 没有发送或者验证码已经失效 获取验证码
                const checkCode = Math.random().toString().slice(-6)
    
                /*
                *@function 向数据库插入验证码信息
                *@params checkId 即用户的 id
                *@params checkCode 验证码
                */
                emailInfo.create({limeTime: new Date(), checkCode, checkId, checkTag: CREGISTER}, (err, createDate) =>{
        
                    // 插入验证码失败
                    if(!createDate) return res.json({"msg": "获取验证码失败，请重新获取", "code": -1})
                    
                    //设置定时时间 24小时 因为mongodb 60s查询一下过期文档 因此 删除会有一点延时 试一下 这个是否可以删除
                    emailInfo.createIndexes(emailSchema.index({limeTime : 1}, {expires:120}),
                        function(err, info){
                                                    
                            // 创建一个邮件对象
                            const mail = {
                                // 发件人
                                from: '车神寻物网<651762920@qq.com>', //昵称<发件人邮箱>
                                // 主题
                                subject: '激活验证码',
                                // 收件人
                                to: email,
                                // 邮件内容，也可以为HTML格式
                                text: `您的激活验证码为：${checkCode}, 请24小时内有效，请谨慎保管。` //可以是链接，也可以是验证码
                            }
                            console.log(mail)
                            //发送邮箱
                            //sendEmail(mail) //这里可以走通 但是此时不需要发送邮箱 直接看数据库获取验证码 测试即可
                            //插入数据成功 此时需要返回数据库的 checkId 输入验证码的时候需要带上 查询验证码
                            res.json({
                                "msg": "验证码已经发送，请注意查收",
                                "code": 200, 
                                checkTag: CREGISTER, 
                                checkId
                            })
                    })
                })
            })
        })
    },

    /**
    * @function 获取客户端的输入的验证码 查询数据库是否正确
    *   1 根据 checkId 获取验证码
    *       1 不存在 失效
    *       2 存在 验证是否正确
    *   2 验证码错误 激活失败 重新输入验证码
    *   3 修改用户已经激活状态
    *   4 验证码正确 激活成功 （不需要在还是拿出验证码 因为已经激活 时间到了自然会删除）
    */
    checkE: (req, res) =>{
        let {checkCode, checkId, checkTag, changeData} = req.query

        changeData = JSON.parse(changeData)

        console.log(changeData)
        // 查询验证码
        emailInfo.findOne({checkId, checkTag}, (err, data) =>{
            // 不存在 提示
            if(!data) return res.json({"msg": "验证码不存在或者已失效，请重新获取", "code": 0})

            // 存在 验证是否正确 重新激活
            if(checkCode != data.checkCode) return res.json({"msg": "验证码错误，请重新输入!", "code": 1})
            

            // 密码存在即为修改密码 现加密 后修改
            if(changeData.password){
                changeData.password = md5(changeData.password)
            }

            // 修改用户为激活状态
            userInfo.updateOne({_id: checkId}, changeData, (err, upData) =>{
                // 激活失败
                if(upData.nModified <= 0) return res.json({"msg": "操作失败，请重新输入验证码", "code": -1})

                // 验证码正确  并且修改用户为激活状态
                emailInfo.deleteOne({checkId, checkTag}, (err, deleteData) =>{
                    // 激活成功
                    res.json({"msg": "验证码正确，操作成功", "code": 200})
                })
            })
        })
    }
}

// 用户信息的修改
exports.cUserInfo = {
    /**
    * 
    * @function 修改 用户名
    *  1 判断新输入的用户名是否存在
    *      1 存在 提示 已存在
    *      2 不存在 更新数据
    * 
    */
    cUserName: (req, res) =>{

        const {userName} = req.body
        //查找用户名是否存在
        userInfo.findOne({userName}, (err, data) =>{
            // 用户名已经存在
            if(data) return res.json({"msg": "用户名已经存在", "code": 0})
            userInfo.updateOne({_id: req.userId}, {userName}, (err, upData) =>{
                // 更新失败
                if(upData.nModified <= 0) return res.json({"msg": "修改失败，请稍后再试", "code": -1})
                // 修改成功
                res.json({"msg": "该用户名可以使用", "code": 200})
            })
        })
    },

    /**
    * 
    * @function 修改 密码
    *  1 判断当前密码输入是否正确
    *      1 错误 提示 提示当前密码输入错误
    *      2 正确 更新数据
    * 
    */
    cUserPassword: (req, res) =>{

        const {password, oldPassword} = req.body
        
        userInfo.findOne({_id: req.userId}, (err, data) =>{
             //查找用户失败
             if(!data) return res.json({"msg": "用户不存在", "code": 1})
             // 验证当前旧密码是否错误
             if(data.password != md5(oldPassword)) return res.json({"msg": "当前密码输入错误", "code": 0})
     
             userInfo.updateOne({_id: req.userId}, {password: md5(password)}, (err, upData) =>{
                 // 更新失败
                 if(upData.nModified <= 0) return res.json({"msg": "修改失败，请稍后再试", "code": -1})
                 // 修改成功
                 res.json({"msg": "修改密码成功", "code": 200})
             })
         })
    },

    /**
    * 
    * @function 发送修改邮箱验证码
    *  1 修改邮箱 需要密码 修改成功之后 发送通知到旧邮箱即可
    *  2 验证密码是否正确
    *      1 不正确 提示错误
    *      2 正确 更新邮箱数据
    *  
    */
    cUserEmail: (req, res) =>{

        const {email, password} = req.body
        userInfo.findOne({_id: req.userId}, (err, data) =>{
            //查找用户失败
            if(!data) return res.json({"msg": "用户不存在", "code": 1})
            //验证当前旧密码是否错误
            if(data.password != md5(password)) return res.json({"msg": "密码输入错误", "code": 0})
            
            // 此时设置为未激活状态
            userInfo.updateOne({_id: req.userId}, {email, userActive: false}, (err, upData) =>{
                // 更新失败
                if(upData.nModified <= 0) return res.json({"msg": "修改失败，请稍后再试", "code": -1})
                
                // 创建一个邮件对象
                const mail = {
                    // 发件人
                    from: '车神寻物网<651762920@qq.com>', //昵称<发件人邮箱>
                    // 主题
                    subject: '邮箱修改',
                    // 收件人
                    to: data.email,
                    // 邮件内容，也可以为HTML格式
                    text: `您绑定车神寻物网的账号邮箱已被修改为：${email}，若不是本人所为，请及时登陆修改!` //可以是链接，也可以是验证码
                }
    
                console.log(mail)
    
                //发送有邮件
                //sendEmail(mail)
    
                // 修改成功
                res.json({"msg": "修改邮箱成功", "code": 200})
            })
        })
    },

    
    /**
    * 
    * @function 修改用户的个人信息
    * 
    */
    cUserInfo: (req, res) =>{
        // 因为是数组 因此也不需要在重新设置
        let credePic = JSON.parse(req.body.credePic)
    
        // 如果有值 上传图片则
        if(req.files.length){
            req.files.map(item =>{
                credePic.push(`http://127.0.0.1:7070/${item.fieldname}/${item.filename}`)
            })
        // 如果上传图片失败 或者说 证件照长度为 0 即为没有图片
        // 直接返回
        }else if(!req.files.length && !credePic.length){
            return res.json({"msg": "修改失败", "code": 0})
        }

        // 判断学号教工号 身份证是否被人用过
        userInfo.findOne({stId: req.body.stId}, (err, findData) =>{

            // 用过
            if(findData) return res.json({"msg": "修改失败", "code": -1})

            // 此时更新 数据都设置为 authory false passStep: 1
            userInfo.updateOne({_id: req.userId}, {...req.body, credePic, authory: false, passStep: 1}, (err, data) =>{
                if(!data.n) return res.json({"msg": "修改失败", "code": 0})

                res.json({"msg": "修改成功", "code": 200, credePic})
            })
        })
    },

    // 查询身份验证是否通过
    checkAuthory: (req, res) =>{

        userInfo.findOne({_id: req.userId},
            {
                _id:0, __v:0, 
                password: 0,
                userActive: 0
            }
            , (err, userData) =>{
                console.log(userData)
            if(!userData || userData.passStep === 0 || userData.passStep === 1) 
                return res.json({"msg": "获取信息失败", "code": 0})
    
            res.json({
                "msg": "获取数据成功", 
                "code": 200,
                "authory": userData.authory,
                "passStep": userData.passStep
            })
        })
    }
}

// 我的
exports.meList = {
    /**
     * 头像更换
     * 
     */
    upAvatar: (req, res) =>{
        console.log(req.file)
        if(req.file.filename) {
            const avater = `http://127.0.0.1:7070/${req.file.fieldname}/${req.file.filename}`
            userInfo.updateOne({_id: req.userId}, {avater}, (err, data) =>{
                if(data.n <= 0) return res.json({"msg": "上传失败", "code": 0})
                
                res.json({"msg": "上传成功", "code": 200, avater})
            })
        }
    },
    /**
     * 个人中心数据的查找
     */
    fCenterData: (req, res) =>{

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
    
            // //不存在数据
            if(!data || !data.length){
                return userInfo.findOne({_id: cheId}, (err, fData) =>{
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
            }

            // 存在数据
            res.json({"msg": "查找成功", "code": 200, data})
        })
    },
    // 关注他人
    concren: (req, res) =>{
        const {myConcern} = req.body
        
        // true 关注 false 取消关注
    
        userInfo.updateOne({_id: req.userId}, {myConcern}, (err, data) =>{
            if(!data.n) return res.json({"msg": "关注失败", "code": 0})
            res.json({"msg": "关注成功", "code": 200})
        })
    },
    // 我的关注人信息查找
    getConcren: (req, res) =>{
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
    },
    // 搜藏帖子
    collection: (req, res) =>{

        const {myCollection} = req.body
    
        userInfo.update({_id: req.userId}, {myCollection}, (err, data) =>{
            if(!data.n) return res.json({"msg": "取消失败", "code": 0})
            res.json({"msg": "取消成功", "code": 200})
        })
    },

    // 收藏列表信息的查找
    getCollection: (req, res) =>{
        const collectionList = JSON.parse(req.query.collectionList)
        const orArr = collectionList.map(item => {
            return {objectId: item}
        })
    
        reInfo.find({$or: orArr}, (err, reData) =>{
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
    
    },
    /**
     * 留言的插入
     */
    insertCommit: (req, res) =>{

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
    },
    /**
     * 留言管理的查询
     */
    getCommit: (req, res) =>{
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

            if(!data) return res.json({"msg": "获取评论成功", "code": 200, commitData: []})

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
    
    },
    /**
     * 留言删除
     */
    dMyCommit: (req, res) =>{

        const {commitId, commitTag} = req.query
        commitInfo.updateOne({commitId}, {commitTag}, (err, data) =>{
            if(!data.n) return res.json({"msg": "删除失败，请稍后再试"})
    
            res.json({"msg": "修改成功", "code": 200})
        })
    
    }
}

//个人中心
exports.centerData = {
    /**
     * 详情页查找
     */
    getDetail: (req, res) =>{
        // 此时需要判断以下 这个userId是否符合情况
        const {objectId, objectUserId} = req.query
    
        // 此时要判断 用户的id是否正确
        reInfo.findOne({
            objectId, 
            objectDelect: true,
            objectUserId: mongoose.Types.ObjectId(objectUserId)
        }, (err, data) =>{
            if(!data) return res.json({"msg": "查找失败", "code": 0})
    
            res.json({"msg": "查找成功", "code": 200, "detailData": data})
    
        })
    
    },
    // 详情页评论的查找
    getObjectCommit: (req, res) =>{
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
            
            if(!data) return res.json({"msg": "获取评论成功", "code": 200, commitData: []})

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
    
    },
    /**
     * 数据的发布和编辑
     */
    insertObject: (req, res) =>{

        let objectImg = null
        // 如果有值 上传图片则
        if(req.files.length){
            objectImg = req.files.map(item =>{
                return `http://127.0.0.1:7070/${item.fieldname}/${item.filename}`
            })
        //否则显示默认图片
        }else{
            objectImg = [`http://127.0.0.1:7070/init/init.png`]
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
    },
    // 数据的编辑
    editObject: (req, res) =>{

        // 因为是数组 因此也不需要在重新设置
        let objectImg = JSON.parse(req.body.objectImg)
        let objectId = req.body.objectId
        // 此时删除这个消息 也可以不用删除 数据一样其他也会更新
        // delete req.body.objectId
    
        // 如果有值 上传图片则
        if(req.files.length){
            req.files.map(item =>{
                objectImg.push(`http://127.0.0.1:7070/${item.fieldname}/${item.filename}`)
            })
        // 此时只能说 用户删除了所有的图片 显示默认的图片
        }else if(!objectImg.length){
            objectImg = [`http://127.0.0.1:7070/init/init.png`]
        }
    
        //消息的 id不用在此获取上传过来
        reInfo.updateOne({
            objectUserId: mongoose.Types.ObjectId(req.userId),
            objectId
        },{...req.body, objectImg, objectStepTag: 1}, (err, upData) =>{
            // 更新失败 也要的
            //此时返回数据
            res.json({"msg": "发布成功", "code": 200})
        })
    },
    // 数据的删除
    delectObject: (req, res) =>{
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
    }
}

// 首页
exports.homeData = {
    // 首页数据查找
    getHomeData: (req, res) =>{
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
            if(!data || !data.length) return res.json({"msg": "查找成功", "code": 0, homeData: []})

            res.json({"msg": "查找成功", "code": 200, homeData: data})
        })
    },
    // 发布数据的查找
    searchObject: (req, res) =>{
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
            if(!searchData || !searchData.length) return res.json({"msg": "查找成功", "code": 0, data: [], total: 0})

            // 否则获取数据
            const total = searchData.length
            const newData = searchData.slice(pageNum*page, pageNum*(page+1))
    
            //此时可 返回数据 结束加载
            if(!newData.length) return res.json({"msg": "查找成功", "code": 0, data: [], total})
            res.json({"msg": "查找成功", "code": 200, data: newData, total})
        })
    }
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


    console.log($match)
    return $match
}

function getId(){
    return (Math.random() + Date.now()).toString(36)
}
