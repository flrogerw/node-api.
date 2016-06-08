var app = require("../../server/server");

module.exports = function(User) {

	User.getUser = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'SELECT "userId",email,name,"signupDate" FROM "User" WHERE "userId" = '+req.app.locals.user_id;
		Postgres.query(query, function(err, dbResult) {

			if (err || !dbResult.data[0]) {
				cb({
					error : true,
					errorMessage : 'The id of the User was not found.'
				});
			} else {
				cb({
					error : false,
					user : dbResult.data[0]
				});
			}
		});
	};
	
	User.updateUser = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var columns = Postgres.getColumns(req.body);
		var values = Postgres.getValues(req.body);
		
		var query = 'UPDATE "User" SET ('+ columns.toString() +') = ('+ values.toString() +') WHERE "userId" = '+req.app.locals.user_id+' RETURNING email,name,"userId","signupDate"';
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : query,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					user : dbResult.data[0]
				});
			}
		});
	};
	
	User.getSocial = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = '';
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					user : dbResult.data[0]
				});
			}
		});
	};
	
	User.getSocialConnect = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = '';
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					user : dbResult.data[0]
				});
			}
		});
	};
}
