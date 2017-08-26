var mysql = require('mysql');
/* ฟังก์ชันสำหรับหา user ทั้งหมดในระบบ ในส่วนนี้ผมจะให้ส่งค่า users ทั้งหมดกลับไปเลย */
exports.findAll = function(req,res) {
    var check = "SELECT * from users";
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    con.query(check,function(err, result){
         let customers = [];
         result.forEach(v => {
        let user = {};
        user.id = v.id;
        user.username = v.username;
        user.password = v.password;
        customers.push(user);
      })
      res.send({ ok: true, result: customers });
    });
};
 
/* ฟังก์ชันสำหรับหา user จาก id ในส่วนนี้เราจะวน loop หา users ที่มี id ตามที่ระบุแล้วส่งกลับไป */
exports.findById = function (id) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) return users[i];
    }
};

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
                res.send({ ok: false, username : 'not ready'});
            }
            else{
                console.log("username is ready");
                con.query(check1,[email],function(err,result){
                    if(result[0]!=null){
                        console.log("email Not ready");
                        res.send({ ok: false, email : 'not ready'});
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
                        });
                        res.send({ ok: true, status : 'Complete'});
                    }
                });
            }
    });





}