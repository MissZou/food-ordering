var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    res.render('index', {
        title: '主页'
    });
});

router.get('/index', function(req, res) {
console.log(req.session.user)
    if (req.session.user) {
        res.render('index', {
            title: '主页',
            username: req.session.user.username
        });
    } else {
        res.render('index', {
            title: '主页',
            username: "请先登录"
        });
    }

});
router.get('/reg', function(req, res) {
    res.render('reg', {
        title: '注册'
    });
});
router.post('/reg', function(req, res) {
    var User = global.dbHandel.getModel('user');
    var uname = req.body.username,
        upwd = req.body.password,
        uemail = req.body.email,
        uphone = req.body.phone,
        uaddr = req.body.addr;
    console.log(uname)
    User.findOne({
        username: uname
    }, function(err, doc) { // 同理 /login 路径的处理方式
        if (err) {
            res.send(500);
            req.session.error = '网络异常错误！';
            console.log(err);
        } else if (doc) {
            req.session.error = '用户名已存在！';
            res.send(500);
        } else {
            User.findOne({
                email: uemail
            }, function(err, doc) { // start 2 同理 /login 路径的处理方式
                if (err) {
                    res.send(500);
                    req.session.error = '网络异常错误！';
                    console.log(err);
                } else if (doc) {
                    req.session.error = '邮箱地址已存在！';
                    res.send(500);
                } else { //start
                    User.create({ // 创建一组user对象置入model
                        username: uname,
                        password: upwd,
                        email: uemail,
                        phone: uphone,
                        addr: uaddr
                    }, function(err, doc) {
                        if (err) {
                            res.send(500);
                            console.log(err);
                        } else {
                            req.session.error = '创建成功！';
                            res.send(200);
                        }
                    });
                } //end
            }); //end2
        }
    });
});
router.get('/login', function(req, res) {
    res.render('login', {
        title: '登录'
    });
});
router.post('/login', function(req, res) {
    var User = global.dbHandel.getModel('user');
    var loginEmail = req.body.loginEmail;
    /*console.log(uname)
        //获取post上来的 data数据中 uname的值*/
    User.find({}, function(err, doc) {
        console.log(doc)
    })
    User.findOne({
        email: loginEmail
    }, function(err, doc) { //通过此model以用户名的条件 查询数据库中的匹配信息
        if (err) { //错误就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
            console.log(err);
        } else if (!doc) { //查询不到用户名匹配信息，则用户名不存在
            req.session.error = '邮箱不存在';
            res.send(404);
            console.log("用户名不存在") //    状态码返回404
                //    res.redirect("/login");
        } else {
            if (req.body.loginpassword != doc.password) { //查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.error = "密码错误";
                res.send(404);
                console.log("密码不对")
                    //    res.redirect("/login");
            } else { //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                    req.session.user = doc;
                    res.send(200);
                    console.log("content"+doc)
                    console.log("req.session.user "+req.session.user)
                    //res.redirect("/index");
            }
        }
    });
});
router.get('/post', function(req, res) {
    res.render('post', {
        title: '发表'
    });
});
router.post('/post', function(req, res) {});
router.get('/logout', function(req, res) {});


module.exports = router;
