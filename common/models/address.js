var app = require("../../server/server");

module.exports = function(Address) {

	Address.getAddresses = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'SELECT * FROM "Address" WHERE "userId" = ' + req.app.locals.user_id;
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : 'No Addresses found for the User.'
				});
			} else {
				
				if( Object.keys(dbResult.data[0]).length < 1 ){
					
					cb({
						error : false,
						address: []
					});
				}else{
					cb({
						error : false,
						address: dbResult.data
					});
				}
			}
		});
	};
	
	Address.getAddress = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'SELECT * FROM "Address" WHERE "userId" = ' + req.app.locals.user_id + ' AND id = '+ req.params.address_id;
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					address : dbResult.data[0]
				});
			}
		});
	};
	
	Address.updateAddress = function(req, cb) {
				
		var Postgres = app.models.Postgresql;
		var columns = Postgres.getColumns(req.body);
		var values = Postgres.getValues(req.body);
		
		var query = 'UPDATE "Address" SET ('+ columns.toString() +') = ('+ values.toString() +') WHERE "id" = '+ req.params.address_id +' AND "userId" = '+req.app.locals.user_id;
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : 'Could not update Address.'
				});
			} else {
				
				Address.getAddresses(req, function(data){
					
					cb(data);
				});
			}
		});
	};
	
	Address.addAddress = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'INSERT INTO "Address" ("userId",address1,address2,city,state,"zipCode","phoneNumber") VALUES ('+req.app.locals.user_id+',\''+req.body.address1+'\',\''+req.body.address2+'\',\''+req.body.city+'\',\''+req.body.state+'\',\''+req.body.zipCode+'\',\''+req.body.phoneNumber+'\')';

		
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				
				Address.getAddresses(req, function(data){
					
					cb(data);
				});
			}
		});
	};
	
	Address.deleteAddress = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'DELETE FROM "Address" WHERE id = '+req.params.address_id+' AND "userId" = '+ req.app.locals.user_id;
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				
				Address.getAddresses(req, function(data){
					
					cb(data);
				});
			}
		});
	};
}
