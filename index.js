var cheerio = require('cheerio');
var uuid = require('node-uuid');
var Q = require('q');

var Encoder = require('./lib/encoder');

var img2attach = function (html) {
	var defer = Q.defer();

	var encoder = new Encoder();

	var $ = cheerio.load(html);
	var objects = [];

	$('img').map(function (index, element) {
		var src = $(element).attr('src');
		var cid = uuid.v4();
		objects.push({
			cid: cid,
			src: src,
			encoding: 'base64'
		});

		$(element).attr('src', 'cid:' + cid);
	});

	var promises = objects.map(function (element) {
		var src = element.src;
		return encoder.encodeRemoteImg(src);
	});

	Q.all(promises).then(function (datas) {
		objects.map(function (element, index) {
			element.content = datas[index].content;
			element.contentType = datas[index].contentType;
		});

		defer.resolve({
			html: $.html(),
			attachments: objects
		});
	});

	return defer.promise;
};

module.exports = img2attach;