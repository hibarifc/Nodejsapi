var mysql = require('mysql');
/* ฟังก์ชันสำหรับหา user ทั้งหมดในระบบ ในส่วนนี้ผมจะให้ส่งค่า users ทั้งหมดกลับไปเลย */


exports.getUserdetail = function(req,res) {
    let usersid = req.body.usersid;

    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    var sql = `SELECT users.*,users_detail.*,users_picture.users_picture FROM users 
    INNER JOIN users_detail ON users.users_detail_id=users_detail.id 
    left join users_picture on users.id = users_picture.users_id
    WHERE users.id = ?
    AND users.is_active = '1'`;
    con.query(sql,[usersid],function(err,result){
        if (result[0]!=null){
            var list = result;
            var j = 0;
            for (var i = 0; i < result.length; i++){
                var usersimg = result[j].users_picture ? result[j].users_picture.toString() : null;
                list[j]["usersimg"] = usersimg;
                j++
            }
            

            res.json({ ok: true, status: list });
        }
        else{
            res.json({ ok: false, status : "no good"});
        }
    });
    con.end();
 }

exports.getUser = function (req,res) {
    let province_id = req.body.province_id;
    let users_types_id = req.body.users_types_id;


    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    var sql = ` SELECT  users.*,users_detail.*,users_picture.users_picture FROM users 
                INNER JOIN users_detail ON users.users_detail_id=users_detail.id 
                left join users_picture on users.id = users_picture.users_id
                WHERE users_detail.province_id = ? 
                AND users.users_types_id = ?
                AND users.is_active='1'`;
    var sql1 = `SELECT ROUND(avg(rating),2)as avg FROM works_review
                where users_id_ranter= ?`;
    con.query(sql,[province_id,users_types_id],function(err, result){
        if (result[0] != null) {
            var list = result;
            var j = 0 
            for (i = 0; i < list.length; i++) {
                var usersimg = result[i].users_picture ? result[i].users_picture.toString() : null;
                list[i]["usersimg"] = usersimg;
                con.query(sql1, [list[i].id], function (err, result) {
                    var test = result;
                    i--
             
                    var rat = test[0].avg;
                    console.log(rat);
                    list[j]["Avg"] = rat;
                    console.log(i);
                    if (i == 0) {
                        res.json({ ok: true, status: list });
                        con.end();
                    }
                    j++
                    
                 
                    
                });
               
            } 
           

            
        }
         else{
            res.json({ ok: false, status : "no good"});
        }
    });
   
}
exports.getUsersall = function (req,res) {
    let users_types_id = req.body.users_types_id;

    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    var sql = ` SELECT  users.*,users_detail.* FROM users 
                INNER JOIN users_detail ON users.users_detail_id=users_detail.id 
                WHERE users.users_types_id = ?
                AND users.is_active='1'`;
    con.query(sql,[users_types_id],function(err, result){
        if (result[0]!=null){
            res.json({ ok: true, status : result});
        }
         else{
            res.json({ ok: false, status : "no good"});
        }
    });
    con.end();
}

exports.reGister = function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    let usertype = req.body.usertype;
    let email = req.body.email;
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let datetime = date+' '+time;
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    //ตรวจสอบว่ามีในฐานข้อมูลหือป่าว
    var check = "SELECT id from users WHERE username=?";
    var check1 = "SELECT id from users_detail WHERE email=?";
    con.query(check,[username],function(err,result){
            if (result[0]!=null)
            {
                console.log("username Not ready");
                res.json({ ok: false, status : ' username not ready'});
          
            }
            else{
                console.log("username is ready");
                con.query(check1,[email],function(err,result){
                    if(result[0]!=null){
                        console.log("email Not ready");
                        res.send({ ok: false, status : ' email not ready'});
                        
                    }
                    else{
                        console.log("email is ready");
                        //ฟังชันบันทึกข้อมูลลงฐานข้อมูล
                        var sql = "INSERT INTO users (users_types_id,username,password,is_active,created_by,created_at) VALUES (?,?,?,1,'system',?)";
                        var sql1 = "INSERT INTO users_detail (email,is_active,created_by,created_at) VALUES (?,1,'system',?)";
                        var sql2 = "SELECT id from users_detail WHERE email=?";
                        var sql3 = "UPDATE users SET users_detail_id = ? WHERE id = ? ";
                        con.query(sql,[usertype,username,password,datetime],function(err, result){
                            if (err) throw err;
                                console.log("inserted users ");
                        });
                      
                        con.query(sql1,[email,datetime],function(err, result){
                            if (err) throw err;
                                console.log("inserted users_detail");
                        });
                   
                        con.query(sql2,[email],function(err, result){
                            console.log(result[0].id);
                            if (err) throw err;
                                con.query(sql3,[result[0].id,result[0].id],function(err, result){
                                    if (err) throw err;
                                      console.log("update comple");
                                });
                                con.end();
                               
                        });
                        res.json({ ok: true, status : 'Complete'});
                       
                    }
                });
               
            }
    });
    
}

exports.logIn = function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let datetime = date+' '+time;
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT id,username,users_types_id from users WHERE username=? AND password=? AND is_active = 1";
    var sql2 = "INSERT INTO user_status_history(users_id,login_time,is_active,created_by,created_at) VALUES (?,?,1,'system',?)";
    var sql3 = "SELECT id FROM user_status_history WHERE id =(SELECT MAX(id)FROM user_status_history WHERE users_id =? )";
    var sql4 = "UPDATE users SET users_status_history_id = ? WHERE id = ?";
    con.query(sql,[username,password],function(err,result){
       
         if (result[0]!=null){
            let userid = result[0].id;
            let username = result[0].username;
            let type = result[0].users_types_id;
            con.query(sql2,[userid,datetime,datetime],function(err,result){
               if (err) throw err;
                console.log("history update");
            });
            
            con.query(sql3,[userid],function(err,result){

                if (result[0]!=null) {
                    let historyid = result[0].id;
                    console.log(result[0].id);
                    con.query(sql4,[result[0].id,userid],function(err,result){
                        console.log("user update");
                    });
                    con.end();
                    
                }
                else{
                    console.log('file');
                }
            });
           
            console.log(userid);
            res.json({ ok: true, status : 'login',userid : userid,username : username ,type :type });
            
         }
         else{
            res.json({ ok: false, status : 'No login'});
            
         }
    });
   
}


exports.logOut = function (req,res) {
    let userid = req.body.userid;
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let datetime = date+' '+time;
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    var sql = "SELECT id FROM user_status_history WHERE id =(SELECT MAX(id)FROM user_status_history WHERE users_id =? )";
    var sql1 = "UPDATE user_status_history SET logout_time=? WHERE id=?";
    con.query(sql,[userid],function(err,result){
         if (result[0]!=null) {
            var historyid = result[0].id;
            con.query(sql1,[datetime,historyid],function(err,result){
                console.log("user logout");
                 res.json({ ok: true, status : 'logout'});
            });
            con.end();
         }
          else{
            res.json({ ok: false, status : "no good"});
            }
        console.log("user update");
    });
    
}

exports.upDateuser = function (req,res) {
    let userid = req.body.userid;
    let nationality_id =req.body.nationality_id;
    let province_id =req.body.province_id;
    let firstname =req.body.firstname;
    let lastname= req.body.lastname;
    let pathphoto = req.body.pathphoto;
    let lat = req.body.lat;
    let lng = req.body.lng;
    let users_picture = req.body.users_picture;
    let phone =req.body.phone;
    let address =req.body.address;
    let city= req.body.city;
    let postcode =req.body.postcode;
    let passport_number =req.body.passport_number;
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = "SELECT users_detail_id from users WHERE id=?";
    var sql1 = "UPDATE users_detail SET nationality_id=?, province_id=?, firstname=?, lastname=?, pathphoto=?,lat=?,lng=?,phone=?, address=?,city=?,postcode=?,passport_number=? WHERE id=?";
    var sql2 = "INSERT INTO users_picture (users_id,users_picture,is_active,created_by) VALUES (?,?,'1',?)";
    var sql3 = "SELECT * FROM users_picture where users_id = ?"
    var sql4 = "UPDATE users_picture SET users_picture=?,updated_by=? where id=? "
    con.query(sql,[userid],function(err,result){
         if (result[0]!=null){
            var usersdetailid =result[0].users_detail_id;
            con.query(sql1,[nationality_id,province_id,firstname,lastname,pathphoto,lat,lng,phone,address,city,postcode,passport_number,userid],function (err,result) {
                console.log("updateuserdetail");
             });
            con.query(sql3, [userid], function (err, result) {
                if (result != null) {
                    con.query(sql4, [users_picture, userid,userid], function (err, result) {
                        console.log("UPDATEPic");
                        console.log(users_picture);
                        res.json({ ok: true, status: 'UpdateComplete' });
                        con.end(); 
                    });
                }
                else {
                    con.query(sql2,[userid,users_picture,userid],function(err, result){
                        console.log("InsertPic");
                        con.end(); 
                        res.json({ ok: true, status: 'UpdateComplete' });
                    });
                    
                }
            });
         }
         else{
             res.json({ ok: false, status : 'error'});
         }
    });
    
}

exports.addToken = function(req,res){
    let usersid  = req.body.usersid;
    let token = req.body.token;

    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql1="SELECT users_id FROM users_tokendevice where users_id = ?";
    var sql2="UPDATE users_tokendevice SET token=?  WHERE id=?";
    var sql="INSERT INTO users_tokendevice (users_id,token,is_active,created_by) VALUES (?,?,1,?)";
    con.query(sql1,[usersid],function(err,result){
        console.log(result);
        if (result[0]!=null){
            con.query(sql2,[token,usersid],function(err,result){
                if(err) throw err ;
                    res.json({ ok: true, status : 'updateComplete'});
                    con.end();
            });

        }
        else{
        con.query(sql,[usersid,token,usersid],function(err,result){
            if(err) throw err ;
                res.json({ ok: true, status : 'Complete'});
                con.end();
        });

        }
    });

   
}

exports.getUserall = function(req,res){
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql=`SELECT users.id,users_picture.users_picture,users.username,users.password,users.is_active,users_detail.nationality_id,users_detail.province_id,users_detail.firstname,users_detail.lastname,users_detail.email,users_detail.phone,users_detail.address,users_detail.city,users_detail.postcode,users_detail.passport_number,users_type.type,users.users_types_id FROM users 
              INNER JOIN users_detail on users_detail.id = users.users_detail_id
              INNER JOIN users_type on users_type.id = users.users_types_id
              left join users_picture on users.id = users_picture.users_id
              where users.users_types_id = 2`;
    var sql1 = `SELECT ROUND(avg(rating),2)as avg FROM works_review
              where users_id_ranter= ?`;

    con.query(sql,function(err,result){
        if (result[0]!=null){
            var list = result;
            var j = 0
            for (i = 0; i < list.length; i++) {
                var usersimg = result[i].users_picture ? result[i].users_picture.toString() : null;
                list[i]["usersimg"] = usersimg;
                console.log(j);
                con.query(sql1, [list[i].id], function (err, result) {
                    
                    var test = result;
                    i--
                   
                    var rat = test[0].avg;
                    
                    list[j]["Avg"] = rat;
                   
                    if (i == 0) {
                        res.json({ ok: true, status: list });
                        con.end();
                    }
                    j++
                    
                 
                    
                });
               
            } 
        }
        else{
            res.json({ ok: false, status : "no good"});
        }
       
    });
}

exports.deLeteuser = function(req,res){
    var usersid = req.body.usersid;
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    var sql = `UPDATE users SET is_active='0' WHERE id=?`;
    con.query(sql,[usersid],function(err,result){
        if(err) throw err ;
                res.json({ ok: true, status : 'Complete'});
                con.end();
    });


}

