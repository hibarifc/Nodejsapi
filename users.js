var mysql = require('mysql');
/* ฟังก์ชันสำหรับหา user ทั้งหมดในระบบ ในส่วนนี้ผมจะให้ส่งค่า users ทั้งหมดกลับไปเลย */

var users = [
{
    "id": 1,
    "username": "goldroger",
    "name": "Gol D. Roger",
    "position": "Pirate King"
},
{
    "id": 2,
    "username": "mrzero",
    "name": "Sir Crocodile",
    "position": "Former-Shichibukai"
},
{
    "id": 3,
    "username": "luffy",
    "name": "Monkey D. Luffy",
    "position": "Captain"
},
{
    "id": 4,
    "username": "kuzan",
    "name": "Aokiji",
    "position": "Former Marine Admiral"
},
{
    "id": 5,
    "username": "shanks",
    "name": "'Red-Haired' Shanks",
    "position": "The 4 Emperors"
}
];
exports.findAll = function(req,res) {
    return users;
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
    var sql = "SELECT id from users WHERE username=? AND password=? AND is_active = 1";
    var sql2 = "INSERT INTO user_status_history(users_id,login_time,is_active,created_by,created_at) VALUES (?,?,1,'system',?)";
    var sql3 = "SELECT id FROM user_status_history WHERE id =(SELECT MAX(id)FROM thedrones.user_status_history WHERE users_id =? )";
    var sql4 = "UPDATE users SET users_status_history_id = ? WHERE id = ?";
    con.query(sql,[username,password],function(err,result){
       
         if (result[0]!=null){
            let userid = result[0].id;
            con.query(sql2,[userid,datetime,datetime],function(err,result){
               if (err) throw err;
                console.log("history update");
            });
            con.query(sql3,[userid],function(err,result){

                if (result[0]!=null) {
                    let historyid = [result[0].id];
                    console.log(result[0].id);
                    con.query(sql4,[result[0].id,userid],function(err,result){
                        console.log("user update");
                    });
                }
                else{
                    console.log('file');
                }
            });
            console.log(userid);
            res.json({ ok: true, status : 'login'});
         }
         else{
            res.json({ ok: false, status : 'No login'});
         }
    });
}

