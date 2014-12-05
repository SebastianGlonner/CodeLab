var fs = require('fs');

define(['messaging/server'], function(MessagingServer) {
  var walkDirAsync = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
  };

  var walkDirSync = function(dir, done) {
    try {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var i = 0;
      (function next() {
    try {
        var file = list[i++];
        if (!file)
          return done(null, results);

        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            results.push(file);
            next();
          }
        });

    } catch (error) {
      console.log(error);
    }

      })();
    });

    } catch (error) {
      console.log(error);
    }
  };

  var Module = function(cfg) {
    if (!cfg) throw new Error('Config required.');

    if (!cfg.sources) throw new Error('Config "sources" required.');

    this.cfg = {
      'sources': cfg.sources
    };
  };

  Module.prototype = new MessagingServer();
  Module.prototype.listPatterns = function() {
    return walkDir();
  };

  Module.prototype.version = function() {
    return '0.0.1';
  };

  Module.prototype.projects = function() {
    return new Promise(function(resolve, reject) {
      try {
      walkDirSync(this.cfg.sources, function(err, results) {
        if (err)
          reject(err);

        resolve(results);
      });
    } catch (error) {
      console.log(error);
    }
    }.bind(this));
  };

  return Module;
});
