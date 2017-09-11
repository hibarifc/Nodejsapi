var mysql = require('mysql');

exports.getNationality = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,nationality FROM nationality";

    con.query(sql,function(err, result){
        if (err){
            res.json({ ok: false, status : err});
          
        }
        else{
            res.json({ ok: true, status : result});
           ;
        }
    });
    con.release();
}

exports.getProvince = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,province FROM province";

    con.query(sql,function(err, result){
        if (err){
            res.json({ ok: false, status : err});
         
        }
        else{
            res.json({ ok: true, status : result});
          
        }
    });
    con.release();
}

exports.getDronestatus = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,status FROM drones_status";

    con.query(sql,function(err, result){
         if (err){
            res.json({ ok: false, status : err});
         
        }
        else{
            res.json({ ok: true, status : result});
          
        }
    });
    con.release();
}

exports.getPaymentchanal = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,chanal FROM payment_chanal";

    con.query(sql,function(err, result){
        if (err){
            res.json({ ok: false, status : err});
      
        }
        else{
            res.json({ ok: true, status : result});
           
        }
    });
    con.release();
}

exports.getPaymentstatus = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,status FROM payment_status";

    con.query(sql,function(err, result){
       if (err){
            res.json({ ok: false, status : err});
         
        }
        else{
            res.json({ ok: true, status : result});
          
        }
    });
    con.release();
}

exports.getUserstype = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,type FROM users_type";

    con.query(sql,function(err, result){
        if (err){
            res.json({ ok: false, status : err});
            
        }
        else{
            res.json({ ok: true, status : result});
           
        }
    });
    con.release();
}

exports.getWorkstatus = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,status FROM workstatus";

    con.query(sql,function(err, result){
        if (err){
            res.json({ ok: false, status : err});
      
        }
        else{
            res.json({ ok: true, status : result});
            
        }
    });
    con.release();
}