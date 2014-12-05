var dest = 'src'; // 'bin';

require('./public/lib/minjector/' + dest + '/minjector');

var minjectorConfig = require('./public/cfg/minjector.json');
Minjector.config(minjectorConfig);
Minjector.config({
  'baseUrl': __dirname + '/',
  'libUrl': __dirname + '/public/lib/'
});

define('mainServer', ['/ServerApplication'], function(ServerApplication) {
  var serverApp = new ServerApplication(__dirname);
  serverApp.startServer();

});
