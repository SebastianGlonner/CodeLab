define(['messaging/client'], function(MessagingClient) {
  var SystemClientApi = function() {};
  SystemClientApi.prototype = new MessagingClient();

  SystemClientApi.prototype.version = function() {
    return this.execute('version');
  };

  SystemClientApi.prototype.projects = function() {
    return this.execute('projects');
  };

  return SystemClientApi;
});
/*
new Promise(function (resolve, reject) {
  try {
    var ws = new WebSocket("ws://" + CONFIG.WS.host +':' + CONFIG.WS.port);
    ws.onerror = function(event) {
      reject('Ws Error received.');
    };

    ws.onopen = function() {
      appendToBody('Ws Event: Open');
      resolve(ws);
    };
  } catch (e) {
    reject(e);
  }

}).then(function(wsConnection) {
  new Application(wsConnection);
}, function(error) {
  alert('Damn errors: ' + error);
});

var Application = function(wsConnection) {
  wsConnection.onmessage = function(evt) {
    appendToBody('Ws Incomming Message:' + evt.data);
  };

  wsConnection.onclose = function() {
    appendToBody('Ws closed.');

  };

  wsConnection.send(JSON.stringify({
    execute: 'listPatterns'
  }));

};

var BaseAPI = function(wsConnection) {

  return {
    listPatterns: function() {
      new Promis(function(resolve, reject) {
        wsConnection.send(JSON.stringify({
          execute: 'listPatterns'
        }));
      });
    }
  };
};
*/
