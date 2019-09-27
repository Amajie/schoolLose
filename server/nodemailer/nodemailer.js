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
function sendEmail(mail){
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