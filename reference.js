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
        if(result[0]!=null){
        	res.send({ ok: false, status : result});
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
    var sql = "SELECT id,province FROM province";

    con.query(sql,function(err, result){
        if(result[0]!=null){
        	res.send({ ok: false, status : result});
        }
    });
}