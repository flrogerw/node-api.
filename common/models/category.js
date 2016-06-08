var app = require("../../server/server");

module.exports = function(Category) {
	
	Category.getCategory = function(params, cb) {

		var Postgres = app.models.Postgresql;
		var query = 'SELECT id, name FROM "Category" WHERE id = ' + params.category_id;

		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					categories : dbResult.data[0]
				});
			}
		});
	};
	
	Category.getCategories = function(params, cb) {

		var Postgres = app.models.Postgresql;
		var query = 'select * from get_categories('+params.sales_channel+')';
	
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					categories : dbResult.data[0].categories,
					homepage : dbResult.data[0].homepage
				});
			}
		});
	};

}
    