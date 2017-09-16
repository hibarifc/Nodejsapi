var mysql = require('mysql');

exports.getNationality = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,nationality FROM nationality AND is_active = '1'";

    con.query(sql,function(err, result){
        if (err){
            res.json({ ok: false, status : err});
          
        }
        else{
            res.json({ ok: true, status : result});
           ;
        }
    });
    con.end();
}

exports.getProvince = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,province FROM province AND is_active = '1'";

    con.query(sql,function(err, result){
        if (err){
            res.json({ ok: false, status : err});
         
        }
        else{
            res.json({ ok: true, status : result});
          
        }
    });
    con.end();
}

exports.getDronestatus = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,status FROM drones_status AND is_active = '1'";

    con.query(sql,function(err, result){
         if (err){
            res.json({ ok: false, status : err});
         
        }
        else{
            res.json({ ok: true, status : result});
          
        }
    });
    con.end();
}

exports.getPaymentchanal = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,chanal FROM payment_chanal AND is_active = '1'";

    con.query(sql,function(err, result){
        if (err){
            res.json({ ok: false, status : err});
      
        }
        else{
            res.json({ ok: true, status : result});
           
        }
    });
    con.end();
}

exports.getPaymentstatus = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,status FROM payment_status AND is_active = '1'";

    con.query(sql,function(err, result){
       if (err){
            res.json({ ok: false, status : err});
        }
        else{
            res.json({ ok: true, status : result});
        }
    });
    con.end();
}

exports.getUserstype = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,type FROM users_type AND is_active = '1'";

    con.query(sql,function(err, result){
        if (err){
            res.json({ ok: false, status : err});

        }
        else{
            res.json({ ok: true, status : result});

        }
    });
    con.end();
}

exports.getWorkstatus = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,status FROM workstatus AND is_active = '1'";

    con.query(sql,function(err, result){
        if (err){
            res.json({ ok: false, status : err});
      
        }
        else{
            res.json({ ok: true, status : result});
            
        }
    });
    con.end();
}