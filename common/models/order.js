var app = require("../../server/server");

module.exports = function(Order) {

	Order.getOrders = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'SELECT * FROM "Order" WHERE "userId" = '+req.app.locals.user_id;
		Postgres.query(query, function(err, dbResult) {

			if (err || Object.keys(dbResult.data[0]).length < 1) {
				cb({
					error : true,
					errorMessage : 'No Orders could be found for the User.'
				});
			} else {
				cb({
					error : false,
					order : dbResult.data
				});
			}
		});
	};

	Order.getOrder = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'SELECT "Order".id as "orderId", "Order".options,"paymentInfo", SUM(price * quantity) as "totalPrice", "giftMessage", (SELECT to_json(array_agg(c)) from (Select * from "OrderItem" where "OrderItem"."orderId" = '+ req.params.order_id+' )c) as "itemList" FROM "Order" JOIN "OrderItem" ON "Order".id = "OrderItem"."orderId" WHERE "userId" = '+req.app.locals.user_id+' AND "orderId" = '+ req.params.order_id+' GROUP BY "Order".id';
		Postgres.query(query, function(err, dbResult) {

			if (err || Object.keys(dbResult.data[0]).length < 1) {
				cb({
					error : true,
					errorMessage : "No Order could be found with that Order id."
				});
			} else {
				cb({
					error : false,
					order : dbResult.data[0]
				});
			}
		});
	};
	
	Order.placeOrder = function(req, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'SELECT * FROM create_order('+req.body.cartId+')';

		
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					order : dbResult.data[0]
				});
			}
		});
	};
}
