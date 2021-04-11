module.exports = {
    DOMAINS: {
        LOCALHOST: '127.0.0.1'
    },

    RES_CODES: {
        SUCCESS: 0,
        ERROR: 1
    },

    RES_MSGS: {
        LOGIN_SUCCESS: '登录成功',
        NO_USER: '用户不存在',
        CODE_TIMEOUT: '验证码已过期',
        WRON_PHONE_NUMBER: '手机号错误',
        WRON_CODE: '验证码错误',
        WRON_PWD: '账号或密码错误'
    },

    VALID_TIME: {
        COOKIE_TIME: 15 * 60 * 1000,
        TOKEN_TIME: 15 * 60 * 1000
    }
}
