const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const sessionOption = require('./lib/sessionOption');
const path = require("path");
const bcrypt = require('bcrypt');
const session = require('express-session');

const db = require('./lib/db');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

app.listen(port, () => {
    console.log(`server port: ${port}`);
});

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);

app.use(session({  
	key: 'session_cookie_name',
    secret: '~',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/", (req,res) => {
    const id = req.body.userId;
    const password = req.body.userPassword;
    const sendData = {isLogin: ""};

    if(id && password){
        db.query(`SELECT * FROM userTable WHERE id='${id}' limit 1`, function(err, results, fileds){
            if(err) throw err;
            if(results.length > 0){
                bcrypt.compare(password, results[0].userchn, (err, isMatch) => {
                    if (isMatch === true) {
                        req.session.is_logined = true;
                        req.session.nickname = id;
                        req.session.save(function () {
                            sendData.isLogin = "True";
                            res.send(sendData);
                            alert('로그인 완료');
                        });
                    } else {
                        sendData.isLogin = "로그인 정보가 일치하지 않습니다.";
                        res.send(sendData);
                    }
                });
                
            } else{
                sendData.isLogin = "아이디 정보가 일치하지 않습니다."
                res.send(sendData);
            }
        });
    } else{
        sendData.isLogin = "아이디와 비밀번호를 입력하세요!"
        res.send(sendData)
    }
})