var mysql = require('mysql');


exports.saveWork = function (users_id_service,users_id_ranter,transaction_id) {
	let workstatus_id = '1';
	let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let datetime = date+' '+time;
	var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql ="INSERT INTO works (users_id_service,users_id_ranter,transaction_id,workstatus_id,is_active,created_by,created_at) VALUES (?, ?, ?, ?, 1, ?, ?)";
    
    con.query(sql,[users_id_service,users_id_ranter,transaction_id,workstatus_id,users_id_service,datetime],function(err, result){
        if (err) throw err;
        	console.log("INSERT Work comple");
    });
}

exports.getWork = function(req,res){
	let usersid = req.body.usersid;
	var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql ="SELECT * FROM works WHERE users_id_service = ? or users_id_ranter =? ;"
    con.query(sql,[usersid],function(err,result){
    	if (result[0]!=null){
            res.json({ ok: true, status : result});
        }
        else{
        	res.json({ ok: false, status : "not Work"});
        }
    });

}

exports.upDatework = function(transactionid){
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql ="UPDATE works SET workstatus_id=2 WHERE transaction_id=?";
    con.query(sql,[transactionid],function(err,result){
        if (err) throw err;
            console.log("UPDATE Work comple");
        
    });
}