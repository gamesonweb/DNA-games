export function main() {
  var ws = new WebSocket("ws://127.0.0.1:8080");

  ws.onerror = () => {
    console.log("error trying to connect to socket on ws://127.0.0.1:8080");

  };


  //we start our request process when the connection is established
  ws.onopen = () => {
    //Ask username to user and removes " and ' characters. If user fails to give a username, give them a random id
    setInterval(() => { ws.send("keepalive") }, 5000);
  };
}