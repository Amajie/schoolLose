const nodemailer = require('nodemailer')

// 创建一个SMTP客户端配置
// var config = {
//     // host: 'smtp.qq.com',//qq邮箱 
//     host: 'smtp.163.com',//网易163邮箱
//     port: 465,//网易邮箱端口 25
//     auth: {
//         user: 'hjie412@163.com', //邮箱账号
//         pass: 'huangjie661775'  //邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
//     }
// }

var config = {
    host: 'smtp.qq.com',//qq邮箱 
    port: 465,//端口 25
    auth: {
        user: '651762920@qq.com', //邮箱账号
        pass: 'trdcnwvniclsbeih'  //邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
    }
}

// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config)

// 发送邮件
function sendEmail(mail){
    transporter.sendMail(mail, function(error, info){
        if(error) {
            return console.log(error);
        }

        transporter.close()
        console.log('mail sent:', info.response)
    })
}

module.exports = sendEmail