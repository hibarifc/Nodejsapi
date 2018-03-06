var mysql = require('mysql');

exports.savePicture = function (req, res) {
    let picture = req.body.picture;
    let status = req.body.status;

	var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });
    sql = "INSERT INTO homes_picture (picture,status,is_active,created_by) VALUES (?,?, '1', 'admin')";

    con.query(sql, [picture, status], function (err, result) {
        if (err) throw err;
        res.json({ ok: true, status : "good"});
    });
    con.end();
}

exports.getPicturehome = function (req, res) {
    let status = req.body.status;
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    sql=`SELECT * FROM homes_picture
         where status = ?
         and is_active = 1`
    
    con.query(sql, [status], function (err, result) {
        if (result!=null){
            var list = result;
            var j = 0;
            for (var i = 0; i < result.length; i++){
                var homeimg = result[j].picture ? result[j].picture.toString() : null;
                list[j]["homeimg"] = homeimg;
                j++
            }
            

            res.json({ ok: true, status: list });
            con.end();
        }
        else{
            res.json({ ok: false, status: "no good" });
            con.end();
        }
    });
   
    
}
exports.DeletePicturehome = function (req, res) {
    let id = req.body.id;
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    });

    sql=`UPDATE homes_picture SET is_active='0' WHERE id=?;
    `
    
    con.query(sql, [id], function (err, result) {
        if (err) throw err;
        res.json({ ok: true, status: "good" });
        con.end();
    });
   
    
}