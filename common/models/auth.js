var app = require("../../server/server");
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

module.exports = function(Auth) {
		
	Auth.signIn = function(req, cb) {
		
		var Token = app.models.Token;
		var Cart = app.models.Cart;
		var Postgres = app.models.Postgresql;
		var query = 'SELECT "userId", crypted_password = crypt(\''
				+ req.body.password
				+ '\', crypted_password) AS is_match FROM "User" WHERE email = \''
				+ req.body.email + '\'';

		Postgres.query(query, function(err, dbResult) {
			
			if (err) {

				cb({
					error : true,
					errorMessage : 'Error Logging In User'
				});
			} else {

				if (typeof dbResult.data[0] !== 'undefined'
						&& dbResult.data[0].is_match === true) {
					
					Cart.createCart({"userId": dbResult.data[0].userId, "cartId": req.body.cartId}, function(data){
				
					Token.sign({"userId" : dbResult.data[0].userId, "cartId": data.cart.cartId}, function(token){
						
						cb({
							"error":false,
							"userId" : dbResult.data[0].userId,
							"token" : token,
							"loggedin" : true,
							"cartId" : data.cart.cartId
						});
					});	
				});

				} else {
					cb({
						error : true,
						errorMessage : 'Username and Password do not match.'
					});
				}
			}
		});
	};
	
	Auth.signUp = function(req, cb) {
		
		var Token = app.models.Token;
		var Cart = app.models.Cart;
		var Postgres = app.models.Postgresql;
		var form_error = errorMessage = null;
		
		switch( true ){
		
			case( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( req.body.email ) ):
				
				cb({error : true,errorMessage : req.body.email + ' does not appear to be a valid email.'});
				break;
			
			case( req.body.password.length < 6 ):
				
				cb({error : true, errorMessage : 'Please use at least 6 characters in your email.'});
				break;
		
		
		default:
		var query = 'INSERT INTO "User" (email, crypted_password, name) VALUES (\''
				+ req.body.email + '\', crypt(\'' + req.body.password
				+ '\', gen_salt(\'md5\')),\''+ req.body.name +'\') RETURNING "userId"';

		Postgres.query(query,function(err, dbResult, db_error) {

				if (err) {

					if (db_error.constraint == "User_email_key") {

						var errorMessage = req.body.email
								+ ' is already being used.  Please select another email address.';
					} else {
						var errorMessage = 'Error Creating User';
					}

					cb({
						error : true,
						errorMessage : errorMessage
					});
				} else {
					
					Cart.createCart({"userId": dbResult.data[0].userId, "cartId": req.body.cartId}, function(data){
						
						Token.sign({"userId" : dbResult.data[0].userId, "cartId": data.cart.cartId}, function(token){
						
							cb({
								"userId" : dbResult.data[0].userId,
								"token" : token,
								"loggedin" : true,
								"cartId" : data.cart.cartId
							});
						});
					});
				}
			});
		break;
		}
	};
	
	Auth.s3Policy = function(req, cb) {

		var methodError = false;
		var bucket = "staging.photoandgo";
		var awsKey = process.env.AWS_KEY;
		var secret = process.env.AWS_SECRET;

		var fileName = req.body.fileName;
		var expiration = new Date(new Date().getTime() + 1000 * 60 * 5)
				.toISOString();

		var policy = {
			"expiration" : expiration,
			"conditions" : [ {
				"bucket" : bucket
			}, {
				"key" : fileName
			}, [ "starts-with", "$key", "" ], {
				"acl" : 'public-read'
			}, [ "starts-with", "$Content-Type", "" ],
					[ "content-length-range", 0, 524288000 ] ]
		};

		policyBase64 = new Buffer(JSON.stringify(policy), 'utf8')
				.toString('base64');
		signature = crypto.createHmac('sha1', secret).update(
				policyBase64).digest('base64');
		message = {
			bucket : bucket,
			awsKey : awsKey,
			policy : policyBase64,
			signature : signature
		};

		cb({"error": false, "message": message});
	
	};
};
