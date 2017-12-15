var mysql = require('mysql');
var drone = require('./drone');
var massagenotification = require('./massagenotification');


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
    var sql =`  SELECT works.*,areas_picture.areas_picture,maps_picture.map_picture,users_detail.firstname firstname_r,users_detail.lastname lastname_r,b.firstname firstname_s,b.lastname lastname_s,transaction_detail.drone_id,informations.adress,informations.area_size,informations.lat,informationslng,informations.name_plants,informations.name_chemicals,informations.chemicals,workstatus.status,transaction_detail.datetime,transaction_detail.price FROM works
    INNER JOIN transaction_detail ON works.transaction_detail_id=transaction_detail.id
    INNER JOIN informations ON transaction_detail.informations_id = informations.id
    INNER JOIN workstatus ON works.workstatus_id = workstatus.id
    inner join users_detail on works.users_id_ranter = users_detail.id
    inner join users_detail b on works.users_id_service = b.id
    left join areas_picture on informations.id = areas_picture.informations_id
    left join maps_picture on informations.id = maps_picture.informations_id
    WHERE works.users_id_service = ?
    OR works.users_id_ranter = ?
    HAVING works.workstatus_id in(?,?)
    order by works.workstatus_id asc`;

    con.query(sql,[usersid,usersid,workstatus_id1,workstatus_id2],function(err,result){
    	 if (result!=null){
            var list = result;
            var j = 0;
            for (var i = 0; i < result.length; i++){
                var areasimg = result[j].areas_picture ? result[j].areas_picture.toString() : null;
                var mapimg = result[j].map_picture ? result[j].map_picture.toString() : null;
                list[j]["areasimg"] = areasimg;
                list[j]["mapimg"] = mapimg;
                j++
            }
            

            res.json({ ok: true, status: list });
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

    var sql ="UPDATE works SET workstatus_id=3, updated_by=? WHERE id=?";
    var sql1="SELECT transaction_detail_id FROM works where id = ?";
    var sql2="SELECT drone_id FROM transaction_detail where id =?";
    var sql3="SELECT users_types_id FROM users where id = ?";
    var sql4="SELECT users_id_service,users_id_ranter FROM works where id = ?";

    con.query(sql3,[usersid],function(err,result){
        if (result[0].users_types_id == 1) {
            con.query(sql4, [workid], function (err, result) {
                massagenotification.sandmassage(users_id_service, 3);
            }) 
        }
        else{
            massagenotification.sandmassage(users_id_service,3);
        }
    });

    con.query(sql1,[workid],function(err,result){
    	if(result[0]!=null){
    		result[0].transaction_detail_id
    		con.query(sql2,[result[0].transaction_detail_id],function(err,result){
    			if(result[0]!=null){
    				drone.upDatedrone(result[0].drone_id,'1');
                    
    				console.log("updatedrone")
    			}
    		});

    	}
    });
    con.query(sql,[usersid,workid],function(err,result){
        if(err) throw err;
        res.json({ ok: true, status : "cancel Complete"});
        
    });
   


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
	sql1 = "INSERT INTO works_review (users_id_ranter,works_id,rating,review,is_active,created_by,created_at) VALUES (?, ?, ?, ?, 1, ?, ?)";
	sql2=`SELECT transaction_detail.drone_id from works 
            inner join  transaction_detail on works.transaction_detail_id= transaction_detail.id
            where works.id = ?`
    con.query(sql,[users_id_service,workid],function(err,result){
        if(err) throw err;
    });
    con.query(sql1,[users_id_ranter,workid,rating,review,users_id_service,datetime],function(err,result){
    	if(err) throw err;
        res.json({ ok: true, status : "comPletework Complete"});
        
    });
    con.query(sql2,[workid],function(err,result){
        if(result[0]!=null){
           var droneid = result[0].drone_id;
           drone.upDatedrone(droneid,'1');
        }
    });




}
exports.getWorkreview = function(req,res){
    let users_id_ranter = req.body.users_id_ranter;
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    sql=`SELECT works_review.id,works_review.users_id_ranter,works_review.works_id,works_review.rating,works_review.review,users_detail.firstname,users_detail.lastname FROM works_review
        inner join works on works_review.works_id = works.id
        inner join users_detail on works.users_id_service = users_detail.id
        where works_review.users_id_ranter = '?' order by rating DESC`;

    con.query(sql,[users_id_ranter],function(err,result){
        if(err) throw err;
        res.json({ ok: true, status : result});
        con.end();
    });

}