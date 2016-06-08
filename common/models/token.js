var app = require("../../server/server");
var jwt = require('jsonwebtoken');
var token_options = {algorithm: 'HS256',expiresIn: '1h'};

module.exports = function(Token) {

	
	Token.verify = function(token, cb) {		
		
		jwt.verify(token, user_id, process.env.SALT, function(err, decoded) {
				
			if(err){
				
				switch( true ){
				
				case( err && err.name == 'TokenExpiredError'):
					cb(true, 'Your session has expired.  Please log in again');
					break;
			
				default:
					 cb(true, 'Could not verify your session.'); 
					break;
				}
			}else{
				cb( false, decoded);
			}
		});
	};
	
Token.sign = function(data, cb) {
		
	jwt.sign(data, process.env.SALT, token_options, function(token) {

		cb(token);
	});
	
	};
}
