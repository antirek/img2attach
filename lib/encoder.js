var fs = require('fs');
var request = require('request');
var url = require('url');
var path = require('path');
var mime = require('mime');
var Q = require('q');

var encoder = function () {
  var _encodeLocalImg = function (src) {
    var defer = Q.defer();

    fs.readFile(src, 'base64', function (err, data) {
      if (err) {
        defer.reject(err);        
      }

      var result = {
        contentType: mime.lookup(src), 
        content: data
      };      
      defer.resolve(result);
    });

    return defer.promise;
  };

  var fileExists = function (src) {
    var defer = Q.defer();
    fs.exists(src, function (exists) {
       if (exists) {
        defer.resolve();        
      } else {
        defer.reject('File ' + src + 'does not exist or is not readable.');
      }
    });
    return defer.promise;
  }

  var encodeLocalImg = function (src) {    
    return fileExists(src)
      .then(function () {        
        return _encodeLocalImg(src);
      })
    };

  var encodeRemoteImg = function (src) {
    var defer = Q.defer();

    var options = {
      uri: url.parse(src),
      encoding: 'binary'
    };

    request(options, function (err, res, body) {
      if (res.statusCode !== 200) {
        defer.reject(res.statusCode);
        return;
      }

      var buf = new Buffer(body, 'binary');
      var result = {
        'contentType': res.headers['content-type'],
        content: buf.toString('base64')
      };

      defer.resolve(result);
    });
    return defer.promise;
  };

  return {
    encodeLocalImg: encodeLocalImg,
    encodeRemoteImg: encodeRemoteImg
  }

};

module.exports = encoder;