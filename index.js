var uuid = require('node-uuid');

var Encoder = require('./lib/encoder');
var run = require('./lib/run');

var img2attach = function (html) {
	var encoder = new Encoder();
	return run(html, uuid, encoder);
};

module.exports = img2attach;