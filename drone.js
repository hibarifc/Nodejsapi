var mysql = require('mysql');

exports.addDrone = function (req,res) {
	// body...
	let users_id = req.body.users_id;
	let name = req.body.name;
	let size = req.body.size;
	let price = req.body.price;
	let drone_picture = req.body.drone_picture;
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
   	var sql1 = "INSERT INTO drones_detail(name,size,price,is_active,created_by,created_at) VALUES (?, ?, ?, 1, ?, ?)";
   	var sql2 = "SELECT id FROM drones_detail WHERE id =(SELECT MAX(id) FROM drones_detail WHERE created_by = ?)";
    var sql3 = "UPDATE drones SET drones_detail_id=? WHERE id=?";
    var sql4 = "INSERT INTO drones_picture (drone_id,drone_picture,is_active,created_by) VALUES (?,?,'1', 'system')";
    con.query(sql,[users_id,users_id,datetime],function(err, result){
        if (err) throw err;
            console.log("inserted drones ");
    });
   
    con.query(sql1,[name,size,price,users_id,datetime],function(err, result){
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
            con.query(sql4, [dronesdetailid,drone_picture], function (err, result) {
                if (err) throw err;
                console.log("inserted picturedrones ");
            });
            con.end();

        }
    });
    res.json({ ok: true, status : "Complete"});
   

}

exports.getDrone = function (req,res){
    let users_id = req.body.users_id;

    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    var sql = ` SELECT * FROM drones 
                INNER JOIN drones_detail ON drones.drones_detail_id=drones_detail.id 
                INNER JOIN drones_status ON drones.drones_status_id= drones_status.id
                WHERE drones.users_id = ? 
                AND drones.is_active = '1' 
                AND drones.drones_status_id ='1'`;
    con.query(sql,[users_id],function(err,result){
        if (result[0]!=null){
             res.json({ ok: true, status : result});
        }
        else{
            res.json({ ok: false, status : "not drone emptry"});
           
        }
    });
    con.end();
    

}

exports.upDatedrone = function(drone_id,drones_status_id){

    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    var sql ="UPDATE drones SET drones_status_id=? WHERE id=?;"

    con.query(sql,[drones_status_id,drone_id],function(err,result){
         if (err) throw err;
        console.log("upDatedrone");
    });
    con.end();
}


exports.getDroneall = function (req,res){
    let users_id = req.body.users_id;

    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    var sql = ` SELECT drones.id,drones.users_id,drones_picture.drone_picture,drones.drones_detail_id,drones.drones_status_id,drones_detail.name,drones_detail.size,drones_detail.price,drones_status.status FROM drones
    INNER JOIN drones_detail ON drones.drones_detail_id=drones_detail.id
    INNER JOIN drones_status ON drones.drones_status_id= drones_status.id
    left join drones_picture on drones.id = drones_picture.drone_id
    WHERE drones.users_id = ?
    AND drones.is_active = '1'`;
    con.query(sql,[users_id],function(err,result){
        if (result[0] != null) {
            var list = result;
            var j = 0;
            for (var i = 0; i < result.length; i++){
                var droneimg = result[j].drone_picture ? result[j].drone_picture.toString() : null;
                list[j]["droneimg"] = droneimg;
                j++
            }
            

            res.json({ ok: true, status: list });
            

        }
        else{
            res.json({ ok: false, status : "not drone emptry"});
           
        }
    });
    con.end();
    

}

exports.upDatedronedetail =function(req,res){
    let users_id = req.body.users_id;
    let drone_id = req.body.drone_id;
    let name = req.body.name;
    let size = req.body.size;
    let price = req.body.price;
    let pathpicture = req.body.pathpicture;
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let datetime = date+' '+time;
    console.log(req.body);

    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = `UPDATE drones_detail SET name=?, size=?, price=?,updated_by=? WHERE id=?`;
    var sql1 = `UPDATE drones_picture SET drone_picture=? WHERE id =?`
    var sql2 = "INSERT INTO drones_picture (drone_id,pathpicture,is_active,created_by) VALUES (?,?,'1',?)";
    var sql3 = "SELECT * FROM drones_picture where drone_id = ?"
    con.query(sql,[name,size,price,users_id,drone_id],function(err,result){
        if (err) throw err;
        console.log('UpdateDronedetail');
       
    });
    con.query(sql3, [drone_id], function (err, result) {
        if (result[0] != null) {
            var id = result[0].id;
            con.query(sql1, [pathpicture,drone_id], function (err, result) {
                console.log("UPDATEPic");
                console.log(pathpicture);
                res.json({ ok: true, status: 'UPDATEPic' });
                con.end(); 
            });
        }
        else {
            con.query(sql2,[drone_id,pathpicture,userid],function(err, result){
                console.log("InsertPic");
                con.end(); 
                res.json({ ok: true, status: 'InsertPic' });
            });
            
        }
    });
   

}

exports.deLetedrone =function(req,res){
    let users_id = req.body.users_id;
    let drone_id = req.body.drone_id;

    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });


    var sql ="UPDATE drones SET is_active=0,updated_by=? WHERE id=?";
    var sql1 = "SELECT * FROM drones where id =? and drones_status_id = 1";
    con.query(sql1,[drone_id],function(err,result){
         if (result[0]!=null){
               con.query(sql,[users_id,drone_id],function(err,result){
                    if (err) throw err;
                    console.log('deLetetdronetail');
                    res.json({ ok: true, status : "deLetetdronetail"});
                    con.end();

                });
        }
        else{
            res.json({ ok: false, status : " drone is not emptry"});
            con.end();
           
        }
    });
  
    


}