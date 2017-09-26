var mysql = require('mysql');
var gcm = require('node-gcm');



exports.sandmassage = function(usersid,state){

	var con = mysql.createConnection({
  		host: process.env.DB_HOST,
  		user: process.env.DB_USER,
  		password: process.env.DB_PASSWORD,
  		database : process.env.DB_NAME
	});

	var sql = "SELECT token FROM users_tokendevice WHERE users_id = ?";
	con.query(sql,[usersid],function(err,result){
		console.log(err);
		if(err)
		{	
			console.log(err);
			var message = new gcm.Message();
			if(state==1){
				message.addData('title', 'แจ้งเตือน');
				message.addData('message', 'ได้รับรายการเช่า');
				message.addData('content-available', true);
				message.addData('data', { "username": "Satit", "message": "Hello world" });
				// message.addData('notId', 2);
				// message.addData('image', 'http://res.cloudinary.com/demo/image/upload/w_133,h_133,c_thumb,g_face/bike.jpg');
				message.addData('image', 'http://www.pro.moph.go.th/w54/images/ICT/loadlogomoph.png');	
			}
			else{
				message.addData('title', 'แจ้งเตือน');
				message.addData('message', 'ได้รับการยืนยันแล้ว');
				message.addData('content-available', true);
				message.addData('data', { "username": "Satit", "message": "Hello world" });
				// message.addData('notId', 2);
				// message.addData('image', 'http://res.cloudinary.com/demo/image/upload/w_133,h_133,c_thumb,g_face/bike.jpg');
				message.addData('image', 'http://www.pro.moph.go.th/w54/images/ICT/loadlogomoph.png');	
			}
			
			

			var sender = new gcm.Sender('AAAAwnJv_gg:APA91bF2awph8l2fpkCWpLL-KAhtVFTVI77awA4COlrG9xRylk_7dvkG3c5rTtvNuWt2vKlsJvQvpAx6B2zmpelp0-5d3_O67NehuwYzAyIy8W8sdG1uwwCx8LBO4PlR_cffqVDe05y6');
			var regTokens = [];
			regTokens.push(result[0].token);
			console.log(regTokens);

			sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    		if(err) console.error(err);
    		else 	console.log(response); 
    		console.log("sandmassage complete");
			});
		}
    });
	con.end();
	
	
}

// Set up the sender with you API key, prepare your recipients' registration tokens. 
