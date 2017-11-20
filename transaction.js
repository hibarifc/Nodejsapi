var mysql = require('mysql');
var work = require('./work');
var drone = require('./drone');
var massagenotification = require('./massagenotification');

exports.saveTransaction = function (req,res) {
	let users_id_service = req.body.users_id_service;
	let transaction_detail = req.body.transaction_detail;
	let payment_chanal_id = req.body.payment_chanal_id;
	let map_picture = req.body.maps_picture;
	let area_picture = req.body.areas_picture;
	let amount = req.body.amount;
	let date = req.body.date;
	let date1 = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let datetime = date1+' '+time;
    console.log(transaction_detail);
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "INSERT INTO transaction (users_id_service,payment_chanal_id,amount,is_active,created_by,created_at) VALUES (?,?, ?, 1, ?,?)";
    var sql1 = "SELECT id FROM transaction WHERE users_id_service=?  AND amount= ? ORDER BY id DESC LIMIT 1 ";
    var sql2 = "INSERT INTO transaction_detail (drone_id,users_id_service,users_id_ranter,transaction_id,datetime,price,is_active,created_by,created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?,?)";
    var sql3 = "INSERT INTO informations (adress,area_size,name_plants,name_chemicals,chemicals,is_active,created_by,created_at) VALUES (?, ?,?,?, ?, 1, ?,?)";
    var sql4 = "SELECT id FROM informations WHERE adress = ? AND area_size=? AND name_plants=? AND size_plants =? AND  created_by=? ORDER BY id DESC LIMIT 1 ";
    var sql5 = "UPDATE transaction_detail SET informations_id=? WHERE drone_id=? AND users_id_service=? AND  users_id_ranter=? AND  transaction_id=? ";
    var sql6 = "SELECT id FROM transaction_detail WHERE transaction_id=?";
		var sql7 = "INSERT INTO areas_picture (informations_id,areas_picture,is_active,created_by) VALUES ('?','?','1', '?')"
		var sql8 = "INSERT INTO maps_picture (informations_id,map_picture,is_active,created_by) VALUES ('?','?','1', '?')"
	
	
	con.query(sql, [users_id_service, payment_chanal_id, amount, users_id_service, datetime], function (err, result) {
        if (err) throw err;
        con.query(sql1,[users_id_service,amount],function(err, result){
	        if(result!=null){
	        	var transactionid = result[0].id;
	        	for(i=0;i<transaction_detail.length;i++){

	        		let users_id_ranter = transaction_detail[i].users_id_ranter;
	        		let drone_id = transaction_detail[i].drones_id;
	        		let adress =  transaction_detail[i].adress;
	        		let area_size =  transaction_detail[i].area_size;
	        		let name_plants = transaction_detail[i].name_plants;
	        		let size_plants = transaction_detail[i].size_plants;
	        		let price  = transaction_detail[i].price;
	        		let date =  transaction_detail[i].date;
	        		massagenotification.sandmassage(users_id_ranter,1);
		        	con.query(sql2,[drone_id,users_id_service,users_id_ranter,transactionid,date,price,users_id_service,datetime],function(err, result){
		        		if (err) throw err;
		        		console.log("sql2");
	    			});

	    			con.query(sql3,[adress,area_size,name_plants,size_plants,users_id_service,datetime],function(err, result){
		        		if (err) throw err;
		        		console.log("sql3");
	    			});

	    			con.query(sql4,[adress,area_size,name_plants,size_plants,users_id_service],function(err, result){
	        			if(result!=null){
	        				let id = result[0].id;
									con.query(sql5, [id, drone_id, users_id_service, users_id_ranter, transactionid], function (err, result) {
										if (err) throw err;
										console.log("sql5");
									});
									con.query(sql7, [id, area_picture,users_id_service], function (err, result) {
										if (err) throw err;
										console.log("sql7");
									});
									con.query(sql8, [id, map_picture,users_id_service], function (err, result) {
										if (err) throw err;
										console.log("sql8");
									});

	        			}
					});

					con.query(sql6,[transactionid],function(err,result){
						if(result!=null){
							for(i=0;i<result.length;i++)
								var transaction_detail_id = result[i].id;
								work.saveWork(users_id_service,users_id_ranter,transactionid,transaction_detail_id);
						}
					});

					  //อัพเดทสถานะของโดรน
					drone.upDatedrone(drone_id,'3');

		        }

		        res.json({ ok: true, status : "OK"});

		        //บันทึกลงตาราง work



	        }
    	});


    });
}

exports.updDatedinformation = function(req,res){
	let transaction_detail_id = req.body.transaction_detail_id;
	let adress =  req.body.adress;
	let area_size =  req.body.area_size;
	let name_plants = req.body.name_plants;
	let size_plants = req.body.size_plants;
	let date =  req.body.date;
	var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
   	var sql="SELECT informations_id FROM transaction_detail where id = ?";
    var sql2 ="UPDATE informations SET adress=?,area_size=?, name_plants=?,size_plants=? WHERE id=?";
    con.query(sql,[transaction_detail_id],function(err,result){
    	if(result[0]!=null){
    		con.query(sql,[adress,area_size,name_plants,size_plants,result[0].informations_id],function(err,result){
    			if (err) throw err;
		        console.log("sql2");
		        res.json({ ok: true, status : "OK"});
		        con.end();
   			 });

    	}
    	else{
    		res.json({ ok: false, status : "not ok!!"});
    	}
    });
    
}


