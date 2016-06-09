/**
 * Main Routing Table
 * 2016
 * 
 */

module.exports = function(app) {
	
	var Product = app.models.Product;
	var Category = app.models.Category;
	var Photo = app.models.Photo;
	var Auth = app.models.Auth;
	var Cart = app.models.Cart;
	var Token = app.models.Token;
	var Address = app.models.Address;
	var Discount = app.models.Discount;
	var Order = app.models.Order;
	var User = app.models.User;
	
	/***** TOKEN ********/
	/*
	app.all('/users/:user_id/*', function(req, res, next){
	
		var token = req.headers.authorization || null;
		
		Token.verify(token, function( err, data ){
			
			if(err){
				res.send({error: true, errorMessage: data});
				res.end();
			}else{
				req.app.locals.user_id = decoded.userId;
				next();
			}
		});	
	});
	*/
	
	app.all(['/users/:user_id','/users/:user_id/*'], function(req, res, next){
		
		req.app.locals.user_id = req.params.user_id;
		next();
	});
	
	/**
	 * @api {get} /users/:user_id Get User
	 * @apiName GetUser
	 * @apiGroup User
	 * @apiDescription Returns a user's profile information.
	 * @apiPermission Logged In
	 *
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} user User object.
	 * @apiSuccess {bigint} user.userId System Id of the User.
	 * @apiSuccess {string} user.email  Email Address of the User.
	 * @apiSuccess {string} user.name  Full name of the User.
	 * @apiSuccess {date} user.signupDate  Sign up date of the User.
	 * 
	 * @apiSuccessExample Success-Response:
	 *     {
     *        	"error": false,
     *			"user": {
     *  		"userId": "125161609992182",
     * 			"email": "bob@bob.com",
     * 			"name": "Bob G. Normal",
     *  		"signupDate": "2016-05-16T23:27:59.843Z"
     *			}
	 *		}
	 *
	 * @apiError UserNotFound User not found.
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "The id of the User was not found."
	 *     }
	 */	
	app.get('/users/:user_id', function(req, res) {
		User.getUser(req, function(result) {
			res.send(result);
		});
	});

	
	/**
	 * @api {get} /users/:user_id/social Get Social Networks
	 * @apiName GetUserSocials
	 * @apiGroup User
	 * @apiDescription This method is still UNDEFINED
	 * @apiPermission Logged In
	 *
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 *
	 * @apiError UserSocialNotFound No Social Found.
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No connections were found for the User"
	 *     }
	 */
	app.get('/users/:user_id/social', function(req, res) {
		User.getSocial(req, function(result) {
			res.send(result);
		});
	});
	
	/**
	 * @api {get} /users/:user_id/social/connect Get Social Connections
	 * @apiName GetUserSocial
	 * @apiGroup User
	 * @apiDescription This method is still UNDEFINED
	 * @apiPermission Logged In
	 * @apiHeader {string} Authorization Authorization token value.
	 *
	 * @apiParam {bigint} user_id Users unique ID.
	 *
	 * @apiError UserSocialNotFound No Social Found.
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No connection found with that Id"
	 *     }
	 */
	app.get('/users/:user_id/social/connect', function(req, res) {
		User.getSocialConnect(req, function(result) {
			res.send(result);
		});
	});
	
	/**
	 * @api {patch} /users/:user_id Update User
	 * @apiName patchUser
	 * @apiGroup User
	 * @apiPermission Logged In
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiDescription Update User information.
	 *
	 * @apiParam {bigint} user_id Users unique ID.
	 * @apiParam {string} email New email address for the User.  *optional
	 * @apiParam {string} name New name for the User.  *optional
	 * @apiParam {string} stripeId New Stripe Id for the User.  *optional
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} user User object.
	 * @apiSuccess {bigint} user.userId System Id of the User.
	 * @apiSuccess {string} user.email  Email Address of the User.
	 * @apiSuccess {string} user.name  Full name of the User.
	 * @apiSuccess {date} user.signupDate  Sign up date of the User.
	 * 
	 * @apiExample {js} Example usage:
     *  $.ajax({
	 *	method: "PATCH",
	 *	url: "/users/123456789876",
	 *	data: { "name": "John Smith", "email": "new_email@email.com" }
	 *	});     
	 * @apiSuccessExample Success-Response:
	 *     {
     *        	"error": false,
     *			"user": {
     *  		"userId": "125161609992182",
     * 			"email": "bob@bob.com",
     * 			"name": "Bob G. Normal",
     *  		"signupDate": "2016-05-16T23:27:59.843Z"
     *			}
	 *		}
	 *
	 * @apiError UserNotFound The id of the User was not found.
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "The id of the User was not found."
	 *     }
	 */	
	app.patch('/users/:user_id', function(req, res) {
		User.updateUser(req, function(result) {
			res.send(result);
		});
	});
	
	/**
	 * @api {get} /users/:user_id/orders Get Orders
	 * @apiName GetOrders
	 * @apiGroup Order
	 * @apiPermission Logged In
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiDescription Get Users Complete Order history.
	 *
	 * @apiParam {bigint} user_id Users unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} order Array of Order objects.
	 * @apiSuccess {integer} order.id System Id of the Order.
	 * @apiSuccess {bigint} order.userId System Id of the User.
	 * @apiSuccess {object} order.options  Special conditions for the order.
	 * @apiSuccess {object} order.paymentInfo  Payment type information/Stripe response.
	 * @apiSuccess {float} order.totalPrice  Amount paid by the User.
	 * @apiSuccess {string} order.status  Current status of the order [pending,complete,canceled].
	 * @apiSuccess {string} order.giftMessage  Message sent with the shipped Order.
	 * @apiSuccess {date} order.createDate  Date the Order was placed.
	 * 
	 * @apiSuccessExample Success-Response:
	 *     {
     *		"error": false,
     *		"order": [
     *   			{
	 *		            "id": 4035,
	 *		            "userId": "1251616099921822774",
	 *		            "options": {},
	 *		            "paymentInfo": {},
	 *		            "totalPrice": 104.23,
	 *		            "status": "complete",
	 *		            "giftMessage": "Happy Birthday",
	 *		            "createDate": "2016-05-23T23:18:53.781Z"
	 *		        },
	 *			...
	 *		    ]
	 *		}
	 *
	 * @apiError OrderNotFound No Orders found.
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Orders could be found for the User."
	 *     }
	 */
	
	app.get('/users/:user_id/orders', function(req, res) {
		Order.getOrders(req, function(result) {
			res.send(result);
		});
	});
	
	
	/**
	 * @api {get} /users/:user_id/orders/:order_id Get Order
	 * @apiName GetOrder
	 * @apiGroup Order
	 * @apiPermission Logged In
	 * @apiDescription Get a single Order based on Order Id.
	 *
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 * @apiParam {integer} order_id Order unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} order Order object.
	 * @apiSuccess {integer} order.id System Id of the Order.
	 * @apiSuccess {object} order.options  Special conditions for the order.
	 * @apiSuccess {object} order.paymentInfo  Payment type information/Stripe response.
	 * @apiSuccess {float} order.totalPrice  Amount paid by the User.
	 * @apiSuccess {string} order.status  Current status of the order [pending,complete,canceled].
	 * @apiSuccess {string} order.giftMessage  Message sent with the shipped Order.
	 * @apiSuccess {array} order.itemList  List of Items in the Order.
	 * @apiSuccess {integer} order.itemList.id  CartItem System id.
	 * @apiSuccess {integer} order.itemList.quantity  Quantity purchased of that item.
	 * @apiSuccess {integer} order.itemList.itemId  System id of the Item.
	 * @apiSuccess {bigint} order.itemList.cartId  Cart id for the item/order.
	 * @apiSuccess {float} order.itemList.price  Price of the Item.
	 * @apiSuccess {object} order.itemList.options  Options specific to the Item [color,size,etc].
	 * @apiSuccess {integer} order.itemList.shippingAddressId  System id for Address to ship Item.
	 * @apiSuccess {integer} order.itemList.stockLocationId  System id for the StockLocation.
	 * @apiSuccess {object} order.itemList.photoCustomization  Object containing photo manipulation information.
	 * @apiSuccess {string} order.itemList.status  Status of Item [printing,canceled,shipped,etc].
	 * @apiSuccess {string} order.itemList.fulfillmentType  Type of fulfillment.
	 * @apiSuccess {integer} order.itemList.orderId  System id for Order containing the Item.
	 * 
	 * @apiSuccessExample Success-Response:
	 *     {
	 *		    "error": false,
	 *		    "order": {
	 *		        "orderId": 4038,
	 *		        "options": {},
	 *		        "paymentInfo": {"paymentType": "cash"},
	 *		        "totalPrice": 90,
	 *		        "giftMessage": null,
	 *		        "itemList": [   
	 *		            {
	 *		                "id": 68,
	 *		                "quantity": 1,
	 *		                "itemId": 1,
	 *		                "cartId": 1256663052900631800,
	 *		                "price": 10,
	 *		                "options": {"size":"small"},
	 *		                "shippingAddressId": 1474,
	 *		                "stockLocationId": 3,
	 *		                "photoCustomization": {
	 *		                    "photoId": 183
	 *		                },
	 *		                "status": "complete",
	 *		                "fulfillmentType": "ship",
	 *		                "orderId": 4038
	 *		            },
	 *		    	     ...
	 *		        ]
	 *		    }
	 *		}
	 *
	 * @apiError OrderNotFound No Orders found.
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Order could be found with that Order id."
	 *     }
	 */
	app.get('/users/:user_id/orders/:order_id', function(req, res) {
		Order.getOrder(req, function(result) {
			res.send(result);
		});
	});
	
	/**
	 * @api {post} /users/:user_id/orders/place_order Post Order
	 * @apiName postOrder
	 * @apiGroup Order
	 * @apiPermission Logged In
	 * @apiDescription Post a new Order.
	 * 
	 * @apiHeader {string} Authorization Authorization token value.
	 *
	 * @apiParam {bigint} user_id Users unique ID.
	 * @apiParam {bigint} cartId System id of the Cart to convert.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} order Order object.
	 * @apiSuccess {integer} order.orderId System Id of the new Order.
	 * 
	 * @apiExample {js} Example usage:
     *  $.ajax({
	 *	method: "POST",
	 *	url: "/users/12345678765/orders/place_order",
	 *	data: { "cartId": 12332345434567 }
	 *	});
	 *     
	 * @apiSuccessExample Success-Response:
	 *     {
	 *	    "error": false,
	 *	    "order": {
	 *	        "orderId": 4042
	 *	    }
	 *	}
	 *
	 * @apiError OrderPostFail Order Error
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "Could not place the Order."
	 *     }
	 */	
	app.post('/users/:user_id/orders/place_order', function(req, res) {
		Order.placeOrder(req, function(result) {
			res.send(result);
		});
	});
	

	/**
	 * @api {get} /discounts Get Promotions
	 * @apiName GetDiscounts
	 * @apiGroup Promotions
	 * @apiPermission none
	 * @apiDescription Get all active Promotions.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} discount Array of Discount objects.
	 * @apiSuccess {integer} discount.id System Id of the Discount.
	 * @apiSuccess {string} discount.description  User friendly description of the promotion.
	 * @apiSuccess {string} discount.campaignId  Campaign associated with promotion.
	 * @apiSuccess {date} discount.startDate  Start date of the promotion.
	 * @apiSuccess {date} discount.endDate  End date of the promotion.
	 * @apiSuccess {string} discount.couponCode  Public code for the promotion.
	 * @apiSuccess {boolean} discount.isFeatured  If promotion is displayed to user.
	 * @apiSuccess {array} discount.rules  Rules used to apply the discount.
	 * @apiSuccess {string} discount.rules.condition  Condition to trigger discount.
	 * @apiSuccess {string} discount.rules.consequence  Logic for Discount.
	 * 
	 * @apiSuccessExample Success-Response:
	 *  {
     *	"error": false,
     *	"discount": [
     *   		{
     *       		"id": 1,
     *       		"description": "10% off for orders over $50",
     *       		"campaignId": "AAA1234",
     *      		"startDate": "2016-05-01T00:00:00.000Z",
     *      		"endDate": "2016-10-21T00:00:00.000Z",
     *       		"couponCode": "XXX098",
     *       		"isFeatured": false,
     *      		"rules": [
     *           		{
     *               		"condition": "function (R) {R.when(this && (this.totalPrice > 50));}",
     *               		"consequence": "function (R) {this.orderDiscount += this.totalPrice * .1; R.stop();}"
     *           		}
     *       		]
     *   		},
     *   		...
     *		]
	 *	}
	 *
	 * @apiError DiscountNotFound No Active Discounts.
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Active Discounts were found."
	 *     }
	 */
	app.get('/discounts', function(req, res) {
		Discount.getDiscounts(req, function(result) {
			res.send(result);
		});
	});

	
	/**
	 * @api {get} /discounts/:promotion_id Get Promotion
	 * @apiName GetDiscount
	 * @apiGroup Promotions
	 * @apiDescription Returns single Promotion based on Promotion id.
	 * @apiPermission none
	 *
	 * @apiParam {integer} promo_id Promotion unique Id.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} discount Discount objects.
	 * @apiSuccess {integer} discount.id System Id of the Discount.
	 * @apiSuccess {string} discount.description  User friendly description of the promotion.
	 * @apiSuccess {string} discount.campaignId  Campaign associated with promotion.
	 * @apiSuccess {date} discount.startDate  Start date of the promotion.
	 * @apiSuccess {date} discount.endDate  End date of the promotion.
	 * @apiSuccess {string} discount.couponCode  Public code for the promotion.
	 * @apiSuccess {boolean} discount.isFeatured  If promotion is displayed to user.
	 * @apiSuccess {array} discount.rules  Rules used to apply the discount.
	 * @apiSuccess {string} discount.rules.condition  Condition to trigger discount.
	 * @apiSuccess {string} discount.rules.consequence  Logic for Discount.
	 * 
	 * @apiSuccessExample Success-Response:
	 *    {
    		"error": false,
    		"discount": {
            		"id": 1,
            		"description": "10% off for orders over $50",
            		"campaignId": "AAA1234",
           			"startDate": "2016-05-01T00:00:00.000Z",
            		"endDate": "2016-10-21T00:00:00.000Z",
            		"couponCode": "XXX098",
            		"isFeatured": false,
           			"rules": [
                		{
                    		"condition": "function (R) {R.when(this && (this.totalPrice > 50));}",
                    		"consequence": "function (R) {this.orderDiscount += this.totalPrice * .1; R.stop();}"
                		}
            		]
        		}
		}
	 *
	 * @apiError DiscountNotFound No Active Discounts.
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Discounts were found with that Id."
	 *     }
	 */
	app.get('/discounts/:discount_id', function(req, res) {
		Discount.getDiscount(req, function(result) {
			res.send(result);
		});
	});	

	/**
	 * @api {get} /users/:user_id/addresses Get Addresses
	 * @apiName GetAddresses
	 * @apiGroup Address
	 * @apiPermission Logged In
	 * @apiDescription Get User Addresses.
	 * 
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} address Array of Address objects.
	 * @apiSuccess {integer} address.id System Id of the Address.
	 * @apiSuccess {bigint} address.userId System Id of the User.
	 * @apiSuccess {string} address.address1  First line of the Address.
	 * @apiSuccess {string} address.address2  Second line of the Address.
	 * @apiSuccess {string} address.city  Address city.
	 * @apiSuccess {string} address.state  Address state.
	 * @apiSuccess {string} address.zipCode  Address zip code.
	 * @apiSuccess {string} address.phoneNumber  Phone number associated with the Address.
	 * 
	 * @apiSuccessExample Success-Response:
	 *     {
	 *		    "error": false,
	 *		    "address": [
	 *		        {
	 *		            "id": 3,
	 *		            "userId": "1251616099921822774",
	 *		            "address1": "125 Main",
	 *		            "address2": "Apt 2",
	 *		            "city": "Colorado Springs",
	 *		            "state": "CO",
	 *		            "zipCode": "80919",
	 *		            "phoneNumber": "123.123.1234"
	 *		        },
	 *			   ...
	 *		    ]
	 *		}
	 *		
	 * @apiError AddressNotFound No Addresses found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Addresses found for the User."
	 *     }
	 */
	app.get('/users/:user_id/addresses', function(req, res) {
		Address.getAddresses(req, function(result) {
			res.send(result);
		});
	});

	
	/**
	 * @api {get} /users/:user_id/addresses/:address_id Get Address
	 * @apiName GetAddress
	 * @apiGroup Address
	 * @apiPermission Logged In
	 * @apiDescription Get a single Address based on Id.
	 * 
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 * @apiParam {integer} address_id Address unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} address Address object.
	 * @apiSuccess {integer} address.id System Id of the Address.
	 * @apiSuccess {bigint} address.userId System Id of the User.
	 * @apiSuccess {string} address.address1  First line of the Address.
	 * @apiSuccess {string} address.address2  Second line of the Address.
	 * @apiSuccess {string} address.city  Address city.
	 * @apiSuccess {string} address.state  Address state.
	 * @apiSuccess {string} address.zipCode  Address zip code.
	 * @apiSuccess {string} address.phoneNumber  Phone number associated with the Address.
	 * 
	 * @apiSuccessExample Success-Response:
	 *     {
	 *		    "error": false,
	 *		    "address": 
	 *		        {
	 *		            "id": 3,
	 *		            "userId": "1251616099921822774",
	 *		            "address1": "125 Main",
	 *		            "address2": "Apt 2",
	 *		            "city": "Colorado Springs",
	 *		            "state": "CO",
	 *		            "zipCode": "80919",
	 *		            "phoneNumber": "123.123.1234"
	 *		        }
	 *		}
	 *		
	 * @apiError AddressNotFound No Addresses found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Addresses found with that Id."
	 *     }
	 */
	app.get('/users/:user_id/addresses/:address_id', function(req, res) {
		Address.getAddress(req, function(result) {
			res.send(result);
		});
	});

	/**
	 * @api {patch} /users/:user_id/addresses/:address_id Update Address
	 * @apiName patchAddress
	 * @apiGroup Address
	 * @apiPermission Logged In
	 *
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 * @apiParam {integer} address_id Address unique ID.
	 * 
	 * @apiParam {string} address1  New First line of the Address.  *optional
	 * @apiParam {string} address2  New Second line of the Address.  *optional
	 * @apiParam {string} city  New Address city.  *optional
	 * @apiParam {string} state  New Address state.  *optional
	 * @apiParam {string} zipCode  New Address zip code.  *optional
	 * @apiParam {string} phoneNumber  New Phone number associated with the Address.  *optional
	 * 
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} address Array of Address objects.
	 * @apiSuccess {integer} address.id System Id of the Address.
	 * @apiSuccess {bigint} address.userId System Id of the User.
	 * @apiSuccess {string} address.address1  First line of the Address.
	 * @apiSuccess {string} address.address2  Second line of the Address.
	 * @apiSuccess {string} address.city  Address city.
	 * @apiSuccess {string} address.state  Address state.
	 * @apiSuccess {string} address.zipCode  Address zip code.
	 * @apiSuccess {string} address.phoneNumber  Phone number associated with the Address.
	 * 
	 *  @apiExample {js} Example usage:
     *  $.ajax({
	 *	method: "PATCH",
	 *	url: "/users/123456789876/addresses/1234",
	 *	data: { 
	 *		"address1": "125 Main",
	 *		"address2": "Apt 2",
	 *		"city": "Colorado Springs",
	 *		"state": "CO",
	 *		"zipCode": "80919",
	 *		"phoneNumber": "123.123.1234" }
	 *	});
	 *     
	 * @apiSuccessExample Success-Response:
	 *	{
	 *		"error": false,
	 *		"address": [ 
	 *			{
	 *			"id": 3,
	 *			"userId": "1251616099921822774",
	 *			"address1": "125 Main",
	 *			"address2": "Apt 2",
	 *			"city": "Colorado Springs",
	 *			"state": "CO",
	 *			"zipCode": "80919",
	 *			"phoneNumber": "123.123.1234"
	 *			},
	 *			...
	 *		]
	 *	}
	 *		
	 * @apiError AddressUpdateFail Address update failed
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "Could not update Address."
	 *     }
	 */
	app.patch('/users/:user_id/addresses/:address_id', function(req, res) {
		Address.updateAddress(req, function(result) {
			res.send(result);
		});
	});
	
	
	/**
	 * @api {post} /users/:user_id/addresses Post Address
	 * @apiName addAddress
	 * @apiGroup Address
	 * @apiPermission Logged In
	 * 
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 * 
	 * @apiParam {string} address1  First line of the Address.  
	 * @apiParam {string} address2  Second line of the Address.  *optional
	 * @apiParam {string} city  Address city. 
	 * @apiParam {string} state  Address state.
	 * @apiParam {string} zipCode  Address zip code.
	 * @apiParam {string} phoneNumber  Phone number associated with the Address.  *optional
	 * 
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} address Array of Address objects.
	 * @apiSuccess {integer} address.id System Id of the Address.
	 * @apiSuccess {bigint} address.userId System Id of the User.
	 * @apiSuccess {string} address.address1  First line of the Address.
	 * @apiSuccess {string} address.address2  Second line of the Address.
	 * @apiSuccess {string} address.city  Address city.
	 * @apiSuccess {string} address.state  Address state.
	 * @apiSuccess {string} address.zipCode  Address zip code.
	 * @apiSuccess {string} address.phoneNumber  Phone number associated with the Address.
	 *
	 *  @apiExample {js} Example usage:
     *  $.ajax({
	 *	method: "POST",
	 *	url: "/users/123456789876/address",
	 *	data: { 
	 *		"address1": "125 Main",
	 *		"address2": "Apt 2",
	 *		"city": "Colorado Springs",
	 *		"state": "CO",
	 *		"zipCode": "80919",
	 *		"phoneNumber": "123.123.1234" }
	 *	});     
	 * @apiSuccessExample Success-Response:
	 *	{
	 *		"error": false,
	 *		"address": [ 
	 *			{
	 *			"id": 3,
	 *			"userId": "1251616099921822774",
	 *			"address1": "125 Main",
	 *			"address2": "Apt 2",
	 *			"city": "Colorado Springs",
	 *			"state": "CO",
	 *			"zipCode": "80919",
	 *			"phoneNumber": "123.123.1234"
	 *			},
	 *			...
	 *		]
	 *	}
	 *		
	 * @apiError AddressPostFail Address POST failed
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "Could not add new Address."
	 *     }
	 */
	app.post('/users/:user_id/addresses', function(req, res) {
		Address.addAddress(req, function(result) {
			res.send(result);
		});
	});
	
	/**
	 * @api {delete} /users/:user_id/addresses/:address_id Delete Address
	 * @apiName deleteAddress
	 * @apiGroup Address
	 * @apiPermission Logged In
	 * 
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 * @apiParam {integer} address_id Unique Id for the Address.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} address Array of Address objects.
	 * @apiSuccess {integer} address.id System Id of the Address.
	 * @apiSuccess {bigint} address.userId System Id of the User.
	 * @apiSuccess {string} address.address1  First line of the Address.
	 * @apiSuccess {string} address.address2  Second line of the Address.
	 * @apiSuccess {string} address.city  Address city.
	 * @apiSuccess {string} address.state  Address state.
	 * @apiSuccess {string} address.zipCode  Address zip code.
	 * @apiSuccess {string} address.phoneNumber  Phone number associated with the Address.
	 * 
	 * @apiSuccessExample Success-Response:
	 *	{
	 *		"error": false,
	 *		"address": [ 
	 *			{
	 *			"id": 3,
	 *			"userId": "1251616099921822774",
	 *			"address1": "125 Main",
	 *			"address2": "Apt 2",
	 *			"city": "Colorado Springs",
	 *			"state": "CO",
	 *			"zipCode": "80919",
	 *			"phoneNumber": "123.123.1234"
	 *			},
	 *			...
	 *		]
	 *	}
	 *		
	 * @apiError DeleteAddressFail Delete Address Failed
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "Could not delete the Address."
	 *     }
	 */
	app.delete('/users/:user_id/addresses/:address_id', function(req, res) {
		Address.deleteAddress(req, function(result) {
			res.send(result);
		});
	});	
		
	/**
	 * @api {get} /cart/:cart_id Get Cart
	 * @apiName getCart
	 * @apiGroup Cart
	 * @apiPermission none
	 *
	 * @apiParam {bigint} cart_id Cart unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} cart Cart object.
	 * @apiSuccess {bigint} cart.cartId  System Id of the Cart.
	 * @apiSuccess {float} cart.totalPrice  Current total for the Cart.
	 * @apiSuccess {float} cart.orderDiscount  Discount to apply for Order promotions.
	 * @apiSuccess {float} cart.shipDiscount  Discount to apply for Shipping promotions.
	 * @apiSuccess {array} cart.discounts  Array of applied Discount objects.
	 * @apiSuccess {string} cart.discounts.couponCode  Coupon code used.
	 * @apiSuccess {string} cart.discounts.description  Friendly description of discount.
	 * @apiSuccess {array} cart.list  Array of Items in the Cart grouped by Item Id.
	 * @apiSuccess {integer} cart.list.itemId  Unique Id for the Item.
	 * @apiSuccess {string} cart.list.itemName  Friendly name of the Item.
	 * @apiSuccess {string} cart.list.productName  Friendly name of the parent Product.
	 * @apiSuccess {string} cart.list.productImageUrl  URL for generic image of the parent Product.
	 * @apiSuccess {float} cart.list.totalPrice  Total amount for that Item.
	 * @apiSuccess {array} cart.list.itemList  Array of Item objects with current itemId.
	 * @apiSuccess {integer} cart.list.itemList.cartItemId  Unique CartItem Id for the Item.
	 * @apiSuccess {integer} cart.list.itemList.quantity  Quantity for instance of the Item.
	 * @apiSuccess {object} cart.list.itemList.photoCustomization  Item specific data for Photo manipulation of instance.
	 * 
	 * @apiSuccessExample Success-Response:
	 *   {
	 *	    "error": false,
	 *	    "cart": {
	 *	        "cartId": "1256663052900631820",
	 *	        "totalPrice": 630,
	 *	        "orderDiscount": 63,
	 *	        "shipDiscount": 0,
	 *	        "discounts": [
	 *	            {
	 *	                "couponCode": "XXX098",
	 *	                "description": "10% off for orders over $50"
	 *	            },
	 *	           ...
	 *	        ],
	 *	        "list": [
	 *	            {
	 *	                "itemId": 1,
	 *	                "itemName": "Small GoPrint (3.5 x 4.25)",
	 *	                "productName": "GoPrint",
	 *	                "productImageUrl": "http://www.photoandgo.com/images/gfx-home_page/Photo-and-Go-Picture-GoPrints2.jpg",
	 *	                "totalPrice": 150,
	 *	                "itemList": [
	 *	                    {
	 *	                        "cartItemId": 7,
	 *	                        "quantity": 1,
	 *	                        "photoCustomization": {
	 *	                            "photoId": 186,
	 *	                            "photoUrl": "http://staging.photoandgo.s3.amazonaws.com/ScreenShot2016-05-10at11.41.27AM.png"
	 *	                        }
	 *	                    },
	 *	                   ...       
	 *	                ]
	 *	            },  
	 *	          ...   
	 *	        ]
	 *	    }
	 *	}
	 *
	 * @apiError CartNotFound No Cart found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Cart found with that Id."
	 *     }
	 */	
	app.get('/cart/:cart_id', function(req, res) {
		Cart.getCart(req.params, function(result) {
			res.send(result);
		});
	});
	

	
	/**
	 * @api {post} /cart/add_item Add Item
	 * @apiName postItem
	 * @apiGroup Cart
	 * @apiPermission none
	 *
	 * @apiParam {integer} itemId Item unique System Id.
	 * @apiParam {bigint} cartId Cart unique ID.
	 * @apiParam {integer} quantity Quantity of Item to add to Cart.
	 * @apiParam {float} price Price of Item.
	 * @apiParam {object} photoCustomization Photo manipulation data for the Item.  *optional
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} cart Cart object.
	 * @apiSuccess {bigint} cart.cartId  System Id of the Cart.
	 * @apiSuccess {float} cart.totalPrice  Current total for the Cart.
	 * @apiSuccess {float} cart.orderDiscount  Discount to apply for Order promotions.
	 * @apiSuccess {float} cart.shipDiscount  Discount to apply for Shipping promotions.
	 * @apiSuccess {array} cart.discounts  Array of applied Discount objects.
	 * @apiSuccess {string} cart.discounts.couponCode  Coupon code used.
	 * @apiSuccess {string} cart.discounts.description  Friendly description of discount.
	 * @apiSuccess {array} cart.list  Array of Items in the Cart grouped by Item Id.
	 * @apiSuccess {integer} cart.list.itemId  Unique Id for the Item.
	 * @apiSuccess {string} cart.list.itemName  Friendly name of the Item.
	 * @apiSuccess {string} cart.list.productName  Friendly name of the parent Product.
	 * @apiSuccess {string} cart.list.productImageUrl  URL for generic image of the parent Product.
	 * @apiSuccess {float} cart.list.totalPrice  Total amount for that Item.
	 * @apiSuccess {array} cart.list.itemList  Array of Item objects with current itemId.
	 * @apiSuccess {integer} cart.list.itemList.cartItemId  Unique CartItem Id for the Item.
	 * @apiSuccess {integer} cart.list.itemList.quantity  Quantity for instance of the Item.
	 * @apiSuccess {object} cart.list.itemList.photoCustomization  Item specific data for Photo manipulation of instance.
	 * 
	 *  @apiExample {js} Example usage:
     *  $.ajax({
	 *	method: "POST",
	 *	url: "/cart/add_item",
	 *	data: { 
	 *		"itemId": 5,
	 *		"cartId": 1234567654,
	 *		"quantity": 4,
	 *		"price": 1.99,
	 *		"photoCustomization": {"photoId": 123} }
	 *	});     
	 * 
	 * @apiSuccessExample Success-Response:
	 *   {
	 *	    "error": false,
	 *	    "cart": {
	 *	        "cartId": "1256663052900631820",
	 *	        "totalPrice": 630,
	 *	        "orderDiscount": 63,
	 *	        "shipDiscount": 0,
	 *	        "discounts": [
	 *	            {
	 *	                "couponCode": "XXX098",
	 *	                "description": "10% off for orders over $50"
	 *	            },
	 *	           ...
	 *	        ],
	 *	        "list": [
	 *	            {
	 *	                "itemId": 1,
	 *	                "itemName": "Small GoPrint (3.5 x 4.25)",
	 *	                "productName": "GoPrint",
	 *	                "productImageUrl": "http://www.photoandgo.com/images/gfx-home_page/Photo-and-Go-Picture-GoPrints2.jpg",
	 *	                "totalPrice": 150,
	 *	                "itemList": [
	 *	                    {
	 *	                        "cartItemId": 7,
	 *	                        "quantity": 1,
	 *	                        "photoCustomization": {
	 *	                            "photoId": 186,
	 *	                            "photoUrl": "http://staging.photoandgo.s3.amazonaws.com/ScreenShot2016-05-10at11.41.27AM.png"
	 *	                        }
	 *	                    },
	 *	                   ...       
	 *	                ]
	 *	            },  
	 *	          ...   
	 *	        ]
	 *	    }
	 *	}
	 *
	 * @apiError CartNotFound No Cart found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Cart found with that Id."
	 *     }
	 */	
	app.post('/cart/add_item', function(req, res) {
		Cart.addItem(req, function(result) {
			res.send(result);
		});
	});

	/**
	 * @api {patch} /cart/:cart_id/:cart_item_id Update Item
	 * @apiName patchItem
	 * @apiGroup Cart
	 * @apiPermission none
	 *
	 * @apiParam {integer} cart_item_id CartItem unique System Id.
	 * @apiParam {bigint} cartId Cart unique ID.
	 * @apiParam {object} update Cart Item parameters to be updated.
	 * @apiParam {integer} update.quantity New quantity for the Item.  *optional
	 * @apiParam {float} update.price New price of the Item.  *optional
	 * @apiParam {object} update.options New options for the Item.  *optional
	 * @apiParam {object} update.photoCustomization New Photo manipulation data for the Item.  *optional
	 * @apiParam {integer} update.shippingAddressId New shipping address Id for the Item.  *optional
	 * @apiParam {integer} update.stockLocationId New stock location for the Item.  *optional
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} cart Cart object.
	 * @apiSuccess {bigint} cart.cartId  System Id of the Cart.
	 * @apiSuccess {float} cart.totalPrice  Current total for the Cart.
	 * @apiSuccess {float} cart.orderDiscount  Discount to apply for Order promotions.
	 * @apiSuccess {float} cart.shipDiscount  Discount to apply for Shipping promotions.
	 * @apiSuccess {array} cart.discounts  Array of applied Discount objects.
	 * @apiSuccess {string} cart.discounts.couponCode  Coupon code used.
	 * @apiSuccess {string} cart.discounts.description  Friendly description of discount.
	 * @apiSuccess {array} cart.list  Array of Items in the Cart grouped by Item Id.
	 * @apiSuccess {integer} cart.list.itemId  Unique Id for the Item.
	 * @apiSuccess {string} cart.list.itemName  Friendly name of the Item.
	 * @apiSuccess {string} cart.list.productName  Friendly name of the parent Product.
	 * @apiSuccess {string} cart.list.productImageUrl  URL for generic image of the parent Product.
	 * @apiSuccess {float} cart.list.totalPrice  Total amount for that Item.
	 * @apiSuccess {array} cart.list.itemList  Array of Item objects with current itemId.
	 * @apiSuccess {integer} cart.list.itemList.cartItemId  Unique CartItem Id for the Item.
	 * @apiSuccess {integer} cart.list.itemList.quantity  Quantity for instance of the Item.
	 * @apiSuccess {object} cart.list.itemList.photoCustomization  Item specific data for Photo manipulation of instance.
	 * 
	 *  @apiExample {js} Example usage:
     *  $.ajax({
	 *	method: "PATCH",
	 *	url: "/cart/23454567878/1234",
	 *	data: { 
	 *		"price": 1.99,
	 *		"options":{"size":"large"},
	 *		"shippingAddressId": 1234,
	 *		"stockLocationId": 9876,
	 *		"photoCustomization": {} 
	 *		}	
	 *	});     
	 * 
	 * @apiSuccessExample Success-Response:
	 *   {
	 *	    "error": false,
	 *	    "cart": {
	 *	        "cartId": "1256663052900631820",
	 *	        "totalPrice": 630,
	 *	        "orderDiscount": 63,
	 *	        "shipDiscount": 0,
	 *	        "discounts": [
	 *	            {
	 *	                "couponCode": "XXX098",
	 *	                "description": "10% off for orders over $50"
	 *	            },
	 *	           ...
	 *	        ],
	 *	        "list": [
	 *	            {
	 *	                "itemId": 1,
	 *	                "itemName": "Small GoPrint (3.5 x 4.25)",
	 *	                "productName": "GoPrint",
	 *	                "productImageUrl": "http://www.photoandgo.com/images/gfx-home_page/Photo-and-Go-Picture-GoPrints2.jpg",
	 *	                "totalPrice": 150,
	 *	                "itemList": [
	 *	                    {
	 *	                        "cartItemId": 7,
	 *	                        "quantity": 1,
	 *	                        "photoCustomization": {
	 *	                            "photoId": 186,
	 *	                            "photoUrl": "http://staging.photoandgo.s3.amazonaws.com/ScreenShot2016-05-10at11.41.27AM.png"
	 *	                        }
	 *	                    },
	 *	                   ...       
	 *	                ]
	 *	            },  
	 *	          ...   
	 *	        ]
	 *	    }
	 *	}
	 *
	 * @apiError CartNotFound No Cart found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Cart found with that Id."
	 *     }
	 */	
	app.patch('/cart/:cart_id/:cart_item_id', function(req, res) {
		Cart.updateItem(req, function(result) {
			res.send(result);
		});
	});

	/**
	 * @api {delete} /cart/:cart_id/:cart_item_id Delete Item
	 * @apiName deleteItem
	 * @apiGroup Cart
	 * @apiPermission none
	 *
	 * @apiParam {bigint} cart_id Cart unique ID.
	 * @apiParam {integer} cart_item_id CartItem unique System Id.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} cart Cart object.
	 * @apiSuccess {bigint} cart.cartId  System Id of the Cart.
	 * @apiSuccess {float} cart.totalPrice  Current total for the Cart.
	 * @apiSuccess {float} cart.orderDiscount  Discount to apply for Order promotions.
	 * @apiSuccess {float} cart.shipDiscount  Discount to apply for Shipping promotions.
	 * @apiSuccess {array} cart.discounts  Array of applied Discount objects.
	 * @apiSuccess {string} cart.discounts.couponCode  Coupon code used.
	 * @apiSuccess {string} cart.discounts.description  Friendly description of discount.
	 * @apiSuccess {array} cart.list  Array of Items in the Cart grouped by Item Id.
	 * @apiSuccess {integer} cart.list.itemId  Unique Id for the Item.
	 * @apiSuccess {string} cart.list.itemName  Friendly name of the Item.
	 * @apiSuccess {string} cart.list.productName  Friendly name of the parent Product.
	 * @apiSuccess {string} cart.list.productImageUrl  URL for generic image of the parent Product.
	 * @apiSuccess {float} cart.list.totalPrice  Total amount for that Item.
	 * @apiSuccess {array} cart.list.itemList  Array of Item objects with current itemId.
	 * @apiSuccess {integer} cart.list.itemList.cartItemId  Unique CartItem Id for the Item.
	 * @apiSuccess {integer} cart.list.itemList.quantity  Quantity for instance of the Item.
	 * @apiSuccess {object} cart.list.itemList.photoCustomization  Item specific data for Photo manipulation of instance.
	 *  
	 * 
	 * @apiSuccessExample Success-Response:
	 *   {
	 *	    "error": false,
	 *	    "cart": {
	 *	        "cartId": "1256663052900631820",
	 *	        "totalPrice": 630,
	 *	        "orderDiscount": 63,
	 *	        "shipDiscount": 0,
	 *	        "discounts": [
	 *	            {
	 *	                "couponCode": "XXX098",
	 *	                "description": "10% off for orders over $50"
	 *	            },
	 *	           ...
	 *	        ],
	 *	        "list": [
	 *	            {
	 *	                "itemId": 1,
	 *	                "itemName": "Small GoPrint (3.5 x 4.25)",
	 *	                "productName": "GoPrint",
	 *	                "productImageUrl": "http://www.photoandgo.com/images/gfx-home_page/Photo-and-Go-Picture-GoPrints2.jpg",
	 *	                "totalPrice": 150,
	 *	                "itemList": [
	 *	                    {
	 *	                        "cartItemId": 7,
	 *	                        "quantity": 1,
	 *	                        "photoCustomization": {
	 *	                            "photoId": 186,
	 *	                            "photoUrl": "http://staging.photoandgo.s3.amazonaws.com/ScreenShot2016-05-10at11.41.27AM.png"
	 *	                        }
	 *	                    },
	 *	                   ...       
	 *	                ]
	 *	            },  
	 *	          ...   
	 *	        ]
	 *	    }
	 *	}
	 *
	 * @apiError CartNotFound No Cart found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "Could not delete Item."
	 *     }
	 */	
	app.delete('/cart/:cart_id/:cart_item_id', function(req, res) {
		Cart.deleteItem(req, function(result) {
			res.send(result);
		});
	});
	
	
	/**
	 * @api {post} /:user_id/policy Get Upload Policy
	 * @apiName getPolicy
	 * @apiGroup Auth
	 * @apiPermission none
	 *
	 * @apiParam {bigint} user_id Users unique ID.
	 * @apiParam {string} fileName Complete path of upload location.
	 *    
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} message Policy object.
	 * @apiSuccess {string} bucket  Destination S3 bucket name.
	 * @apiSuccess {string} awsKey  Account public key.
	 * @apiSuccess {string} policy AWS upload policy hash.
	 * @apiSuccess {string} signature Signature used for policy hash.
	 * 
	 * @apiExample {js} Example usage:
     *  $.ajax({
	 *	method: "POST",
	 *	url: "/12343456545678/policy",
	 *	data: {
	 *		"fileName": "full_path/image.jpg"
	 *	});   
	 *
	 * @apiSuccessExample Success-Response:
	 *	{
	 *		"error": false,
	 *		"message": {
	 *			"bucket": "staging.photoandgo",
	 *			"awsKey": "AKIAJW...",
	 *			"policy": "eyJleHBpcmF0aW...",
	 *			"signature": "tXf0wp95dU7L..."
	 *			}
	 *	}
	 *
	 * @apiError GetPolicyFailed Get Policy Failed
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "Could not get Policy."
	 *     }
	 */
	app.post('/:user_id/policy', function(req, res) {
		Auth.s3Policy(req, function(result) {
			res.send(result);
		});
	});
	
	/**
	 * @api {post} /sign_in Sign In
	 * @apiName postSignin
	 * @apiGroup Auth
	 * @apiPermission none
	 *
	 * @apiParam {string} email Account profile email address.
	 * @apiParam {string} password Account password.
	 * @apiParam {bigint} cartId Cart unique ID.  *optional
	 *    
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {bigint} userId User profile Id.
	 * @apiSuccess {string} token  Authorization Token for subsequent calls.
	 * @apiSuccess {boolean} loggedin  Status of log in process.
	 * @apiSuccess {bigint} cartId Cart Id assigned at login if not passed.
	 * 
	 * @apiExample {js} Example usage:
     *  $.ajax({
	 *	method: "POST",
	 *	url: "/sign_in",
	 *	data: {
	 *		"email": "bob@example.com", 
	 *		"password": "123456", 
	 *		"cartId": 23454367896734
	 *	});   
	 *
	 * @apiSuccessExample Success-Response:
	 *	{
	 *		"error": false,
	 *		"userId":1234345656786543,
	 *		"token":"1XBg67RTd34...",
	 *		"loggedin":true,
	 *		"cartId":23451238907654
	 *	}
	 *
	 * @apiError UserLoginFailed User Login Failed
	 * @apiError UserPassMismatch Username and Password do not match.
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "Could not login User."
	 *     }
	 */
	app.post('/sign_in', function(req, res) {
		Auth.signIn(req, function(result) {
			res.send(result);
		});
	});

	/**
	 * @api {post} /sign_up New Account
	 * @apiName postSignup
	 * @apiGroup Auth
	 * @apiPermission none
	 * 
	 * @apiParam {string} email Account email address.
	 * @apiParam {string} password Account password.
	 * @apiParam {string} name Account full name.
	 * @apiParam {bigint} cartId Cart unique ID.  *optional
	 *    
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {bigint} userId User profile Id.
	 * @apiSuccess {string} token  Authorization Token for subsequent calls.
	 * @apiSuccess {boolean} loggedin  Status of log in process.
	 * @apiSuccess {bigint} cartId Cart Id assigned at login if not passed.
	 * 
	 * @apiExample {js} Example usage:
     *  $.ajax({
	 *	method: "POST",
	 *	url: "/sign_up",
	 *	data: {
	 *		"email": "bob@example.com", 
	 *		"password": "123456",
	 *		"name":"Bob G. Public",
	 *		"cartId": 23454367896734
	 *	});   
	 *
	 * @apiSuccessExample Success-Response:
	 *	{
	 *		"error": false,
	 *		"userId":1234345656786543,
	 *		"token":"1XBg67RTd34...",
	 *		"loggedin":true,
	 *		"cartId":23451238907654
	 *	}
	 *
	 * @apiError UserRegisterFailed User Registration Failed
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "Could not create account."
	 *     }
	 */
	app.post('/sign_up', function(req, res) {
		Auth.signUp(req, function(result) {
			res.send(result);
		});
	});
	
	/**
	 * @api {get} /users/:user_id/photos Get Photos
	 * @apiName GetPhotos
	 * @apiGroup Photo
	 * @apiPermission Logged In
	 * 
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} photos Array of Photo objects.
	 * @apiSuccess {integer} photos.photoId  System Id of the Photo.
	 * @apiSuccess {string} photos.photoUrl  URL of the Photo.
	 * 
	 * @apiSuccessExample Success-Response:
	 *	{
	 *		"error": false,
	 *		"photos": [
	 *			{
	 *			"photoId": 113,
	 *			"photoUrl": "http://staging.photoandgo.s3.amazonaws.com/ScreenShot2016-05-17at5.04.17PM.png"
	 *			},
	 *			...
	 *		]
	 *	}
	 *
	 * @apiError PhotoNotFound No Photos found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Photos found for that User."
	 *     }
	 */
	app.get('/users/:user_id/photos', function(req, res) {
		Photo.getPhotos(req, function(result) {
			res.send(result);
		});
	});

	
	/**
	 * @api {get} /users/:user_id/photos/:photo_id Get Photo
	 * @apiName GetPhoto
	 * @apiGroup Photo
	 * @apiPermission Logged In
	 *
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 * @apiParam {integer} photo_id Photo unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} photos Photo object.
	 * @apiSuccess {integer} photos.photoId  System Id of the Photo.
	 * @apiSuccess {string} photos.photoUrl  URL of the Photo.
	 * 
	 * @apiSuccessExample Success-Response:
	 *    {
	 *		"error": false,
	 *		"photos": 
	 *			{
	 *				"photoId": 113,
	 *				"photoUrl": "http://staging.photoandgo.s3.amazonaws.com/ScreenShot2016-05-17at5.04.17PM.png"
	 *			}
	 *		}
	 *
	 * @apiError PhotoNotFound No Photos found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Photo found with that Id."
	 *     }
	 */
	app.get('/users/:user_id/photos/:photo_id', function(req, res) {
		Photo.getPhoto(req, function(result) {
			res.send(result);
		});
	});

	/**
	 * @api {delete} /users/:user_id/photos/:photo_id Delete Photo
	 * @apiName deletePhoto
	 * @apiGroup Photo
	 * @apiPermission Logged In
	 *
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 * @apiParam {integer} photo_id Photo unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} photos Array of Photo objects.
	 * @apiSuccess {integer} photos.photoId  System Id of the Photo.
	 * @apiSuccess {string} photos.photoUrl  URL of the Photo.
	 * 
	 * @apiSuccessExample Success-Response:
	 *	{
	 *		"error": false,
	 *		"photos": [
	 *			{
	 *			"photoId": 113,
	 *			"photoUrl": "http://staging.photoandgo.s3.amazonaws.com/ScreenShot2016-05-17at5.04.17PM.png"
	 *			},
	 *			...
	 *		]
	 *	}
	 *
	 * @apiError DeletePhotoFail Delete Photo Failed
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "Could not delete the Photo."
	 *     }
	 */
	app.delete('/users/:user_id/photos/:photo_id', function(req, res) {
		Photo.deletePhoto(req, function(result) {
			res.send(result);
		});
	});

	
	/**
	 * @api {post} /users/:user_id/photos Post Photo
	 * @apiName postPhoto
	 * @apiGroup Photo
	 * @apiPermission Logged In
	 *
	 * @apiHeader {string} Authorization Authorization token value.
	 * @apiParam {bigint} user_id Users unique ID.
	 * @apiParam {string} photoUrl URL of the Photo.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} photos Array of Photo objects.
	 * @apiSuccess {integer} photos.photoId  System Id of the Photo.
	 * @apiSuccess {string} photos.photoUrl  URL of the Photo.
	 * @apiExample {js} Example usage:
     *  $.ajax({
	 *	method: "POST",
	 *	url: "/users/:user_id/photos",
	 *	data: { "photoUrl": "http://aws.s3.com/image.jpg" }
	 *	});    
	 * @apiSuccessExample Success-Response:
	 *	{
	 *		"error": false,
	 *		"photos": [
	 *			{
	 *			"photoId": 113,
	 *			"photoUrl": "http://staging.photoandgo.s3.amazonaws.com/ScreenShot2016-05-17at5.04.17PM.png"
	 *			},
	 *			...
	 *		]
	 *	}
	 *
	 * @apiError PostPhotoFail Post Photo Failed
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "Could not POST the Photo."
	 *     }
	 */
	app.post('/users/:user_id/photos', function(req, res) {
		Photo.insertPhoto(req, function(result) {
			res.send(result);
		});
	});

	/**
	 * @api {get} /:sales_channel/products Get Products
	 * @apiName GetProducts
	 * @apiGroup Product
	 * @apiPermission none
	 *
	 * @apiParam {integer} sales_channel SalesChannel unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} products Array of Product objects.
	 * @apiSuccess {integer} products.id  System Id of Product.
	 * @apiSuccess {string} products.name  User friendly Product name.
	 * @apiSuccess {string} products.imageUrl  URL for generic Product image.
	 * @apiSuccess {string} products.description  User friendly description of the Product.
	 * @apiSuccess {array} products.categories Categories associated with the Product.
	 * @apiSuccess {float} products.highprice Highest price of an Item within that Product.
	 * @apiSuccess {float} products.lowprice Lowest price of an Item within that Product.
	 * 
	 * @apiSuccessExample Success-Response:
	 * 
	 *   {
	 *	    "error": false,
	 *	    "products": [
	 *	        {
	 *	            "id": 1,
	 *	            "name": "GoPrint",
	 *	            "imageUrl": "http://www.photoandgo.com/images/gfx-home_page/Photo-and-Go-Picture-GoPrints2.jpg",
	 *	            "description": "Now you can take your favorite pictures from anywhere.",
	 *	            "categories": [
	 *	                1
	 *	            ],
	 *	            "highprice": 10,
	 *	            "lowprice": 1
	 *	        },
	 *		...
	 *	    ]
	 *	 }
	 *
	 * @apiError ProductNotFound No Products found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Products found for that Sales Channel."
	 *     }
	 */
	app.get('/:sales_channel/products', function(req, res) {
		Product.getProducts(req.params, function(result) {
			res.send(result);
		});
	});

	
	/**
	 * @api {get} /:sales_channel/products/:product_id Get Product
	 * @apiName GetProduct
	 * @apiGroup Product
	 * @apiPermission none
	 *
	 * @apiParam {integer} sales_channel SalesChannel unique ID.
	 * @apiParam {integer} product_id Product unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} products Product object.
	 * @apiSuccess {integer} products.id  System Id of Product.
	 * @apiSuccess {string} products.name  User friendly Product name.
	 * @apiSuccess {string} products.imageUrl  URL for generic Product image.
	 * @apiSuccess {boolean} products.isDisabled Is Product Active.
	 * @apiSuccess {string} products.description  User friendly description of the Product.
	 * @apiSuccess {array} products.categories Categories associated with the Product.
	 * @apiSuccess {array} products.items Array of Item objects within the Product.
	 * @apiSuccess {integer} products.items.id Unique System Id.
	 * @apiSuccess {integer} products.items.productId Unique Id for parent Product.
	 * @apiSuccess {string} products.items.name Friendly name of the Item.
	 * @apiSuccess {object} products.items.options Options for the Item [size,color,etc].
	 * @apiSuccess {string} products.items.photoRealTemplateUrl URL for generic Item image.
	 * @apiSuccess {float}  products.items.defaultPrice Default price of the Item.
	 * @apiSuccess {boolean} products.items.isDisabled Is Item Active.
	 * @apiSuccess {string} products.items.sku SKU for the Item.
	 * 
	 * @apiSuccessExample Success-Response:
	 * 
	 *   {
	 *	    "error": false,
	 *	    "products": {
	 *	        "id": 1,
	 *	        "name": "GoPrint",
	 *	        "isDisabled": false,
	 *	        "imageUrl": "http://www.photoandgo.com/images/gfx-home_page/Photo-and-Go-Picture-GoPrints2.jpg",
	 *	        "description": "Now you can take your favorite pictures from anywhere...",
	 *	        "categories": [
	 *	            1
	 *	        ],
	 *	        "items": [
	 *	            {
	 *	                "id": 1,
	 *	                "productId": 1,
	 *	                "name": "Small GoPrint (3.5 x 4.25)",
	 *	                "options": {
	 *	                    "size": "small"
	 *	                },
	 *	                "photoRealTemplateUrl": "http://image.com/1.jpg",
	 *	                "defaultPrice": 1,
	 *	                "isDisabled": false,
	 *	                "sku": "703040"
	 *	            },
	 *	           ...
	 *	        ]
	 *	    }
	 *	}
	 *
	 * @apiError ProductNotFound No Products found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Product found with that Id."
	 *     }
	 */
	app.get('/:sales_channel/products/:product_id', function(req, res) {
		Product.getProduct(req.params, function(result) {
			res.send(result);
		});
	});

	
	/**
	 * @api {get} /:sales_channel/products/:product_id/items Get Items
	 * @apiName GetItems
	 * @apiGroup Product
	 * @apiPermission none
	 *
	 * @apiParam {integer} sales_channel SalesChannel unique ID.
	 * @apiParam {integer} product_id Product unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} items Array of Item objects.
	 * @apiSuccess {integer} items.id Unique System Id.
	 * @apiSuccess {string} items.name Friendly name of the Item.
	 * @apiSuccess {object} items.options Options for the Item [size,color,etc].
	 * @apiSuccess {string} items.photoRealTemplateUrl URL for generic Item image.
	 * @apiSuccess {float}  items.price Price of the Item.
	 * @apiSuccess {string} items.sku SKU for the Item.
	 * 
	 * @apiSuccessExample Success-Response:
	 * 
	 *  {
	 *	    "error": false,
	 *	    "items": [
	 *	        {
	 *	            "id": 1,
	 *	            "name": "Small GoPrint (3.5 x 4.25)",
	 *	            "options": {
	 *	                "size": "small"
	 *	            },
	 *	            "photoRealTemplateUrl": "http://image.com/1.jpg",
	 *	            "price": 1,
	 *	            "sku": "703040"
	 *	        },
	 *	       ...
	 *	    ]
	 *	}
	 *
	 * @apiError ItemNotFound No Item found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Items found with that Product Id."
	 *     }
	 */
	app.get('/:sales_channel/products/:product_id/items', function(req, res) {
		Product.getItems(req.params, function(result) {
			res.send(result);
		});
	});

	
	/**
	 * @api {get} /:sales_channel/products/:product_id/items/:item_id Get Item
	 * @apiName GetItem
	 * @apiGroup Product
	 * @apiPermission none
	 *
	 * @apiParam {integer} sales_channel SalesChannel unique ID.
	 * @apiParam {integer} product_id Product unique ID.
	 * @apiParam {integer} item_id Item unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} items Item objects.
	 * @apiSuccess {integer} items.id Unique System Id.
	 * @apiSuccess {string} items.name Friendly name of the Item.
	 * @apiSuccess {object} items.options Options for the Item [size,color,etc].
	 * @apiSuccess {string} items.photoRealTemplateUrl URL for generic Item image.
	 * @apiSuccess {float}  items.price Price of the Item.
	 * @apiSuccess {string} items.sku SKU for the Item.
	 * 
	 * @apiSuccessExample Success-Response:
	 * 
	 *  {
	 *	    "error": false,
	 *	    "items": 
	 *	        {
	 *	            "id": 1,
	 *	            "name": "Small GoPrint (3.5 x 4.25)",
	 *	            "options": {
	 *	                "size": "small"
	 *	            },
	 *	            "photoRealTemplateUrl": "http://image.com/1.jpg",
	 *	            "price": 1,
	 *	            "sku": "703040"
	 *	        }
	 *	}
	 *
	 * @apiError ItemNotFound No Item found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Item found with that Item Id."
	 *     }
	 */
	app.get('/:sales_channel/products/:product_id/items/:item_id', function(
			req, res) {
		Product.getItem(req.params, function(result) {
			res.send(result);
		});
	});
	
	/**
	 * @api {get} /:sales_channel/categories Get Categories
	 * @apiName GetCategories
	 * @apiGroup Category
	 * @apiPermission none
	 *
	 * @apiParam {integer} sales_channel SalesChannel unique ID.
	 *
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {array} categories Categories within given SalesChannel.
	 * @apiSuccess {integer} categories.id  System Id of Category.
	 * @apiSuccess {string} categories.name  User friendly Category name.
	 * @apiSuccess {array} homepage  Categories to display on the home page.
	 * @apiSuccess {integer} homepage.id  System Id of Category.
	 * @apiSuccess {string} homepage.name  User friendly Category name.
	 * 
	 * @apiSuccessExample Success-Response:
	 *    {
	 *	    "error": false,
	 *	    "categories": [
	 *	        {
	 *	            "id": 1,
	 *	            "name": "Make Yours"
	 *	        },
	 *	        ...
	 *	    ],
	 *	    "homepage": [
	 *	        {
	 *	            "id": 1,
	 *	            "name": "Make Yours"
	 *	        },
	 *	        ...
	 *	    ]
	 *	}
	 *
	 * @apiError CategoryNotFound No Categories found
	 *
	 * @apiErrorExample Error-Response:
	 *     {
	 *       "error": true,
	 *       "errorMessage": "No Categories found for that Sales Channel."
	 *     }
	 */
	app.get('/:sales_channel/categories', function(req, res) {
		Category.getCategories(req.params, function(result) {
			res.send(result);
		});
	});

	/**
	 * @api {get} /:sales_channel/categories/:category_id Get Category
	 * @apiName GetCategory
	 * @apiGroup Category
	 * @apiPermission none
	 * 
	 * @apiParam {integer} sales_channel SalesChannel unique System ID.
	 * @apiParam {integer} category_id Category unique System ID.
	 * 
	 * @apiSuccess {boolean} error Trigger to display generic error message.
	 * @apiSuccess {object} categories Category object.
	 * @apiSuccess {array} categories Categories within given SalesChannel.
	 * @apiSuccess {integer} categories.id System Id of Category.
	 * @apiSuccess {string} categories.name User friendly Category name.
	 * 
	 * @apiSuccessExample Success-Response: 
	 * 		{
	 *		    "error": false,
	 *		    "categories": {
	 *		        "id": 1,
	 *		        "name": "Make Yours"
	 *		    }
	 *		}				
	 * 
	 * @apiError CategoryNotFound No Categories found
	 * 
	 * @apiErrorExample Error-Response: 
	 * 	{ 
	 * 		"error": true, 
	 * 		"errorMessage": "No Category found with that Id." 
	 *  }
	 */
	app.get('/:sales_channel/categories/:category_id', function(req, res) {
		Category.getCategory(req.params, function(result) {
			res.send(result);
		});
	});
}