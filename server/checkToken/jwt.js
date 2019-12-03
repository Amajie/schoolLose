/**
 * @function 设置生成token 和验证token的文件
 * 
 */

const jwt = require('jsonwebtoken')

const secretKey = 'che-hj-www://jie412.com'//加密参数 解密也需要它
const expiresIn = 60*60*4 // 设置token过期时间
let loginMap = new Map()

/**
 * @function 生成token 这里是登陆成功后调用
 * @param {*} data 需要保存在token的数据
 */
 exports.createToken = data => {
    const currentTime = Date.now()

    // 每次保存的是最新的 登陆时间
    loginMap.set(data.userId.toString(), currentTime)
    // 保存当前登陆的时间
    data.mapTime = currentTime

    return jwt.sign(data, secretKey, {expiresIn})
 }

 /**
 * @function 生成token 这里是登陆成功后调用
 * @param {*} data 需要保存在token的数据
 */
exports.checkToken = (req, res, next) =>{
    /**
     * 1 先判断是否存在token 暂时保存在请求头里面 如果有必要在设置保存在请求参数中
     *      1 不存在拒绝访问 403
     *      2 存在 解析token 获取相应的信息
     */

     // 拿取token 此时不需要判断token是否为 null或者undefined 前端判断即可
    // const token = req.headers['jie412.com-token']
    

    let token = null
    const cookieArr = req.headers.cookie.split("; ")
    // 解析cookie
    for(var i=0; i<cookieArr.length; i++){
        let newArr = cookieArr[i].split("=")
        if(newArr[0].indexOf('che_token') != -1){
            token = newArr[1]
        }
    }

    // 否则解析token
    jwt.verify(token, secretKey, (err, decoded) =>{

        //解析错误 说明为无效token 此时应该要去登陆页面
        if(err) return res.status(401).json({"success": false, "msg": 'token信息错误.'})
        // 获取最新的时间
        const mapTime = loginMap.get(decoded.userId.toString())
        // 此时 mapTime不存在无需判断 这里多此一举了 此时说明存在一个账户两处登陆
        if(mapTime && !(mapTime === decoded.mapTime || mapTime - decoded.mapTime > expiresIn*1000))
            return res.json({"success": false, "msg": '已在别处登录，强制下线', data: null, "code": 110})

        //否则 decoded即为解析完毕的token 可以把数据保存在 req中
        if(decoded.userName){
            req.userName = decoded.userName
            req.email = decoded.email
            req.userId = decoded.userId
        }else{
            req.adminEmail = decoded.adminEmail
            req.adminGrade = decoded.adminGrade
        }
        next()
    })
}

exports.delectLoginMap = (req, res) =>{

    const {userId} = req.body
    const newArr = Array.from(loginMap).filter(item =>{
        return item[0] != userId
    })

    // 有数据重新赋值
    if(newArr.length) loginMap = new Map(newArr)

    res.json({"msg": "退出成功", "code": 200})
}
 