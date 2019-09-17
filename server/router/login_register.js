
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

router.get('/', (req, res) =>{
    // console.log(req.headers)
    res.json({"msg": "请求成功", "status": 200})
})

//---------------------------------------------------------->

router.post('/register', (req, res) =>{



})
   
   
   router.get('/login', (req, res) =>{
       req.session.token= '车神-黄杰'
       res.send('设置session')
   })

function getToken(){
    return (Math.random() + Date.now()).toString(36)
}



module.exports = router