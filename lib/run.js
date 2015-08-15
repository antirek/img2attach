var cheerio = require('cheerio');
var Q = require('q');

var run = function (html, uuid, encoder) {  
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
    return encoder.encode(element.src);    
  });

  return Q.all(promises).then(function (datas) {
    objects.map(function (element, index) {
      element.content = datas[index].content;
      element.contentType = datas[index].contentType;
    });   
  }).then(function () {
    return Q.resolve({
      html: $.html(),
      attachments: objects
    });
  });
};

module.exports = run;