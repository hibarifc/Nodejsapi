var mysql = require('mysql');
var work = require('./work');
var drone = require('./drone');

exports.savePayment = function (req,res) {
	let transactionid = req.body.transactionid;
    let transaction_detail_id = req.body.transaction_detail_id;
    let users_id_ranter1 = req.body.users_id_ranter;
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

   	var sql ="SELECT transaction_detail.id,transaction_detail.users_id_service,transaction_detail.users_id_ranter,transaction.payment_chanal_id,transaction.amount FROM transaction INNER JOIN transaction_detail ON transaction.id=transaction_detail.transaction_id WHERE transaction.id = ? AND transaction_detail.users_id_ranter=?";
   	var sql1="INSERT INTO payment (transaction_id,transaction_detail_id,payment_status_id,payment_chanal_id,users_id_service,users_id_ranter,amount,is_active, created_by,created_at) VALUES ( ?,?, ?, ?, ?, ?, ?, 1, ?,?)";
    var sql2="SELECT drone_id FROM transaction_detail WHERE transaction_id=? AND users_id_ranter=?";
    var sql3 ="SELECT firstname,lastname FROM users_detail WHERE id =?";
    con.query(sql,[transactionid,users_id_ranter1],function(err,result){
    	if(result!=null){
            var array = result;
            for(i=0;i<array.length;i++){
        		var users_id_service=result[i].users_id_service;
        		var users_id_ranter =result[i].users_id_ranter;
        		var payment_chanal_id=result[i].payment_chanal_id;
        		var amount=result[i].amount;
                work.upDatework(transactionid,transaction_detail_id);
        		con.query(sql1,[transactionid,transaction_detail_id,payment_status_id,payment_chanal_id,users_id_service,users_id_ranter,amount,users_id_ranter,datetime],function(err,result){
        			if (err) throw err;
                		console.log("inserted payment ");


                		con.query(sql2,[transactionid,users_id_ranter1],function(err,result){
                			if(result!=null){
                				for(i=0;i<result.length;i++){
                					drone.upDatedrone(result[i].drone_id,'2');
                                    console.log(result[i].drone_id);


                				}

                			}
                		});
                        con.release();

        		});
                con.release();







                // con.query(sql3,[users_id_service],function(err,result){
                //     if(result[0]!=null){
                //        fistname_service = result[0].firstname;
                //        lastname_service = result[0].lastname;
                //         return fistname_service;
                //     }
                // });
                // con.query(sql3,[users_id_ranter],function(err,result){
                //     if(result[0]!=null){
                //         fistname_ranter = result[0].firstname;
                //        lastname_ranter  = result[0].lastname;
                //     }
                // });
             
            }
    	res.json({ ok: true, status : "OK"});
        
    	}
    });
    con.release();
}