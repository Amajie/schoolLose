const nodemailer = require('nodemailer')

// 创建一个SMTP客户端配置
const config = {
    // //qq邮箱 163为 smtp.163.com
    host: 'smtp.qq.com', 
    port: 465,//端口 25
    auth: {
        // 发件人邮箱账号
        user: '651762920@qq.com',
        //邮箱的授权码
        pass: 'trdcnwvniclsbeih'
    }
}
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config)

// 发送邮件
function sendEmail(to){
    // 创建一个邮件对象
    const mail = {
        // 发件人
        from: '车神寻物网<651762920@qq.com>', //昵称<发件人邮箱>
        // 主题
        subject: '激活验证码',
        // 收件人
        to,
        // 邮件内容，也可以为HTML格式
        text: `您的激活验证码为：${checkCode}, 请24小时内有效，请谨慎保管。` //可以是链接，也可以是验证码
    }

    //发送邮件
    transporter.sendMail(mail, function(error, info){
        if(error) {
            return console.log(error);
        }
        transporter.close()
        console.log('mail sent:', info.response)
    })
}

module.exports = sendEmail