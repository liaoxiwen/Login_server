const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.all('*',function (req,res,next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
})
const login = require('./routes/login');
app.use(login);
const sign = require('./routes/sign');
app.use(sign);
app.listen(80);
