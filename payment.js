var mysql = require('mysql');
var work = require('./work');
var drone = require('./drone');

exports.savePayment = function (req,res) {
	let transactionid = req.body.transactionid;
	let payment_status_id = '1';
	let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let datetime = date+' '+time;

	var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

   	var sql ="SELECT transaction.users_id_service,transaction.users_id_ranter,transaction.payment_chanal_id,transaction.amount FROM thedrones.transaction INNER JOIN transaction_detail ON transaction.id=transaction_detail.transaction_id WHERE transaction.id = ?";
   	var sql1="INSERT INTO payment (transaction_id,payment_status_id,payment_chanal_id,users_id_service,users_id_ranter,amount,is_active, created_by,created_at) VALUES ( ?, ?, ?, ?, ?, ?, 1, ?,?)";
    var sql2="SELECT drone_id FROM transaction_detail WHERE transaction_id=?";
    con.query(sql,[transactionid],function(err,result){
    	if(result[0]!=null){
    		var users_id_service=result[0].users_id_service;
    		var users_id_ranter =result[0].users_id_ranter;
    		var payment_chanal_id=result[0].payment_chanal_id;
    		var amount=result[0].amount;
    		con.query(sql1,[transactionid,payment_status_id,payment_chanal_id,users_id_service,users_id_ranter,amount,users_id_ranter,datetime],function(err,result){
    			if (err) throw err;
            		console.log("inserted payment ");
            		work.upDatework(transactionid);

            		con.query(sql2,[transactionid],function(err,result){
            			if(result[0]!=null){
            				for(i=0;i<result.length;i++){
            					drone.upDatedrone(result[i].drone_id,'2');
           
            				}
            			
            			}
            		});
            		res.json({ ok: true, status : "OK"});
    		});
    		
    	}
    });
}