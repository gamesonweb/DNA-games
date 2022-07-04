
const WebSocket = require('ws')
var XMLHttpRequest = require('xhr2');
var fs = require('fs')
var serverFolderFilesDir = process.cwd()
console.log(serverFolderFilesDir);
// process.chdir('..');
console.log(process.cwd());
const liveServer = require("live-server");

liveServer.start({
  open: false,
  port: 3000,
});

console.log(12)
