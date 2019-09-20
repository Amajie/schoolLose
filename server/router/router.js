
const express = require('express')
const router = express.Router()

router.get('/', (req, res) =>{
    res.json({"msg": "请求成功", "status": 200})
})

//---------------------------------------------------------->

router.get('/md', (req, res) =>{
    console.log(req.headers)
    res.json({"msg": "获取session----> router"})
})


module.exports = router