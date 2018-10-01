var mysql = require('mysql');

exports.getUser = function (req, res) {
  var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  var sql = `SELECT users.id,users_picture.users_picture,users.username,users.password,users.is_active,users_detail.*,users_type.type,users.users_types_id FROM users 
  INNER JOIN users_detail on users_detail.id = users.users_detail_id
  INNER JOIN users_type on users_type.id = users.users_types_id
  left join users_picture on users.id = users_picture.users_id `;

  con.query(sql,function(err,result){
    if(err) throw err ;
            res.json({ ok: true, status : result});
            con.end();
});
}

exports.upDateuser = function (req, res) {
  let id = req.body.id;
  let nationality_id =req.body.nationality_id;
  let province_id =req.body.province_id;
  let firstname =req.body.firstname;
  let lastname= req.body.lastname;
  let pathphoto = req.body.pathphoto;
  let lat = req.body.lat;
  let lng = req.body.lng;
  let email = req.body.email;
  let phone =req.body.phone;
  let address =req.body.address;
  let city= req.body.city;
  let postcode =req.body.postcode;
  let passport_number =req.body.passport_number;
  var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  var sql = `UPDATE users_detail SET nationality_id = ?,province_id = ?, firstname = ?, lastname = ?, pathphoto = ?, lat = ?, lng = ?, email = ?, phone = ?, address = ?, city = ?, postcode = ?, passport_number = ? WHERE id = ?;
  `;
  con.query(sql,[nationality_id,province_id,firstname,lastname,pathphoto,lat,lng,email,phone,address,city,postcode,passport_number,id],function(err,result){
    if(err) throw err ;
            res.json({ ok: true, status : result});
            con.end();
  });
}

exports.deLeteuser = function(req,res){
  var usersid = req.body.usersid;
  var is_active = req.body.is_active;
  var con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database : process.env.DB_NAME
  });
  var sql = `UPDATE users SET is_active='?' WHERE id=?`;
  con.query(sql,[is_active,usersid],function(err,result){
      if(err) throw err ;
              res.json({ ok: true, status : 'Complete'});
              con.end();
  });


}
exports.getConfigwork = function (req, res) {
  var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  var sql = `SELECT admin_configwork.*,configwork_status.status as s FROM admin_configwork
  left join configwork_status on admin_configwork.status = configwork_status.id`
  con.query(sql, function (err, result) {
    if(err) throw err ;
    res.json({ ok: true, status : result});
    con.end();
  });
}

exports.conFigwork = function (req, res) {
  let workstatus = req.body.workstatus;
  var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  var sql = "UPDATE admin_configwork SET status=? WHERE id=1";
  con.query(sql, [workstatus], function (err, result) {
    if(err) throw err ;
    res.json({ ok: true, status : 'Complete'});
    con.end();
  });
}

exports.getWork = function (req, res) {
  var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  var sql = `SELECT works.*,areas_picture.areas_picture,maps_picture.map_picture,users_detail.firstname firstname_r,users_detail.lastname lastname_r,b.firstname firstname_s,b.lastname lastname_s,transaction_detail.drone_id,informations.adress,informations.area_size,informations.latitude,informations.longtitude,informations.name_plants,informations.name_chemicals,informations.chemicals,workstatus.status,transaction_detail.datetime,transaction_detail.price FROM works
  INNER JOIN transaction_detail ON works.transaction_detail_id=transaction_detail.id
  INNER JOIN informations ON transaction_detail.informations_id = informations.id
  INNER JOIN workstatus ON works.workstatus_id = workstatus.id
  inner join users_detail on works.users_id_ranter = users_detail.id
  inner join users_detail b on works.users_id_service = b.id
  left join areas_picture on informations.id = areas_picture.informations_id
  left join maps_picture on informations.id = maps_picture.informations_id
  WHERE works.workstatus_id in(1,2)
  AND works.is_active in(2,2)
  order by works.workstatus_id asc`;
  con.query(sql,function (err, result) {
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
      con.end();
  }
  else{
      res.json({ ok: false, status: err });
      con.end();
  }
  });
}

exports.conFirmwork = function (req, res) {
  let transaction_id = req.body.transaction_id;
  let transaction_detail_id = req.body.transaction_detail_id;
  var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  var sql ="UPDATE works SET is_active=1 WHERE transaction_id=? AND transaction_detail_id = ?";
  con.query(sql, [transaction_id, transaction_detail_id], function (err, result) {
    if(err) throw err ;
    res.json({ ok: true, status : 'Complete'});
    con.end();
  });
}

exports.cenCalwork = function (req, res) {
  let transaction_id = req.body.transaction_id;
  let transaction_detail_id = req.body.transaction_detail_id;
  var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  var sql ="UPDATE works SET is_active=0 WHERE transaction_id=? AND transaction_detail_id = ?";
  con.query(sql, [transaction_id, transaction_detail_id], function (err, result) {
    if(err) throw err ;
    res.json({ ok: true, status : 'Complete'});
    con.end();
  });
}

