var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var HttpServer = function(absoluteBaseDir, absolutePublicDir) {
  this.absoluteBaseDir = absoluteBaseDir;
  this.absolutePublicDir = path.normalize(absolutePublicDir);
  // if (this.publicPath.charAt(0) !== path.sep)
  //   this.publicPath = path.sep + this.publicPath;

  this.nodeFs = fs;
  this.mTypeMap = {
    '.js': 'text/javascript',
    '.css': 'text/css'
  };
};

var _proto = HttpServer.prototype;

_proto.createServer = function(cfg) {
  http.createServer(this.handleRequest.bind(this)).listen(
      cfg.port,
      cfg.host
  );
};

_proto.handleRequest = function(request, response) {
  var pathname = decodeURI(url.parse(request.url).pathname);

  if (pathname === '/') {
    this.serveIndex(request, response);
    return;

  }

  var get = path.join(this.absoluteBaseDir, pathname);

  if (false) {
    console.log('==============');
    console.log(get);
    console.log(this.absolutePublicDir);
    console.log(get.indexOf(this.absolutePublicDir) === 0);
  }

  if (get.indexOf(this.absolutePublicDir) === 0) {
    this.serveFile(request, response, get);
    return;
  }
  response.writeHead(403, {'Content-Type': 'text/plain'}, 'Forbidden');
  response.end();
};


_proto.serveFile = function(request, response, file) {
  var rs = this.nodeFs.createReadStream(file);
  rs.on('open', function() {
    var mtype = this.mTypeMap[path.extname(file)];
    if (!mtype) {
      response.writeHead(
          406,
          {'Content-Type': 'text/plain'},
          'Not Acceptable'
      );
      response.end();
      return;
    }

    response.writeHead(200, {'Content-Type': mtype});
    rs.pipe(response);
  }.bind(this));

  rs.on('error', function() {
    response.writeHead(404, {'Content-Type': 'text/plain'}, 'Not Found');
    response.end();
  });
};


_proto.serveIndex = function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});

  var minjectorConfig = require(this.absoluteBaseDir + '/public/cfg/minjector.json');

  response.write('<!doctype html>' +
      '<html lang="en" ><head>' +
      '<meta charset="utf-8" />' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
      '<title>CodeLab</title>' +
      '<meta name="author" content="sebastian glonner <info@efesus.de>" />' +
      '<meta name="copyright" content="info@fesus.de Copyright (c) 2014" />' +
      '<link media="all" rel="stylesheet" type="text/css" ' +
      'href="public/css/index.css"/>' +
      '</head><body>' +
          '<script type="text/javascript" src="' +
          './public/lib/minjector/src/minjector.js' +
          '"></script>' +
          '<script type="text/javascript">\n' +
          'Minjector.config(' + JSON.stringify(minjectorConfig) + ');' +
          'define(\'mainClient\', [\'./ClientApplication\'], function(App) {' +
              'new App()' +
          '});\n</script>' +
      '</body></html>'
  );

  response.end();
};

module.exports = HttpServer;
