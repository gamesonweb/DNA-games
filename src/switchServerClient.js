const fs = require('fs');

let mv = process.argv[2]
let what = process.argv[3]

if (mv == "t") {
  fs.writeFileSync('src/index.tsx', `
    import { main } from "./${what === "c" ? "indexClient" : "indexServer"}";
    main()`);
} else {
  let dest = what === "c" ? "./build-client" : "./build-server"
  fs.rmSync(dest, { recursive: true, force: true });
  fs.renameSync("build", dest, function (err) {
    if (err) throw err
    console.log('Successfully renamed - AKA moved!')
  })
  if (what !== "c") { // that is : dealing with serveur building
    let path = dest + "/static/js/"
    let fic = path + fs.readdirSync(path).filter(e => e.endsWith("js"))[0]
    let firstLine = ` 
const WebSocket = require('ws')
var XMLHttpRequest = require('xhr2');
var fs = require('fs')
var serverFolderFilesDir = process.cwd()
console.log(serverFolderFilesDir);
//process.chdir('..');
console.log(process.cwd());
//const liveServer = require("live-server");

//liveServer.start({
//  open: false,
//  port: 3000
//});`
    let ct = firstLine + fs.readFileSync(fic).toString()
    fs.writeFileSync(fic, ct)
  }
}