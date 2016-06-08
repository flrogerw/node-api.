var app = require("../../server/server");
module.exports = function(Product) {

	Product.getItem = function(params, cb) {

		var Postgres = app.models.Postgresql;
		var query = 'select id, name, options, "photoRealTemplateUrl", "defaultPrice" as price, sku from "Item" where "isDisabled" = false and id = '
				+ params.item_id + ' and "productId" = ' + params.product_id;

		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					items : dbResult.data[0]
				});
			}
		});
	};

	Product.getItems = function(params, cb) {

		var Postgres = app.models.Postgresql;
		var query = 'select id, name, options, "photoRealTemplateUrl", "defaultPrice" as price, sku from "Item" where "isDisabled" = false and "productId" = '
				+ params.product_id;
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					items : dbResult.data
				});
			}
		});
	};

	Product.getProduct = function(params, cb) {

		var Postgres = app.models.Postgresql;
		var query = 'SELECT "Product".*, array_to_json(array_agg("Item")) as items FROM "Product" join "Item" on "Product".id = "Item"."productId"  where "Product".id = '
				+ params.product_id
				+ ' and "Item"."isDisabled" = false group by "Product".id';
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					products : dbResult.data[0]
				});
			}
		});
	};

	Product.getProducts = function(params, cb) {

		var Postgres = app.models.Postgresql;

		var query = 'select * from get_products('+params.sales_channel+')';
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					products : dbResult.data
				});
			}
		});

	};
};
