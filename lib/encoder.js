var fs = require('fs');
var request = require('request');
var url = require('url');
var path = require('path');
var mime = require('mime');

var encoder = function () {
  var _encodeLocalImg = function(src, promise) {
    fs.readFile(src, 'base64', function fileRead(err, data) {
      if (err) {
        promise.reject(err);
        return;
      }

      var result = {
        'content-type': mime.lookup(src), 
        encoded: data
      };
      
      promise.resolve(result);
    });
  };

  var encodeLocalImg = function(src, opts, promise) {
    if (typeof opts === 'function') {
      promise = opts;
      opts = {};
    }

    var loc = src;

    loc = path.join((opts.baseDir || __dirname), src);

    fs.exists(loc, function(exists) {
      // Couldn't find or read the file, if we have a base URI to work
      // with try to fetch it remotely.
      if (!exists && typeof opts.serverURI !== 'undefined') {
        encodeRemoteImg(url.resolve(opts.serverURI, src), opts, promise);
        return;
      }
      else if (!exists) {
        promise.reject('File does not exist or is not readable.');
        return;
      }

      _encodeLocalImg(loc, promise);
    });
  };

  var encodeRemoteImg = function(src, opts, promise) {
    if (typeof opts === 'function') {
      promise = opts;
      opts = {};
    }

    var options = {
      uri: url.parse(src),
      encoding: 'binary'
    };

    request(options, function(err, res, body) {
      if (res.statusCode !== 200) {
        promise.reject(res.statusCode);
        return;
      }

      var buf = new Buffer(body, 'binary');
      var result = {
        'content-type': res.headers['content-type'],
        data: buf.toString('base64')
      };

      promise.resolve(result);
    });
  };

  return {
    encodeLocalImg: encodeLocalImg,
    encodeRemoteImg: encodeRemoteImg
  }

};

module.exports = encoder;