var mysql = require('mysql');

exports.addDrone = function (req,res) {
	// body...
	let users_id = req.body.users_id;
	let name = req.body.name;
	let size = req.body.size;
	let price = req.body.price;
	let pathpicture = req.body.pathpicture;
	let status = req.body.status;
	let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let datetime = date+' '+time;
    

	var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    var sql = "INSERT INTO drones(users_id,drones_status_id,is_active,created_by,created_at) VALUES (?, 1, 1, ?, ?)";
   	var sql1 = "INSERT INTO drones_detail(name,size,price,pathpicture,is_active,created_by,created_at) VALUES (?, ?, ?, ?, 1, ?, ?)";
   	var sql2 = "SELECT id FROM drones_detail WHERE id =(SELECT MAX(id) FROM drones_detail WHERE created_by = ?)";
   	var sql3 = "UPDATE drones SET drones_detail_id=? WHERE id=?";
    con.query(sql,[users_id,users_id,datetime],function(err, result){
        if (err) throw err;
            console.log("inserted drones ");
    });
    con.query(sql1,[name,size,price,pathpicture,users_id,datetime],function(err, result){
        if (err) throw err;
            console.log("inserted dronesdetail ");
    });
    con.query(sql2,[users_id],function(err, result){
        if (result[0]!=null){
        	var dronesdetailid = result[0].id;
        	console.log(dronesdetailid);
        	con.query(sql3,[dronesdetailid,dronesdetailid],function(err, result){
        		if (err) throw err;
            		console.log("Update drones ");
    		});

        }
    });



}