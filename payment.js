var mysql = require('mysql');

exports.savePayment = function (req,res) {
	let transactionid = req.body.transactionid;
	let payment_status_id = '1';

	var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    var sql ="SELECT transaction.users_id_service,transaction.users_id_ranter,transaction.payment_chanal_id,transaction.amount FROM thedrones.transaction INNER JOIN transaction_detail ON transaction.id=transaction_detail.transaction_id WHERE transaction.id = ?";
    con.qury(sql,[transactionid],function(err,result){
    	if(result[0]!=null){
    		var users_id_service=result[0].users_id_service;
    		var users_id_ranter =result[0].users_id_ranter;
    		var payment_chanal_id=result[0].payment_chanal_id;
    		var amount=result[0].amount;
    	}
    });
}