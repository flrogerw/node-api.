var loopback = require('loopback');
var boot = require('loopback-boot');
var bodyParser  = require('body-parser');
var http = require('http');
var https = require('https');
var sslConfig = require('./ssl-config');
var inspect = require('util').inspect;


var app = module.exports = loopback();
app.use(loopback.context());

// boot scripts mount components like REST API
boot(app, __dirname);

app.start = function(httpOnly) {

var httpOnly = true;

  if(httpOnly === undefined) {
    httpOnly = process.env.HTTP;
  }
  var server = null;
  if(!httpOnly) {
    var options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate,
      ca: sslConfig.ca
    };
 //console.log(httpOnly);
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }
  server.listen(app.get('port'), function() {
    var baseUrl = (httpOnly? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
    app.emit('started', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
  });
  return server;
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}