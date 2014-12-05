var HttpServer = require('./HttpServer');

define([
  '/public/Application',
  '/public/cfg/app',
  '/ServerApi'
], function(Application, cfgFile, ServerApi) {
  /**
   * Absolute base dir to this application!
   * @param {String} absoluteBaseDir
   */
  var ServerApplication = function(absoluteBaseDir) {
    if (absoluteBaseDir.charAt(absoluteBaseDir.length - 1) !== '/')
      absoluteBaseDir += '/';

    this.absoluteBaseDir = absoluteBaseDir;
    this.cfg = this.config();
  };

  ServerApplication.prototype = new Application(cfgFile);
  var _pt = ServerApplication.prototype;

  _pt.getAppDir = function(dir) {
    return this.absoluteBaseDir + this.cfg.path[dir];
  };

  _pt.startServer = function() {
    var httpSever = new HttpServer(
                      this.absoluteBaseDir,
                      this.getAppDir('pub')
                    );

    var cfgHttp = this.cfg.http;

    httpSever.createServer({
      host: cfgHttp.host,
      port: parseInt(cfgHttp.port, 10)
    });

    var cfgWebSocket = this.cfg.websocket;
    var serverApi = new ServerApi({
      'sources': this.cfg.sources
    });

    // Create WebSocket server
    serverApi.createServer({
      host: cfgWebSocket.host,
      port: parseInt(cfgWebSocket.port, 10)
    });

    console.log('Started server.');
  };

  return ServerApplication;
});
