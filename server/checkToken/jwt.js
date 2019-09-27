/**
 * @function 设置生成token 和验证token的文件
 * 
 */

 const jwt = require('jsonwebtoken')

const secretKey = 'che-hj-www://jie412.com'//加密参数 解密也需要它
const expiresIn = 60//设置token过期时间


/**
 * @function 生成token 这里是登陆成功后调用
 * @param {*} data 需要保存在token的数据
 */
 exports.createToken = data => jwt.sign(data, secretKey, {expiresIn})

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

     // 拿取token
     const token = req.headers['jie412.com-token']


     // 无效token 同意返回一个标识 表示无效token
     if(!token) return res.status(200).json({
        success: false,
        message: '服务器拒绝访问'
    })

    // 否则解析token
    jwt.verify(token, secretKey, (err, decoded) =>{

        //说明token的信息有误
        if(err) return res.json({ success: false, message: 'token信息错误.'})

        //否则 decoded即为解析完毕的token 可以把数据保存在 req中
        req.userName = decoded.userName
        req.userName = decoded.email
        req.userId = decoded.userId
        next()
    })

}
 