var cheerio = require('cheerio');
var uuid = require('node-uuid');

var Encoder = require('./lib/encoder');
var Q = require('q');

var encoder = new Encoder();


var html = "<img src='http://www.peoriagermans.net/07Oktoberfest2/img64.jpg'>" + 
"<img src='http://www.google.com/'>";

var $ = cheerio.load(html);
var objects = [];


$('img').map(function (index, element) {
	var src = $(element).attr('src');
	var cid = uuid.v4();
	objects.push({
		cid: cid,
		src: src		
	});
	$(element).attr('src', 'cid:' + cid);
});


var promises = objects.map(function (element) {
	var src = element.src;
	return encoder.encodeRemoteImg(src);
});

Q.all(promises).then(function (datas) {
	objects.map(function (element, index) {
		element.data = datas[index];
	});

	console.log(objects);
});


//console.log($.html());
