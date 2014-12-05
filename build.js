var uglifyJsBuilder = require('./public/lib/minjector/build.js');

var files = [
  'server.js'
];

console.log(JSON.stringify(uglifyJsBuilder(files), null, 4));