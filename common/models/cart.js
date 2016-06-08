var app = require("../../server/server");
module.exports = function(Cart) {
	
	Cart.applyDiscount = function(cart, cb){
		
		var RuleEngine = require('node-rules');
		var Postgres = app.models.Postgresql;
		
		if(typeof cart.discounts == 'undefined'){
			
			cb({
				error: false,
				cart: cart
			});
		}else{
		
		var cartDiscounts = cart.discounts.map(function(obj) {
			  return '\''+obj.couponCode+'\'';
			});
	
		var query = 'SELECT rules FROM "Discount" WHERE "couponCode" IN (' + cartDiscounts + ') AND now() between "startDate" and "endDate"';
		
			Postgres.query(query, function(err, dbResult) {
				
				if (err) {
					cb({
						error : true,
						errorMessage : dbResult
					});
				} else {
					
					var x = 0;
					var loopRules = function(cart, rules) {
						
					    applyRule(cart, rules[x].rules,function(discountCart){
					       
					        x++;
					        if(x < rules.length) {
					            loopRules(discountCart, rules);   
					        }else{
								cb({
									error: false,
									cart: discountCart
								});
					        }
					    }); 
					}

					function applyRule(cart,rule,callback) {
						
						 var R1 = new RuleEngine();
						 R1.fromJSON(rule);
						 R1.execute(cart,function(result){ 
						    callback(result);
						    });
					}
					loopRules(cart, dbResult.data);
				}
			});
		}
	};

	Cart.mergeCart = function(cartId, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'UPDATE "CartItem" SET "CartItem"."cartId" = '+cartId+' where "cartId" IN (select "cartId" from "Cart" where "userId" = '+req.app.locals.user_id+') AND "CartItem"."orderId" IS NULL';
		
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				cb({
					error : false,
					cart : dbResult.data
				});
			}
		});
	};

	Cart.getCart = function(params, cb) {
		
		var Postgres = app.models.Postgresql;
		var query = 'SELECT * from get_cart('+params.cart_id+')';
					
			Postgres.query(query, function(err, dbResult) {

				if (err) {
					cb({
						error : true,
						errorMessage : "No Cart found with that Id."
					});
				} else {
					
					Cart.applyDiscount(dbResult.data[0], function( data ){
					
						if (data.error) {
							cb({
								error : true,
								errorMessage : dbResult.data[0]
							});
						} else {
							
							cb({
								error : false,
								cart : data.cart
							});
						}
					});
				}
			});	
	};

	Cart.updateItem = function(req, cb) {

		var Postgres = app.models.Postgresql;
		var columns = Postgres.getColumns(req.body);
		var values = Postgres.getValues(req.body);
		
		var query = 'UPDATE "CartItem" SET ('+ columns.toString() +') = ('+ values.toString() +') WHERE "id" = '+ req.params.cart_item_id +' AND "cartId" = '+req.params.cart_id+' RETURNING "cartId"';
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				Cart.getCart({"cart_id": req.params.cart_id }, function(data){
					cb({
						error : false,
						cart : data.cart
					});
				});
			}
		});
	};
	
	Cart.deleteItem = function(req, cb) {

			var Postgres = app.models.Postgresql;
			var query = 'DELETE from "CartItem" WHERE id = '+ req.params.cart_item_id + ' AND "cartId" = '+req.params.cart_id;
			
			Postgres.query(query, function(err, dbResult) {
				
				if(err || dbResult.data[0] == null){
					
					cb({
						error : true,
						errorMessage : 'Could not delete Item.'
					});
		
				}else{
					
					Cart.getCart({"cart_id": dbResult.data[0].cartId}, function(data){
						cb({
							error : false,
							cart : data.cart
						});
					});
				}
			});
		};

	Cart.createCart = function(params, cb) {
		
		var Postgres = app.models.Postgresql;
		var user_id = ( typeof params.userId !== 'undefined')? params.userId: null;
			
		if( typeof params.cartId !== 'undefined' ){
			
			cb({
				error : false,
				cart : {"cartId": params.cartId}
			});
		}else{
			
			var query = 'INSERT INTO "Cart" ("userId") VALUES ('+user_id+') RETURNING "cartId"';
			Postgres.query(query, function(err, dbResult) {

				if (err) {
					cb({
						error : true,
						errorMessage : dbResult
					});
				} else {
					cb({
						error : false,
						cart : dbResult.data[0]
					});
				}
			});
			
		}			
	};

	Cart.addItem = function(req, cb) {

		var Postgres = app.models.Postgresql;
		var columns = Postgres.getColumns(req.body);
		var values = Postgres.getValues(req.body);
		
		var query = 'INSERT INTO "CartItem" ('+ columns.toString() +') VALUES ('+ values +' )';
				
		Postgres.query(query, function(err, dbResult) {

			if (err) {
				cb({
					error : true,
					errorMessage : dbResult
				});
			} else {
				
				Cart.getCart({"cart_id": req.body.cartId}, function(data){
				cb({
					error : false,
					cart : data.cart
				});
			});
			}
		});
	};

};
