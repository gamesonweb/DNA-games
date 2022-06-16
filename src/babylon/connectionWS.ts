import { Mesh, Vector3, Axis } from "babylonjs";
import { Avatar } from "./avatar";
import { Bullet } from "./bullet";
import { scene, set_my_sphere } from "./main";
import { makeid } from "./tools";

export var ws: WebSocket;
export var player_list: Map<string, Avatar> = new Map();
export var username: string;
export var meshes: Mesh[] = [];

window.playerList = player_list;

type position = { pos_x: number, pos_y: number, pos_z: number, }

type receiveContent = {
    pos_x: number, pos_y: number, pos_z: number,
    username: string, direction: Vector3
}

export function connect_to_ws() {

    // !!!!!! CHANGE COMMENTED LINE TO CONNECT TO HEROKU BEFORE PUSHING A BUILD !!!!! \\
    //first line is to connect on a local server for testing, second is to connect on the heroku server

    //RUNNING SERVER ON LOCAL FOR DEV
    ws = new WebSocket("ws://127.0.0.1:8080");

    //RUNNING SERVER ON HEROKU FOR DEPLOYMENT
    //ws = new WebSocket("wss://babylongameserver.herokuapp.com/");

    //Ask username to user and removes " and ' characters. If user fails to give a username, give them a random id
    var username_entry = prompt("Enter your username: ");
    var formatted_username_entry = username_entry?.replace(/["']/g, "");
    username = formatted_username_entry ? formatted_username_entry : "";

    if (username == "") {
        username = makeid(10);
    }

    //small timeout to give the websocket the time to open
    setTimeout(() => {
        setUsername();
        setSocketMessageListener();
    },
        100);

}

//login to the server with the given username
function setUsername() {
    ws.send(
        JSON.stringify(
            {
                route: "login",
                content: username
            }));
}

//our websocket listen to incoming messages
function setSocketMessageListener() {
    //procedure on messages received from server
    ws.addEventListener('message', function (event) {
        let messageReceived = JSON.parse(event.data);
        switch (messageReceived.route) {

            //login route: create avatar, link the new avatar with its user in the player_list, set my sphere if I'm the one who logged in
            case 'login': {
                var sphere = new Avatar(scene, messageReceived.content);
                var sender_name = messageReceived.content;
                player_list.set(sender_name, sphere);
                if (sender_name == username) {
                    set_my_sphere();
                    setPositionUpdateSender()
                }
                console.log("LOGIN IN: " + messageReceived.content + ", new player list: " + player_list);
                break;
            }

            case 'usernameSetter': {
                // var sphere = new Avatar(scene);
                console.log("USERNAME UPDATED FROM " + username + " TO " + messageReceived.content);
                username = messageReceived.content;
                // player_list.set(username, sphere);
                // set_my_sphere();
            }

            //logout route: dispose player's avatar, remove player's entry in the player_list map
            case 'logout': {
                //console.log("received logout message: " + messageReceived.content);
                let avatar_to_disconnect = player_list.get(messageReceived.content);
                if (avatar_to_disconnect !== undefined) avatar_to_disconnect.dispose();
                player_list.delete(messageReceived.content);
                break;
            }

            //message: TODO?
            case 'message': {
                //let messaSgeContent = JSON.parse(messageReceived.content);
                //console.log("received message message: " + messageReceived.content);
                break;
            }

            //message: TODO? might get removed
            case 'userlist': {
                //console.log("received userlist message: " + messageReceived.content);
                break;
            }

            //position: add the player if they aren't in our list yet, move the avatar to the input position
            case 'position': {
                //We parse the message's content to get something of the form:
                //{pos_x: int, pos_y: int, pos_z: int, username: string}
                let messageContent: receiveContent = JSON.parse(messageReceived.content);
                if (messageContent.username == username) break;

                //We find the avatar linked to the username in our player_list map
                let avatar_to_move = player_list.get(messageContent.username);

                //if we found nothing, we add the username in the player_list map, and associate it with a new avatar
                if (avatar_to_move == undefined) {
                    console.log("failed ot find player " + messageContent.username + ", adding him to the list.");
                    player_list.set(messageContent.username, new Avatar(scene, messageContent.username));
                    avatar_to_move = player_list.get(messageContent.username);
                }

                //avatar_to_move should now be affected and we can give it the new position
                if (avatar_to_move) {
                    avatar_to_move.position = new Vector3(messageContent.pos_x, messageContent.pos_y, messageContent.pos_z);
                    let target = avatar_to_move.position.add(messageContent.direction);
                    avatar_to_move.lookAt(target);

                    //console.log(new Vector3(messageContent.direction.x, messageContent.direction.y, messageContent.direction.z));
                    //avatar_to_move.setDirection(new Vector3(messageContent.direction.x, messageContent.direction.y, messageContent.direction.z));
                }

                //for debugging, should NOT happen ever
                else { console.log("WTF???????") }

                //console.log("position avatar to move: " + avatar_to_move?.position);

                break;
            }

            case 'fireBullet': {
                if (messageReceived.username != username) {
                    let firing_player = player_list.get(messageReceived.username)
                    if (firing_player) { firing_player.addBullet(true); }
                }
                break
            }

            //default: the route received does not exist. Should not happen, look for debugging!
            default: console.log("received a message from server with an invalid route: " + messageReceived.route);
        }
    })
}

//the client regularly send its player's position
function setPositionUpdateSender() {
    setInterval(() => {
        let player: Avatar | undefined;

        if (username && (player = player_list.get(username))) {
            var position_player = JSON.stringify({
                pos_x: player.position.x,
                pos_y: player.position.y,
                pos_z: player.position.z,
                username: username,
                direction: player.getDirection(Axis.Z)
            })

            //console.log("will send " + position_player);
            ws.send(
                JSON.stringify({
                    route: "position",
                    content: position_player
                }))
        }
        else { console.log("player not in his own client DEBUG: " + username + ", " + player_list.get(username) + ", in " + [...player_list.entries()]); }

    },
        50);
}

export function objToPosition({ position }: Mesh): position {
    return { pos_x: position.x, pos_y: position.y, pos_z: position.y }
}