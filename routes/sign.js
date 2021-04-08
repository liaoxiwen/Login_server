const express = require('express');
const router = express.Router();
const db = require('../utils/database');

router.post('/sign',function(req,res){
    console.log(req.body);
    res.send('注册成功');
})
module.exports = router;
