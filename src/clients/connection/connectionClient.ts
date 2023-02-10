import { Animation, Axis, Mesh, Vector3 } from "babylonjs";
import { Avatar } from "../babylon/avatars/avatarHeavy";
import { Player } from "../babylon/avatars/heroes/player";
import { Monster } from "../babylon/avatars/monsters/monster";
import { initFunction, scene, setScene, set_my_sphere } from "../babylon/main";
import { updateHour } from "../babylon/others/time";
import { getTimeToString, isVector3Equal, makeid, playerClassCreator } from "../babylon/others/tools";
import { SceneClient } from "../babylon/scene/sceneClient";
import { chatRef, initChat } from "../reactComponents/chat";
import { askUsername } from "../reactComponents/login";
import { ErrorNoServer } from "../reactComponents/noServer";
import { ConnectionSoft, position, receiveContent, serverMessages } from "./connectionSoft";
import { SERVER_LINK } from "./server_address";

export var username: string;
export var meshes: Mesh[] = [];

export let wsClient: ConnectionClient;

export class ConnectionClient extends ConnectionSoft<Player, Monster, SceneClient> {
    timeSendPing: number;
    constructor() {
        super(SERVER_LINK);
        this.timeSendPing = 0;
    }

    onOpen(evt?: Event | undefined) {
        console.log("Opening");
        askUsername()
    }

    onError() {
        ErrorNoServer()
    }

    set_username(messageReceived: any): void {
        console.log("USERNAME UPDATED FROM " + username + " TO " + messageReceived.content);
        username = messageReceived.content;
    }

    ping(): void {
        let pingMs = Date.now() - this.timeSendPing;
        // console.log("PING: " + pingMs + "ms");
    }

    login(messageReceived: any): void {
        var sender_name = messageReceived.content;
        if (sender_name === username) {
            var sphere = playerClassCreator(username, username)
            this.player_list.set(sender_name, sphere);
            set_my_sphere();
            setPositionUpdateSender()
        }
        console.log("LOGIN IN: " + messageReceived.content);
        chatRef.current!.displayStatusInChat(getTimeToString(), messageReceived.content, true);
    }

    message(messageReceived: any): void {
        let messageContent = JSON.parse(messageReceived.content);
        if (messageContent.username !== username)
            chatRef.current!.writeMessageInChat(messageContent.time, messageContent.username, messageContent.message, false);
    }

    monster_data(messageReceived: any): void {
        let messageContent: receiveContent = JSON.parse(messageReceived.content);
        avatar_update_from_serveur(messageContent, this.monster_list, 100, true);
    }

    kill_all_night_monster(messageReceived: any) {
        for (const value of wsClient.monster_list.values()) {
            value.dispose();
        }
        wsClient.monster_list.clear();
    }

    move_monster(messageReceived: any): void {
    }

    damage_monster(messageReceived: any): void {
    }

    knockback_monster(messageReceived: any): void {
    }

    position(messageReceived: any): void {
        let messageContent: receiveContent = JSON.parse(messageReceived.content);
        avatar_update_from_serveur(messageContent, this.player_list, 50);
    }

    hour(messageReceived: any): void {
        updateHour(messageReceived.content)
    }

    spawn_monster(messageReceived: any): void {
    }

    player_hit(messageReceived: any): void {
        let messageContent = JSON.parse(messageReceived.content);
        let avatar = wsClient.player_list.get(messageContent.username)
        if (avatar) avatar.hit(messageContent.hitmode, true);
    }

    monster_hit(messageReceived: any): void {
        let messageContent = JSON.parse(messageReceived.content);
        let monster = wsClient.monster_list.get(messageContent.username)
        //timeout to sync attack with the position of attack TODO use varriable instead of 100
        if (monster) {
            console.log("monster hit");
            monster.hit(messageContent.hitmode);
        }

    }

    static setGlobalWebSocket(): void {
        wsClient = new ConnectionClient();
    }
}



//login to the server with the given username
export function sendLogin() {
    console.log("sending login to server");
    wsClient.send(
        JSON.stringify(
            {
                route: serverMessages.LOGIN,
                content: username
            }));
}

function pingServer() {
    wsClient.timeSendPing = Date.now()
    wsClient.send(
        JSON.stringify({
            route: serverMessages.PING,
            content: username
        })
    )
}


//the client regularly send its player's position
function setPositionUpdateSender() {
    let player: Avatar | undefined;
    if (username && (player = wsClient.player_list.get(username))) sendPosition(player);
    setInterval(() => {
        let player: Avatar | undefined;
        if (username && (player = wsClient.player_list.get(username)) && (player.didSomething || !isVector3Equal(player.oldPosition, player.shape.position))) {
            sendPosition(player);
            player.oldPosition = player.shape.position.clone()
        }
    },
        50);
}

function sendPosition(player: Avatar) {
    player.shape.computeWorldMatrix(true);
    player.didSomething = false;
    var info_player = JSON.stringify({
        pos_x: player.shape.position.x,
        pos_y: player.shape.position.y,
        pos_z: player.shape.position.z,
        username: username,
        health: player.currentHealth,
        maxHealth: player.maxHealth,
        direction: player.shape.getDirection(Axis.Z),
        class: player.class,
        ydiroffset: player.offset_dir_y
    })

    //console.log("sending " + position_player);

    wsClient.send(
        JSON.stringify({
            route: serverMessages.POSITION,
            content: info_player
        }))
}

export function sendMessage(time: string, msg: string) {
    var message_player = JSON.stringify({
        username: username,
        time: time,
        message: msg
    })

    wsClient.send(
        JSON.stringify({
            route: serverMessages.MESSAGE,
            content: message_player
        }))
}

export function objToPosition({ position }: Mesh): position {
    return { pos_x: position.x, pos_y: position.y, pos_z: position.y }
}

export function avatar_update_from_serveur(data: receiveContent, list: Map<String, Avatar>, time_ms: number, isMonster: boolean = false) {
    //We parse the message's content to get something of the form:
    //{pos_x: int, pos_y: int, pos_z: int, username: string}
    if (data.username === username && list === wsClient.player_list) return

    //We find the avatar linked to the username in our list parameter map
    let avatar_to_update = list.get(data.username);

    //if we found nothing, we add the username in the list parameter map, and associate it with a new avatar
    if (avatar_to_update === undefined) {
        // console.log("failed to find name " + data.username + " in list " + list + ", adding him.");
        list.set(
            data.username,
            isMonster ?
                new Monster(scene, data.username)
                : playerClassCreator(data.class, data.username));
        avatar_to_update = list.get(data.username);
        if (avatar_to_update) {
            avatar_to_update.shape.position = new Vector3(data.pos_x, data.pos_y, data.pos_z);
        }
    }

    //avatar_to_move should now be affected and we can give it the new position
    if (avatar_to_update) {
        if (avatar_to_update.shape.position.x !== data.pos_x || avatar_to_update.shape.position.y !== data.pos_y || avatar_to_update.shape.position.z !== data.pos_z) {
            // console.log("avatar " + avatar_to_update.name + " should move");
            Animation.CreateAndStartAnimation("animMove", avatar_to_update.shape, "position", 60, Math.floor(0.7 * time_ms), avatar_to_update.shape.position, new Vector3(data.pos_x, data.pos_y, data.pos_z), Animation.ANIMATIONLOOPMODE_CONSTANT);
        }


        let target = avatar_to_update.shape.position.add(data.direction);
        avatar_to_update.shape.lookAt(target);

        avatar_to_update.offset_dir_y = data.ydiroffset

        avatar_to_update.shape.computeWorldMatrix(true)


        //update the avatar health to the data received
        let health = data.health
        avatar_to_update.healthSet(health)

    }

    //for debugging, should NOT happen ever
    else { console.log("WTF???????") }
}

export function establishConnection(name: string) {
    initFunction().then(e => {
        setScene(e)
        scene.collisionsEnabled = true
        var username_entry = name;
        var formatted_username_entry = username_entry?.replace(/["']/g, "");
        username = formatted_username_entry ? formatted_username_entry : "";

        if (username.length > 12) {
            username = username.slice(0, 12);
        }

        if (username === "") {
            username = makeid(10);
        }
        console.log("connection successfully established!");

        //GET THE PING BETWEEN CLIENT AND SERVER (CURRENTLY 1 PING RIGHT AFTER CONENCTION IS INITIALIZED, DISPLAY PING IN CONSOLE)
        pingServer();

        initChat()
    });
}
