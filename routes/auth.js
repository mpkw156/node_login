router.get("/auth", function(req, res, next){
    let email = req.query.email;
    let token = req.query.token;
    //token이 일치하면 테이블에서 email을 찾아 회원가입 승인 로직 구현
})