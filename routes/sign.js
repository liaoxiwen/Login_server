const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { RES_CODES } = require('../utils/Enum');
const uuid = require('node-uuid');

router.post('/sign', async function (req, res) {
    const { username = null, phonenumber = null, email = null, password = null } = req.body;
    let findSql = `select username from user where phonenumber='${phonenumber}' or email='${email}'`;
    try {
        const findResult = await db.query(findSql);
        if (findResult.length !== 0) {
            return res.send({
                code: RES_CODES.ERROR,
                msg: '该手机号或邮箱号已被注册'
            });
        }
    } catch (err) {
        res.status(500);
        return res.send({
            code: RES_CODES.ERROR,
            msg: err
        });
    }

    findSql = `select id from user where username='${username}'`;
    try {
        const findResult = await db.query(findSql);
        if (findResult.length !== 0) {
            return res.send({
                code: RES_CODES.ERROR,
                msg: '用户名已存在'
            });
        }
    } catch (err) {
        res.status(500);
        return res.send({
            code: RES_CODES.ERROR,
            msg: err
        });
    }

    const userid = uuid.v1();
    const insertSql = `insert into user(id,username,phonenumber,email,password) values ('${userid}','${username}','${phonenumber}','${email}','${password}')`;
    try {
        await db.query(insertSql);
        return res.send({
            code: RES_CODES.SUCCESS,
            msg: '注册成功'
        });
    } catch (err) {
        res.status(500);
        return res.send({
            code: RES_CODES.ERROR,
            msg: err
        });
    }
})
module.exports = router;
