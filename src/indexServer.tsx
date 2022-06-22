export function main() {
  var port = process.argv[2]
  var adr = "ws://127.0.0.1:" + port
  var ws = new WebSocket(adr);

  ws.onerror = () => {
    console.log("error trying to connect to socket on " + adr);
  };


  //we start our request process when the connection is established
  ws.onopen = () => {
    //Ask username to user and removes " and ' characters. If user fails to give a username, give them a random id
    setInterval(() => { ws.send("keepalive") }, 5000);
  };
}