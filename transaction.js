var mysql = require('mysql');
var work = require('./work');

exports.saveTransaction = function (req,res) {
	let users_id_service = req.body.users_id_service;
	let users_id_ranter = req.body.users_id_ranter;
	let transaction_detail = req.body.transaction_detail;
	let payment_chanal_id = req.body.payment_chanal_id;
	let amount = req.body.amount;
	let date = req.body.date;


    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "INSERT INTO transaction (users_id_service,users_id_ranter,payment_chanal_id,amount,is_active,created_by) VALUES (?, ?,?, ?, 1, ?)";
    var sql1 = "SELECT id FROM transaction WHERE users_id_service=? AND users_id_ranter =? AND amount= ? ORDER BY id DESC LIMIT 1 ";
    var sql2 = "INSERT INTO transaction_detail (drone_id,users_id_service,users_id_ranter,transaction_id,datetime,price,is_active,created_by) VALUES (?, ?, ?, ?, ?, ?, 1, ?)";
    var sql3 = "INSERT INTO informations (adress,area_size,name_plants,size_plants,is_active,created_by) VALUES (?, ?, ?, ?, 1, ?)";
    var sql4 = "SELECT id FROM informations WHERE adress = ? AND area_size=? AND name_plants=? AND size_plants =? AND  created_by=? ORDER BY id DESC LIMIT 1 ";
    var sql5 = "UPDATE transaction_detail SET informations_id=? WHERE drone_id=? AND users_id_service=? AND  users_id_ranter=? AND  transaction_id=? ";
    

    con.query(sql,[users_id_service,users_id_ranter,payment_chanal_id,amount,users_id_service],function(err, result){
        if (err) throw err;
        con.query(sql1,[users_id_service,users_id_ranter,amount],function(err, result){
	        if(result[0]!=null){
	        	var transactionid = result[0].id;
	        	for(i=0;i<transaction_detail.length;i++){
	        		let drone_id = transaction_detail[i].drones_id;
	        		let adress =  transaction_detail[i].adress;
	        		let area_size =  transaction_detail[i].area_size;
	        		let name_plants = transaction_detail[i].name_plants;
	        		let size_plants = transaction_detail[i].size_plants;
	        		let price  = transaction_detail[i].price;
	        		let date =  transaction_detail[i].date;
		        	con.query(sql2,[drone_id,users_id_service,users_id_ranter,transactionid,date,price,users_id_service],function(err, result){
		        		if (err) throw err;
		        		console.log("sql2");
	    			});
	    			con.query(sql3,[adress,area_size,name_plants,size_plants,users_id_service],function(err, result){
		        		if (err) throw err;
		        		console.log("sql3");
	    			});
	    			con.query(sql4,[adress,area_size,name_plants,size_plants,users_id_service],function(err, result){
	        			if(result[0]!=null){
	        				let id = result[0].id;
	        				con.query(sql5,[id,drone_id,users_id_service,users_id_ranter,transactionid],function(err, result){
	        					if (err) throw err;
	        					console.log("sql5");
    						});

	        			}
					});
				
		        }
		        //บันทึกลงตาราง work
		        work.saveWork(users_id_service,users_id_ranter,transactionid);
		        
		        //อัพเดทสถานะของโดรน
	        }
    	});
    });
}


