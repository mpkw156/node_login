const express = require('express');
const router = express.Router();
const models = require("../models");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


router.get('/sign_up', function(req, res, next) {
  res.render("user/signup");
});


router.post("/sign_up", function(req,res,next){
  let body = req.body;
  
  let inputPassword = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  let result = models.user.create({
    name: body.userName,
    email: body.userEmail,
    password: hashPassword,
    salt: salt
  })
  .then( result => {
    res.redirect("/users/sign_up");
  })
  .catch( err => {
    console.log(err)
  })
})

//메인 페이지
router.get('', function(req, res, next){
  res.send('오서오세요');
});

//로그인 GET
router.get('/login', function(req, res, next){
  
  //res.render("user/login");

  //세션을 이용한 로그인
  let session = req.session;

  res.render("user/login", {
    session: session
  });
});

//로그인 POST
router.post("/login", async function(req, res, next){
  let body = req.body;

  let result = await models.user.findOne({
    where: {
      email: body.userEmail
    }
  });

  let dbPassword = result.dataValues.password;
  let inputPassword = body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  if(dbPassword === hashPassword){
    console.log("비밀번호 일치");
    /*세션 설정
    req.session.email = body.userEmail;
    */
    
    //쿠키를 이용하여 로그인 유지
    res.cookie("user",body.userEmail , {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true//웹서버에서만 접근할 수 있는 플래그
    });//cookie(1,2,3) 1:쿠키의 이름 / 2: 쿠키의 값 / 3: 옵션
    
    res.redirect("/");
  }
  else{
    console.log("비밀번호 불일치");
    res.redirect("/users/login");
  }
});

router.post("/users/sign_up", function(req, res, next){
  let email = req.body.userEmail;

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'a5000star55@gmail.com',//gmail 계정 아이디 입력
      pass: 'gudehsdl12' // gmail 계정의 비밀번호를 입력
    }
  });

  let mailOptions = {
    from: 'a5000star55@gmail.com',//발송 메일 주소(위에 작성한 메일)
    to: email,//수신 메일 주소 
    subject: 'Sending Email using Node.js',//제목
    html: '<p>아래의 링크를 클릭해주세요 !</p>' +
      "<a href='http://localhost:3000/auth/?email="+ email +"&token=abcdefg'>인증하기</a>"
  };


  transporter.sendMail(mailOptions, function(error, info){//sendMail(1,2) 1: data 메일의 내용물에 대한 정의를 작성한 객체 전달 / 2: 콜백함수 정의
    if(error){
      console.log(error);
    }
    else{
      console.log('Email sent: ' + info.responde);
    }
  });

  res.redirect("/");
})


module.exports = router;