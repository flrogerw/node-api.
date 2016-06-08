var pg = require('pg');
var conString = "postgres://photogo:7x36mg!4@prod-photoandgo.ca7cinmuzpxy.us-west-2.rds.amazonaws.com:5432/photoandgo";

module.exports = function(Postgresql) {
	
	Postgresql.getColumns = function( data ){
		
		return Object.keys(data).map(function (key) {
			var res = '"'+key+'"';
			return res;
			});
		
	}
	
	Postgresql.getValues = function( data ){
		
		return Object.keys(data).map(function (key) {	
		if( typeof data[key] == "object"){
			data[key] = JSON.stringify(data[key]);
		}	
			
		var res = (typeof data[key] == "string")? '\''+data[key]+'\'': data[key];
		return res;
		});
	}
	

	Postgresql.query = function( query, cb){
		
		 var client = new pg.Client(conString);
    	 client.connect(function(err) {
    	    	
      	  if(err) {
      	
      		  cb(true, 'Could not connect to the DB', err);
      	  }else{
      		  
      		 client.query(query, function(err, dbResult) {
      		    	    
      		    if(err) {
            		cb(true, 'DB query failed', err);
      		    }else{
      		    	dbResult.rows[0] = (typeof dbResult.rows[0] == 'undefined')? {}: dbResult.rows[0];
      		    	cb(null,{data: dbResult.rows});
      		    }
      		  client.end();
      		 });
      	  }
      });  
	}
	
	
};