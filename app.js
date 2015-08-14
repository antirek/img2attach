var img2attach = require('./index');

var html = "<img src='http://www.peoriagermans.net/07Oktoberfest2/img64.jpg'>" + 
"<img src='http://www.google.com/'>";

img2attach(html).then(function (data) {
	console.log(data);
});