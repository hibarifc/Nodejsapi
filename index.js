/* โหลด Express มาใช้งาน */
var app = require('express')();
var bodyParser = require('body-parser');
require('dotenv').config();
var mysql = require('mysql');


var users = require('./users');
var drone = require('./drone');
var reference = require('./reference');
/* ใช้ port 7777 หรือจะส่งเข้ามาตอนรัน app ก็ได้ */
var port = process.env.PORT || 80;
//parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.set('view engine','ejs');


var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

con.connect(function(err){
	if(err) throw err;
		console.log("Connected!")
})

/* Routing */
app.get('/', function (req, res) {
    res.render('home');
    console.log('homestart ');
});

// --------------------------- Rout USER----------------------------
app.get('/user',function(req,res){
	res.json(users.findAll());
});
app.post('/user/register',function(req,res){
	users.reGister(req,res);
});
app.post('/user/login',function(req,res){
	users.logIn(req,res);
	console.log('login ');
});
app.post('/user/logout',function(req,res){
    users.logOut(req,res);
    console.log('logout ');
});
app.post('/user/updateuser',function(req,res){
	users.upDateuser(req,res);
});
// --------------------------------------------------------------

app.post('/drone/add',function(req,res){
    drone.addDrone(req,res);
});


// -------------------------------------------------------------------
app.get('/reference/nationality',function(req,res){
    reference.getNationality(req,res);
    console.log("nationality get");
});
app.get('/reference/province',function(req,res){
    reference.getProvince(req,res);
    console.log("getProvince ");
});
app.get('/reference/dronestatus',function(req,res){
    reference.getDronestatus(req,res);
    console.log("getDronestatus ");
});
app.get('/reference/paymentchanal',function(req,res){
    reference.getPaymentchanal(req,res);
    console.log("getPaymentchanal ");
});
app.get('/reference/paymentstatus',function(req,res){
    reference.getPaymentstatus(req,res);
    console.log("getPaymentstatus ");
});
app.get('/reference/userstype',function(req,res){
    reference.getUserstype(req,res);
    console.log("getUserstype ");
});
app.get('/reference/workstatus',function(req,res){
    reference.getWorkstatus(req,res);
    console.log("getWorkstatus ");
});
// -------------------------------------------------------------------


/* สั่งให้ server ทำการรัน Web Server ด้วย port ที่เรากำหนด */
app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});