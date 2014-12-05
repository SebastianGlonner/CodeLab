define([
  '/cfg/app',
  '/Application',
  '/ClientApi',
  'jsx',
  'Router',
  'jsDOMx'
], function(cfgFile, Application, ClientApi, jsx, Router, jsDOMx) {
  var ClientApplication = function() {
    try {
      this.cfg = this.config();

      this.initApp();
      this.initRouter();

      this.initApiMessenger(function(api) {
        api.projects().then(function(result) {
          console.log(result);
        }). catch (function(err) {
          console.error(err);
        });
      }.bind(this));
    } catch (e) {
      console.error(e.stack);
    }
  };

  ClientApplication.prototype = new Application(cfgFile);
  var _pt = ClientApplication.prototype;

  _pt.initApp = function() {
    var ui = {};
    document.body
        .appendChild(jsDOMx.render(this.tplFrame, null, ui));
  };

  _pt.tplFrame = function(_) {
    return [
      _('div',
          '.header',
          ':header',

          'mein header'
      ),
      _('div',
          '.snippets',
          ':body',

          'mein body'
      )
    ];
  };

  _pt.initApiMessenger = function(callback) {
    var clientApi = new ClientApi();
    var ws = clientApi.createConnection(
        'ws://' + this.cfg.websocket.host + ':' + this.cfg.websocket.port
    );

    ws.onopen = function() {
      callback(clientApi);
    };

  };

  _pt.initRouter = function() {
    var routing = new Router(
        'http://localhost:8888'
        );
    routing.routed.attach(this.dispatchUrlToController.bind(this));
    routing.start(true);
  };

  _pt.dispatchUrlToController = function(url) {
    var pieces = url.split('/');

    var controller = pieces[0] || 'home';
    var action = pieces[1] || 'index';

    controller = '/' + this.cfg.path.controller + controller;
    define([controller], function(Controller) {
      var con = new Controller();
      con.invokeAction(action);
    });
  };

  return ClientApplication;
});


