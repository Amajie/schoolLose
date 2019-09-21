
//通过这种方式引入
const CryptoJS = require('crypto-js')

/**
 * 解密
 * 调用 const decrypt = CryptoJS.AES.decrypt({hex, keyHex,mode, padding})方法
 * @params hex 待解密的密文 const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
 * @params const hex = CryptoJS.enc.Base64.stringify(encryptedHexStr)
 * @params keyHex 密钥 CryptoJS.enc.Utf8.parse(key)//key即为 一个字符串
 * @params mode CryptoJS.mode.CBC
 * @params padding CryptoJS.pad.Pkcs7
 * @params const password = decrypt.decrypt.toString(CryptoJS.enc.Utf8).toString()//即可获取密码
 * @params const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF")  //十六位十六进制数作为密钥
 * @params const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412')   //十六位十六进制数作为密钥偏移量
 */

/**
 * @function 解密
 * @param {*} word 待解密的密文 
 * @param {*} key  密钥 与加密密钥一样
 * @param {*} iv   密钥偏移量 与加密密钥偏移量一样
 */
export const decrypt = (word, key, iv) =>{

    key = CryptoJS.enc.Utf8.parse(key)
    iv =  CryptoJS.enc.Utf8.parse(iv)

    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const hex = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decrypt = CryptoJS.AES.decrypt(hex, key,{ iv,
        mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})

    // 密码
    return decrypt.toString(CryptoJS.enc.Utf8).toString()
}

/**
 * @function 加密密码
 * @param {*} word 密码
 * @param {*} key 密钥 与解密密钥一样
 * @param {*} iv  密钥偏移量 与解密密钥偏移量一样
 */
export const encrypt = (word, key, iv) =>{

    key = CryptoJS.enc.Utf8.parse(key)
    iv =  CryptoJS.enc.Utf8.parse(iv)

    let srcs = CryptoJS.enc.Utf8.parse(word)
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })

    //返回密文
    return encrypted.ciphertext.toString().toUpperCase()
}





