const fs = require('fs');

let mv = process.argv[2]
let what = process.argv[3]

if (mv == "t") {
  fs.writeFileSync('src/index.tsx', `
import { main } from "./${what === "c" ? "indexClient" : "indexServer"}";

main()
  `);
}
else {
  let dest = what === "c" ? "build-client" : "build-server"
  fs.rename("build", dest, function (err) {
    if (err) throw err
    console.log('Successfully renamed - AKA moved!')
  })
}