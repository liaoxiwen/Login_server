const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const { DOMAINS, RES_CODES, RES_MSGS, VALID_TIME } = require('../utils/Enum');
const db = require('../utils/database');
const { createcode } = require('../utils/createcode');
const router = express.Router();

router.use(session({
    name: 'codelogin',
    secret: 'login',
    resave: false,
    cookie: {
        domain: DOMAINS.LOCALHOST,
        maxAge: VALID_TIME.COOKIE_TIME
    },
    saveUninitialized: true
}));
router.post('/pwdlogin', function (req, res) {
    console.log(req.body);
    const { username = null, password = null } = req.body;
    const sql = `select * from user where username='${username}' and password='${password}'`;
    db.query(sql).then((response) => {
        if (response.length === 0) {
            res.send({
                code: RES_CODES.ERROR,
                msg: RES_MSGS.WRON_PWD
            });
        }
        const secret = 'logintoken';
        const token = jwt.sign({ username }, secret, { expiresIn: VALID_TIME.TOKEN_TIME });
        res.send({
            code: RES_CODES.SUCCESS,
            msg: RES_MSGS.LOGIN_SUCCESS,
            token,
        });
    }).catch((err) => {
        res.status(500);
        res.send(err);
    })
});

router.post('/codelogin', function (req, res) {
    const {
        username = null,
        phonenumber: sessionPhoneNumber = null,
        verifyCode: sessionVerifyCode = null
    } = req.session.user;
    const { phonenumber: bodyPhoneNumber = null, verifyCode: bodyVerifyCode = null } = req.body;
    if (!sessionVerifyCode) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: RES_MSGS.CODE_TIMEOUT
        });
    }
    if (bodyPhoneNumber !== sessionPhoneNumber) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: RES_MSGS.WRON_PHONE_NUMBER
        });
    }
    if (bodyVerifyCode !== sessionVerifyCode) {
        return res.send({
            code: RES_CODES.ERROR,
            msg: RES_MSGS.WRON_CODE
        });
    }
    const secret = 'logintoken';  // token密钥
    const token = jwt.sign({ username }, secret, { expiresIn: VALID_TIME.TOKEN_TIME });  // 生成token
    res.send({
        code: RES_CODES.SUCCESS,
        msg: RES_MSGS.LOGIN_SUCCESS,
        token
    });
})

router.post('/code', async function (req, res) {
    const { phonenumber:bodyPhoneNumber = null } = req.body;
    const sql = `select * from user where phonenumber='${bodyPhoneNumber}'`;
    try {
        var response = await db.query(sql);
    } catch (err) {
        res.status(500);
        res.send({ err });
    }
    if (response.length === 0) {
        res.send({
            code: RES_CODES.ERROR,
            msg: RES_MSGS.NO_USER
        });
    }
    const verifyCode = createcode(); // 生成验证码
    const { username = null, phonenumber = null } = response[0];
    const user = {
        username,
        phonenumber,
        verifyCode: md5(verifyCode)
    };
    req.session.user = user;  // 将验证码保存到session里面
    res.send({
        code: RES_CODES.SUCCESS,
        data: verifyCode
    });
})
module.exports = router;
