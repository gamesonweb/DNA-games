export function connect_to_ws() {
    //RUNNING SERVER ON HEROKU FOR DEPLOYMENT
    var ws = new WebSocket("ws://127.0.0.1:8080");
    //RUNNING SERVER ON LOCAL FOR DEV
    //var ws = new WebSocket("ws://babylongameserver.herokuapp.com/");
    var username = prompt("Enter your username: ");
    if (username == null || username == "") {
        username = "anonyme";
    }

    setTimeout(() => ws.send(
        JSON.stringify(
            {
                route: "login",
                content: username
            })),
        10);
}