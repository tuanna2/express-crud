var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mysql =require('mysql');
const rd = require("randomstring");
var session = require('express-session'); 
app.use(session({
    secret: 'helloworld',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:1000*60*30 }
  })) ; 

    app.use(express.static('views')); //css,img,... trong folder views
    
    app.set("view engine","ejs"); //ejs
    app.set("views","./views"); //trong views

    var con = mysql.createConnection({
        host: "localhost",
        user: "tuanna2",
        password: "anhtuan",
        database: "contacto"
    });
    con.connect(function(err){
        if(err) throw err;
    });
    var sql="CREATE TABLE IF NOT EXISTS customer (`id` VARCHAR(15) NOT NULL, `name` VARCHAR(45), `age` INT(3),  PRIMARY KEY (`id`));";
        con.query(sql,function(err){
            if (err) throw err;
    });    
    var sql1="CREATE TABLE IF NOT EXISTS user (`STT` INT UNSIGNED NOT NULL AUTO_INCREMENT,`Username` VARCHAR(45) NOT NULL,`Age` VARCHAR(45) NOT NULL,`Email` VARCHAR(45) NOT NULL,`Password` VARCHAR(45) NOT NULL,PRIMARY KEY (`STT`));";
        con.query(sql1,function(err){
        if (err) throw err;
    });   
  
    app.get("/home",function(req,res){
        if(req.session.iduser){
            con.query("select * from customer;",function(err,results){
                if (err) throw err;
            
            res.render("home",{results});
            });
        }
        else
            return res.render("login",{err: "Vui long dang nhap lai!"});
    });
    
    app.get("/add",function(req,res){
        if(req.session.iduser){
            return res.render("add");}
        return res.render("login",{err: "Vui long dang nhap lai!"});
    });
    app.post("/add/added",urlencodedParser,function(req,res){
        var id= rd.generate(10);
        var ten=req.body.name;
        var tuoi=req.body.age;
        var sql="insert into customer(id,name,age) values('"+id+"','"+ten+"','"+tuoi+"');";
        con.query(sql,function(err){
            if(err) throw err;
            console.log("them thanh cong");
        });
        res.redirect("/home");
    });
    app.get("/delete/:id",function(req,res){
        var delid=req.params.id;
        var sql="delete from customer where id='"+delid+"';";
        con.query(sql,function(err){
            if(err) throw err;
            console.log("xoa thanh cong");
        });
        res.redirect("/home");
    });
    app.get("/update/:id",function(req,res){
        var sql="select * from customer where id='"+req.params.id+"';";
        con.query(sql,function(err,results){
            if(err) throw err;
            res.render("update",{results});
        });
        
    });
    app.post("/update/:id",urlencodedParser,function(req,res){
        var newname=req.body.newname;
        var newage=req.body.newage;
        var sql="update customer set name='"+newname+"',age='"+newage+"' where id ='"+req.params.id+"';";
        con.query(sql,function(err){
            if (err) throw err;
            console.log("update thanh cong");
        });
        res.redirect("/home");
    });
    app.get("/detail/:id",function(req,res){
        var sql="select * from customer where id='"+req.params.id+"';";
        con.query(sql,function(err,results){
            if(err) throw err;
            res.render("detail",{results});
        });
    });
    app.get("/",function(req,res){
        if(req.session.iduser){
            return res.redirect("/home");
        }
        res.render("login",{err: ''});
    });
    app.post("/login",urlencodedParser,function(req,res){
        var name=req.body.name;
        var pass=req.body.pass;
        var sql="select * from user where Username='"+name +"' AND Password='"+pass+"';";
        con.query(sql,function(err,results){
            if(err || results.length==0)
                res.render("login", {err: "Incorrect username or password!"});
            else{
                req.session.iduser=name;
                res.redirect("/home");
            }
        });
    });
    app.get("/logout",function(req,res){
        if (req.session.iduser) {
            req.session.destroy(); 
          }
          return res.redirect('/');
    });
    app.post("/signup",urlencodedParser,function(req,res){
        var newName= req.body.newName;
        var newAge=req.body.newAge;
        var newEmail=req.body.newEmail;
        var newPassword=req.body.newPassword;
        var sql="insert into user(Username,Age,Email,Password) values('"+newName+"','"+newAge+"','"+newEmail +"','"+newPassword+"');";
        con.query(sql,function(err){
            if(err) throw err;
            console.log("Tao acc thanh cong");
        });
        res.redirect("/");
    });

app.listen(8080, function () {
    
});
