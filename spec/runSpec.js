var run = require('../lib/run');
var Q = require('q');

var encoder = {
  encode: function (src) {
    return Q.resolve({
      content: 'data', 
      contentType: 'image/jpg'
    });
  }
};

var uuid = {
  v4: function () {
    return 1;
  }
};

var html = "<img src='1.png'>";

var expected = {
  html: '<img src="cid:1">',
  attachments: [
    { 
      cid: 1,
      src: '1.png',
      encoding: 'base64',
      content: 'data',
      contentType: 'image/jpg' 
    } 
  ]
};

describe('Test', function () {
  it('check simples', function (done) {
    run(html, uuid, encoder).then(function (data) {      

      expect(data.html).toEqual(expected.html);
      expect(data.attachments).toEqual(expected.attachments);

      done();
    });
  });
});