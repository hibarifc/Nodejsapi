var mysql = require('mysql');


exports.saveWork = function (users_id_service,users_id_ranter,transaction_id,transaction_detail_id) {
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
    var sql ="INSERT INTO works (users_id_service,users_id_ranter,transaction_id,transaction_detail_id,workstatus_id,is_active,created_by,created_at) VALUES (?,?, ?, ?, ?, 1, ?, ?)";
    
    con.query(sql,[users_id_service,users_id_ranter,transaction_id,transaction_detail_id,workstatus_id,users_id_service,datetime],function(err, result){
        if (err) throw err;
        	console.log("INSERT Work comple");
    });
    con.end();
}

exports.getWork = function(req,res){
	let usersid = req.body.usersid;
    let workstatus_id1 = req.body.workstatus_id1;
    let workstatus_id2 = req.body.workstatus_id2;

	var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql =`  SELECT * FROM works
                INNER JOIN transaction_detail ON works.transaction_detail_id=transaction_detail.id
                INNER JOIN informations ON transaction_detail.informations_id = informations.id
                INNER JOIN workstatus ON works.workstatus_id = workstatus.id
                WHERE works.users_id_service = ?
                or works.users_id_ranter =?
                AND workstatus_id = ? or workstatus_id = ?
                AND work.is_active = '1' `;

    con.query(sql,[usersid,usersid,workstatus_id1,workstatus_id2],function(err,result){
    	 if (result!=null){
            res.json({ ok: true, status : result});
        }
        else{
            res.json({ ok: false , status : err});
        }
    });
    con.end();

}

exports.upDatework = function(transactionid,transaction_detail_id){
    console.log(transactionid+' '+transaction_detail_id);
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql ="UPDATE works SET workstatus_id=2 WHERE transaction_id=? AND transaction_detail_id = ?";
    con.query(sql,[transactionid,transaction_detail_id],function(err,result){
        if (err) throw err;
            console.log("UPDATE Work comple");
            
        
    });
    con.end();
}

exports.canCelwork = function(req,res){
    let workid = req.body.workid;
    let usersid  = req.body.usersid;
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    sql ="UPDATE works SET workstatus_id=3, updated_by=? WHERE id=?";

    con.query(sql,[usersid,workid],function(err,result){
        if(err) throw err;
        res.json({ ok: true, status : "cancel Complete"});
    });
    con.end();


}

exports.comPletework = function(req,res){
	let workid =req.body.workid;
	let users_id_service = req.body.users_id_service;
	let users_id_ranter = req.body.users_id_ranter;
	let rating = req.body.rating;
	let review = req.body.review;
	let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let datetime = date+' '+time;



	var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

	sql ="UPDATE works SET workstatus_id=4, updated_by=? WHERE id=?";
	sql = "INSERT INTO works_review (users_id_ranter,works_id,rating,review,is_active,created_by,created_at) VALUES (?, ?, ?, ?, 1, ?, ?)";
	con.query(sql,[usersid,workid],function(err,result){
        if(err) throw err;
    });
    con.query(sql,[users_id_ranter,workid,rating,review,users_id_service,datetime],function(err,result){
    	if(err) throw err;
        res.json({ ok: true, status : "comPletework Complete"});
    });
    con.end();


}