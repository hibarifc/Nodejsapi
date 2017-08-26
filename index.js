/* โหลด Express มาใช้งาน */
var app = require('express')();
var bodyParser = require('body-parser');
require('dotenv').config();
var mysql = require('mysql');


var users = require('./users');
/* ใช้ port 7777 หรือจะส่งเข้ามาตอนรัน app ก็ได้ */
// var port = process.env.PORT || 7777;
//parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// con.connect(function(err){
// 	if(err) throw err;
// 		console.log("Connected!")
// })

/* Routing */
app.get('/', function (req, res) {
    res.send('<h1>Hello Node.js</h1>');
    console.log('Starting node.js on port ');
});
app.get('/index', function (req, res) {
    res.send('<h1>This is index page</h1>');
});
app.get('/user',function(req,res){
	users.findAll();
});
app.post('/user/register',function(req,res){
	users.reGister(req,res);
});
app.get('/user/:id',function(req,res){
	var id = req.params.id;
	res.json(users.findById(id));
});

 
/* สั่งให้ server ทำการรัน Web Server ด้วย port ที่เรากำหนด */
// app.listen(port, function() {
//     console.log('Starting node.js on port ' + port);
// });