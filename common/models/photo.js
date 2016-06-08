var app = require("../../server/server");
module.exports = function(Photo) {

	Photo.insertPhoto = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'INSERT INTO "Photo" ("userId", "photoUrl") VALUES(\''+ req.app.locals.user_id+'\', \''+ req.body.photoUrl+'\') RETURNING id';
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : query
				});
			} else {
				Photo.getPhotos(req, function(data){
					
					cb(data);
				});
			}
		});
	};

	Photo.getPhotos = function(req, cb) {

		var Postgres = app.models.Postgresql;
		var query = 'select id as "photoId", "photoUrl" from "Photo" where "isDeleted" = FALSE AND "userId" = ' + req.app.locals.user_id;
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : 'No Photos found for that User.'
				});
			} else {
				
				if( Object.keys(dbResult.data[0]).length < 1 ){
					
					cb({
						error : false,
						photos: []
					});
				}else{
					cb({
						error : false,
						photos: dbResult.data
					});
				}
			}
		});
	};

	Photo.deletePhoto = function(req, cb) {

		var Postgres = app.models.Postgresql;
		var query = 'UPDATE "Photo" SET "isDeleted" = TRUE WHERE "userId" = ' + req.app.locals.user_id +' AND id='+ req.params.photo_id;
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : 'Could not delete the Photo.'
				});
			} else {
				
				Photo.getPhotos(req, function(data){
					
					cb(data);
				});
			}
		});
	};

	Photo.getPhoto = function(req, cb) {

		var Postgres = app.models.Postgresql;
		var query = 'select id as "photoId", "photoUrl" from "Photo" where "isDeleted" = FALSE AND "userId" = ' + req.app.locals.user_id +' AND id='+ req.params.photo_id;
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					photos : dbResult.data[0]
				});
			}
		});

	};
};
