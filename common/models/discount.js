var app = require("../../server/server");

module.exports = function(Discount) {

	Discount.getDiscounts = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'SELECT * FROM "Discount" WHERE NOW() BETWEEN "startDate" AND "endDate"';
		Postgres.query(query, function(err, dbResult) {

			if (err || Object.keys(dbResult.data[0]).length < 1) {
				cb({
					error : true,
					errorMessage : "No Active Discounts were found."
				});
			} else {
				cb({
					error : false,
					discount : dbResult.data
				});
			}
		});
	};

	Discount.getDiscount = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'SELECT * FROM "Discount" WHERE id = '+ req.params.discount_id;
		Postgres.query(query, function(err, dbResult) {

			if (err || Object.keys(dbResult.data[0]).length < 1) {
				cb({
					error : true,
					errorMessage : 'No Discounts were found with that Id.'
				});
			} else {
				cb({
					error : false,
					discount : dbResult.data[0]
				});
			}
		});
	};
}
