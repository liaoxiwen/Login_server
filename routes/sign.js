const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { password } = require('../utils/database.config');
const { RES_CODES } = require('../utils/Enum');

router.post('/sign', async function (req, res) {
    const { username = null, phonenumber = null, email = null } = req.body;
    let findSql = `select * from user where phonenumber='${phonenumber}' or email='${email}'`;
    console.log(findSql);
    try {
        var findResult = await db.query(findSql);
    } catch (err) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: err
        });
    }
    if (findResult.length !== 0) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: '该手机号或邮箱号已被注册'
        });
    }

    findSql = `select * from user where username='${username}'`;
    try {
        findResult = await db.query(findSql);
    } catch (err) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: err
        });
    }
    if (findResult.length !== 0) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: '用户名已存在'
        });
    }

    const insertSql = `insert into user(username,phonenumber,email,password) values ('${username}','${phonenumber}','${email}','${password}')`;
    try {
        await db.query(insertSql);
        res.send({
            code: RES_CODES.SUCCESS,
            msg: '注册成功'
        });
    } catch (err) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: err
        });
    }

})
module.exports = router;
