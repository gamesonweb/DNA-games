import { Animation, Axis, Mesh, Vector3 } from "babylonjs";
import { chatRef } from "..";
import { Avatar } from "./avatar";
import { scene, set_my_sphere } from "./main";
import { updateHour } from "./time";
import { isVector3Equal, makeid } from "./tools";

export var ws: WebSocket;
export var player_list: Map<string, Avatar> = new Map();
export var night_monster_list: Map<string, Avatar> = new Map();
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

    if (username.length > 12) {
        username = username.slice(0, 12);
    }

    if (username == "") {
        username = makeid(10);
    }

    //we start our request process when the connection is established
    ws.onopen = (e) => {
        console.log("connection successfully established!");
        setUsername();
        setSocketMessageListener();
    };

    // setTimeout(() => {
    //     setUsername();
    //     setSocketMessageListener();
    // },
    //     100);

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
        //console.log(event.data);
        let messageReceived = JSON.parse(event.data);
        switch (messageReceived.route) {

            //login route: create avatar, link the new avatar with its user in the player_list, set my sphere if I'm the one who logged in
            case 'login': {
                var sphere = new Avatar(scene, messageReceived.content, username);
                var sender_name = messageReceived.content;
                player_list.set(sender_name, sphere);
                if (sender_name == username) {
                    set_my_sphere();
                    setPositionUpdateSender()
                }
                console.log("LOGIN IN: " + messageReceived.content);
                break;
            }

            case 'usernameSetter': {
                console.log("USERNAME UPDATED FROM " + username + " TO " + messageReceived.content);
                username = messageReceived.content;
            }

            //logout route: dispose player's avatar, remove player's entry in the player_list map
            case 'logout': {
                let avatar_to_disconnect = player_list.get(messageReceived.content);
                if (avatar_to_disconnect !== undefined) avatar_to_disconnect.dispose();
                player_list.delete(messageReceived.content);
                console.log("LOGIN OUT: " + messageReceived.content);
                break;
            }

            //message route: write the message content in the chat if the sender isn't us
            case 'message': {
                let messageContent = JSON.parse(messageReceived.content);
                if (messageContent.username == username) break;
                chatRef.current!.writeMessageInChat(messageContent.time, messageContent.username, messageContent.message, false);
                break;
            }

            //position: add the player if they aren't in our list yet, move the avatar to the input position
            case 'position': {
                let messageContent: receiveContent = JSON.parse(messageReceived.content);
                position_update(messageContent, player_list);
                break;
            }

            //monster_data: update the monster's data
            case 'monster_data': {
                let messageContent: receiveContent = JSON.parse(messageReceived.content);
                position_update(messageContent, night_monster_list);
                break;
            }

            //kill_monster: kill the monster with passed username
            case 'kill_monster': {
                let monster_to_kill = night_monster_list.get(messageReceived.content);
                if (monster_to_kill !== undefined) monster_to_kill.dispose();
                night_monster_list.delete(messageReceived.content);
                break;
            }

            //route fireBullet: fireBullet with sender's avatar if the ender is not ourselves
            case 'fireBullet': {
                if (messageReceived.content != username) {
                    let firing_player = player_list.get(messageReceived.content)
                    if (firing_player) {
                        firing_player.addBullet(true);
                    }
                }
                break;
            }

            case 'hour': {
                updateHour(messageReceived.content)
                break;
            }

            case 'hour': {
                updateHour(messageReceived.content)
            }

            //default: the route received does not exist. Should not happen, look for debugging!
            default: console.log("received a message from server with an invalid route: " + messageReceived.route);
        }
    })
}

//the client regularly send its player's position
function setPositionUpdateSender() {
    let player: Avatar | undefined;
    if (username && (player = player_list.get(username))) sendPosition(player);
    setInterval(() => {
        let player: Avatar | undefined;
        if (username && (player = player_list.get(username)) && (player.didSomething || !isVector3Equal(player.old_position, player.position))) {
            sendPosition(player);
            player.old_position = player.position.clone()
        }
    },
        50);
}

function sendPosition(player: Avatar) {
    player.didSomething = false;
    var position_player = JSON.stringify({
        pos_x: player.position.x,
        pos_y: player.position.y,
        pos_z: player.position.z,
        username: username,
        direction: player.getDirection(Axis.Z)
    })

    //console.log("sending " + position_player);

    ws.send(
        JSON.stringify({
            route: "position",
            content: position_player
        }))
}

export function sendMessage(time: string, msg: string) {
    var message_player = JSON.stringify({
        username: username,
        time: time,
        message: msg
    })

    ws.send(
        JSON.stringify({
            route: "message",
            content: message_player
        }))
}

export function objToPosition({ position }: Mesh): position {
    return { pos_x: position.x, pos_y: position.y, pos_z: position.y }
}

function position_update(data: receiveContent, list: Map<String, any>) {
    //We parse the message's content to get something of the form:
    //{pos_x: int, pos_y: int, pos_z: int, username: string}
    if (data.username == username) return

    //We find the avatar linked to the username in our list parameter map
    let avatar_to_move = list.get(data.username);

    //if we found nothing, we add the username in the list parameter map, and associate it with a new avatar
    if (avatar_to_move == undefined) {
        console.log("failed ot find player " + data.username + ", adding him to the list.");
        list.set(data.username, new Avatar(scene, data.username, username));
        avatar_to_move = list.get(data.username);
    }

    //avatar_to_move should now be affected and we can give it the new position
    if (avatar_to_move) {
        if (avatar_to_move.position.x != data.pos_x || avatar_to_move.position.y != data.pos_y || avatar_to_move.position.z != data.pos_z) {
            Animation.CreateAndStartAnimation("animMove", avatar_to_move, "position", 60, 3, avatar_to_move.position, new Vector3(data.pos_x, data.pos_y, data.pos_z), Animation.ANIMATIONLOOPMODE_CONSTANT);
        }
        //avatar_to_move.position = new Vector3(data.pos_x, data.pos_y, data.pos_z);
        let target = avatar_to_move.position.add(data.direction);
        avatar_to_move.lookAt(target);
    }

    //for debugging, should NOT happen ever
    else { console.log("WTF???????") }
}