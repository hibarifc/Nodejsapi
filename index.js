/* โหลด Express มาใช้งาน */
var app = require('express')();
var bodyParser = require('body-parser');
require('dotenv').config();
var mysql = require('mysql');
var mailer = require("nodemailer");

var massagenotification = require('./massagenotification');
var transaction = require('./transaction');
var users = require('./users');
var drone = require('./drone');
var reference = require('./reference');
var work = require('./work');
var payment = require('./payment');
var home = require('./home.js');
var admin = require('./admin.js');

var port = process.env.PORT || 7777;
//parse
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

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

// con.connect(function(err){
// 	if(err) throw err;
// 		console.log("Connected!")
// });


/* Routing */
app.get('/', function (req, res) {
    res.render('home');
    console.log('homestart ');
});

// --------------------------- Rout USER----------------------------
app.post('/user/getuserdetail',function(req,res){
	users.getUserdetail(req,res);
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
app.post('/user/getuser',function(req,res){
    users.getUser(req,res);
});
app.post('/user/addtoken',function(req,res){
    users.addToken(req,res);
});
app.get('/user/getuserall',function(req,res){
    users.getUserall(req,res);
});
app.get('/user/deleteuser',function(req,res){
    users.deLeteuser(req,res);
});
app.post('/user/getusersall',function(req,res){
    users.getUsersall(req,res);
});

app.get('/user/activeemail/:usersid',function(req,res){
    users.acTiveemail(req,res);

});
//----------------------Admin----------------------------
app.post('/admin/configwork',function(req,res){
    admin.conFigwork(req,res);
});
app.post('/admin/confirmwork',function(req,res){
    admin.conFirmwork(req,res);
});
app.post('/admin/cencalwork',function(req,res){
    admin.cenCalwork(req,res);
});
app.get('/admin/getwork',function(req,res){
    admin.getWork(req,res);
});
app.get('/admin/getuser',function(req,res){
    admin.getUser(req,res);
});
app.get('/admin/getconfigwork',function(req,res){
    admin.getConfigwork(req,res);
});
app.post('/admin/deleteuser',function(req,res){
    admin.deLeteuser(req,res);
});

// ------------------------DRONE-------------------------

app.post('/drone/add',function(req,res){
    drone.addDrone(req,res);
});
app.post('/drone/getdrone',function(req,res){
    drone.getDrone(req,res);
});
app.post('/drone/getdroneall',function(req,res){
    drone.getDroneall(req,res);
});
app.post('/drone/updatedronedetail',function(req,res){
    drone.upDatedronedetail(req,res);
});
app.post('/drone/deletetdrone',function(req,res){
    drone.deLetedrone(req,res);
});
app.post('/drone/getdatedrone',function(req,res){
    drone.getdatedrone(req,res);
});

// ------------------------------GET REFERENCE---------------------

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
app.get('/reference/getprovincedrone',function(req,res){
    reference.getProvincedrone(req,res);
    console.log("getProvincedrone ");
});

app.get('/reference/getplant',function(req,res){
    reference.getPlant(req,res);
    console.log("getPlant ");
});
app.post('/reference/getchemicals',function(req,res){
    reference.getChemicals(req,res);
    console.log("getChemicals ");
});




// -----------------------transaction-------------------------------
app.post('/transaction/save',function(req,res){
    transaction.saveTransaction(req,res);
    console.log("saveTransaction ");
});
app.post('/transaction/upddatedinformation',function(req,res){
    transaction.updDatedinformation(req,res);
    console.log("updDatedinformation ");
});
//-------------------------work----------------------------------

app.post('/work/getwork',function(req,res){
    work.getWork(req,res);
    console.log("getwork ");
});
app.post('/work/cancelwork',function(req,res){
    work.canCelwork(req,res);
    console.log("cancelwork ");
});
app.post('/work/completework',function(req,res){
    work.comPletework(req,res);
    console.log("comPletework ");
});
app.post('/work/getworkreview',function(req,res){
    work.getWorkreview(req,res);
    console.log("getWorkreview ");
});

//-------------------------payment-----------------------------
app.post('/payment/savepayment',function(req,res){
    payment.savePayment(req,res);
    console.log("savepayment ");
});
//------------------------Home-------------------------------------
app.post('/home/savepicture', function (req, res) {
    home.savePicture(req, res);
    console.log("savePicture ");
});
app.post('/home/getpicturehome', function (req, res) {
    home.getPicturehome(req, res);
    console.log("getPicture ");
});
app.post('/home/deletepicturehome', function (req, res) {
    home.DeletePicturehome(req, res);
    console.log("deletepicturehome ");
});
    //-------------------------test แจ้งเตือน-------------------------------
    // app.post('/open', (req, res) => {
  
    //   /*insert token to DB*/
    //   let token = req.body.token.registrationId;
    //   console.log(JSON.stringify(token));
    //   send(token);
    // });

    // app.get('/send', (req, res) => {
    //   let token = 'XXXXXXXXXXXXX'; //token
    //   send(token);
    //   res.send("send notification");
    // });
    /* สั่งให้ server ทำการรัน Web Server ด้วย port ที่เรากำหนด */
    app.listen(port, function () {
        console.log('Starting node.js on port ' + port);
    });

