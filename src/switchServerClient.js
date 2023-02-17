const fs = require("fs");

const changeIndexContent = (isClient) => {
  fs.writeFileSync(
    "src/index.tsx",
    `import { main } from "./${
      isClient ? "indexClient" : "indexServer"
    }";\nmain()`
  );
};

const prependServerInput = (isClient) => {
  if (!isClient) {
    let path = "./build/static/js/";
    let fic = path + fs.readdirSync(path).filter((e) => e.endsWith("js"))[0];
    let firstLine = `const WebSocket = require('ws');var XMLHttpRequest = require('xhr2');var fs = require('fs');var serverFolderFilesDir = process.cwd();console.log(serverFolderFilesDir);console.log(process.cwd());const liveServer = require("live-server");liveServer.start({open: false,port: 3000});`;
    let ct = firstLine + fs.readFileSync(fic).toString();
    fs.writeFileSync(fic, ct);
  }
};

const moveBuildFolder = (isClient) => {
  let dest = isClient ? "./build-client" : "./build-server";
  prependServerInput(isClient);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.renameSync("build", dest, function (err) {
    if (err) throw err;
    console.log("Successfully renamed - AKA moved!");
  });
  changeIndexContent(true);
};

const main = (move, isClient) => {
  if (move) changeIndexContent(isClient);
  else moveBuildFolder(isClient);
};

main(process.argv[2] === "t", process.argv[3] === "c");
