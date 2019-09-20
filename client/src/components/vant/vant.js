import {Dialog, Toast} from 'vant'

/*
* @function 确认 取消弹窗
* @params title 标题
* @params message 提示内容
*
*/
export const  dConfirm = (title, message) =>{
    return Dialog.confirm({
        title,
        message
    })
}

/*
* @function 消息提示框
* @params message 提示内容
*
*/
export const  dAlert = message =>{
    return Dialog.alert({
        message
    })
}

/*
* @function 请提示
* @params message 轻提示内容
*
*/
export const  tText = message =>{
    Toast({
        message,
        closeOnClick: true,//这里的点击即为点击 轻提示
        duration: 1500
    })
}