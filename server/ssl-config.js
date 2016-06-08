var path = require('path'),
fs = require("fs");
//exports.privateKey = fs.readFileSync(path.join(__dirname, './private/privatekey.pem')).toString();
//exports.certificate = fs.readFileSync(path.join(__dirname, './private/certificate.pem')).toString();
exports.privateKey = fs.readFileSync(path.join(__dirname, './private/thawt.key')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, './private/thawt.crt')).toString();
exports.ca = fs.readFileSync(path.join(__dirname, './private/IntermediateCA.cer')).toString();