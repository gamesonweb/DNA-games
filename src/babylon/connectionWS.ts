import { Vector3 } from "babylonjs";
import { Avatar } from "./avatar";
import { scene, set_my_sphere, sphere1 } from "./main";
import { makeid } from "./tools";

export var ws: WebSocket;
export var player_list: Map<string, Avatar> = new Map();
export var username: string;

export function connect_to_ws() {
    //RUNNING SERVER ON LOCAL FOR DEV
    ws = new WebSocket("ws://127.0.0.1:8080");
    //RUNNING SERVER ON HEROKU FOR DEPLOYMENT
    //var ws = new WebSocket("ws://babylongameserver.herokuapp.com/");
    var username_entry = prompt("Enter your username: ");
    username = username_entry ? username_entry : "";
    if (username == "") {
        username = makeid(10);
    }

    //small timeout to give the websocket the time to open
    setTimeout(() => {
        ws.send(
            JSON.stringify(
                {
                    route: "login",
                    content: username
                }));
    },
        1000);

    //procedure on message received from server
    ws.addEventListener('message', function (event) {
        //console.log("received message: " + event.data);
        let messageReceived = JSON.parse(event.data);
        switch (messageReceived.route) {
            case 'login': {
                var sphere = new Avatar(scene);
                var sender_name = messageReceived.content;
                player_list.set(sender_name, sphere);
                if (sender_name == username) set_my_sphere();
                console.log("LOGIN IN: " + sender_name + ", new player list: " + player_list);
                break;
            }
            case 'logout': {
                //console.log("received logout message: " + messageReceived.content);
                break;
            }
            case 'message': {
                //let messaSgeContent = JSON.parse(messageReceived.content);
                //console.log("received message message: " + messageReceived.content);
                break;
            }
            case 'userlist': {
                //console.log("received userlist message: " + messageReceived.content);
                break;
            }
            case 'position': {
                //We parse the message's content to get something of the form:
                //{pos_x: int, pos_y: int, pos_z: int, username: string}
                let messageContent = JSON.parse(messageReceived.content);
                if (messageContent.username == username) break;

                //for debugging
                console.log("received position update message: " + messageReceived.content);
                console.log("player_list: " + [...player_list.keys()]);
                console.log("message's username: " + messageContent.username);

                //We find the avatar linked to the username in our player_list map
                let avatar_to_move = player_list.get(messageContent.username);

                //if we found nothing, we add the username in the player_list map, and associate it with a new avatar
                if (avatar_to_move == undefined) {
                    console.log("FAILED DE FIND PLAYER, ADDING IT TO THE LIST");
                    player_list.set(messageContent.username, new Avatar(scene));
                    avatar_to_move = player_list.get(messageContent.username);
                }

                //avatar_to_move should now be affected and we can give it the new position
                if (avatar_to_move) avatar_to_move.position = new Vector3(messageContent.pos_x, messageContent.pos_y, messageContent.pos_z);

                //for debugging, should NOT happen ever
                else { console.log("WTF???????") }

                console.log("position avatar to move: " + avatar_to_move?.position);

                break;
            }
            default: console.log("received a message from server with an invalid route: ");
        }
    });

    setInterval(() => {
        if (username && player_list.get(username)) {
            var position_player = JSON.stringify({
                pos_x: player_list.get(username)?.position.x,
                pos_y: player_list.get(username)?.position.y,
                pos_z: player_list.get(username)?.position.z,
                username: username,
            })
            console.log("will send " + position_player);
            ws.send(
                JSON.stringify({
                    route: "position",
                    content: position_player
                }))
        }

    },
        100);

}