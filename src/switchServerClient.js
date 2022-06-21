const fs = require('fs');

let mv = process.argv[2]
let what = process.argv[3]

if (mv == "t") {
  let source = what === "c" ? "src/indexClient.tsx" : "src/indexServer.tsx"
  fs.copyFile(source, 'src/index.tsx', (err) => {
    if (err) throw err;
    console.log("Successfully modified index.tsx");
  });

  console.log({ what, source });
}
else {
  let dest = what === "c" ? "build-client" : "build-server"
  fs.rename("build", dest, function (err) {
    if (err) throw err
    console.log('Successfully renamed - AKA moved!')
  })
}