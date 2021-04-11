const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { RES_CODES } = require('../utils/Enum');

router.post('/editpwd',async function (req, res) {
    const { phonenumber: sessionPhoneNumber = null, verifyCode: sessionVerifyCode = null } = req.session.user;
    const { phonenumber: bodyPhoneNumber = null, verifyCode: bodyVerifyCode = null, password = null } = req.body;
    if (!sessionVerifyCode) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: '验证码已过期'
        });
    }
    if (sessionPhoneNumber !== bodyPhoneNumber) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: '手机号错误'
        });
    }
    if (sessionVerifyCode !== bodyVerifyCode) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: '验证码错误'
        });
    }
    const updateSql = `update user set password='${password}' where phonenumber='${bodyPhoneNumber}'`
    try {
        await db.query(updateSql);
        return res.send({
            code: RES_CODES.SUCCESS,
            msg: '修改成功'
        });
    }catch(err){
        res.status(500);
        return res.send({
            code: RES_CODES.ERROR,
            msg: err
        })
    }
})
module.exports = router;