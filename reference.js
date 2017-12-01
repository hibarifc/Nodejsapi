var mysql = require('mysql');

exports.getNationality = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,nationality FROM nationality WHERE is_active = '1'";

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

exports.getProvincedrone = function (req, res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    
    var sql = `SELECT distinct users_detail.province_id,province.province FROM users_detail
    inner join province on users_detail.province_id = province.id
    inner join users on users_detail.id = users.users_detail_id
    where users.users_types_id = 2`;
    
    con.query(sql, function (err, result) {
        if (err){
            res.json({ ok: false, status : err});
         
        }
        else{
            res.json({ ok: true, status : result});
          
        }
    });
}
exports.getProvince = function (req,res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,province FROM province WHERE is_active = '1'";

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
    var sql = "SELECT id,status FROM drones_status WHERE is_active = '1'";

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
    var sql = "SELECT id,chanal FROM payment_chanal WHERE is_active = '1'";

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
    var sql = "SELECT id,status FROM payment_status WHERE is_active = '1'";
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
    var sql = "SELECT id,type FROM users_type WHERE is_active = '1'";

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
    var sql = "SELECT id,status FROM workstatus WHERE is_active = '1'";

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

exports.getPlant = function (req, res) {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT * FROM select_plants";
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

exports.getChemicals = function (req, res) {
    var plant_id = req.body.plant_id;
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = `SELECT select_chemicals.* FROM select_plants
                WHERE plant_id = ?`;
    con.query(sql,[plant_id], function (err, result) {
        if (err) {
            res.json({ ok: false, status: err });
                  
        }
        else {
            res.json({ ok: true, status: result });
                        
        }
    });
    con.end();
    
}