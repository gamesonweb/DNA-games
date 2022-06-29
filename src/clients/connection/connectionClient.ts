import { Animation, Axis, Mesh, Vector3 } from "babylonjs";
import { Avatar } from "../babylon/avatars/avatarHeavy";
import { Player } from "../babylon/avatars/heroes/player";
import { Monster } from "../babylon/avatars/monsters/monster";
import { initFunction, scene, setScene, set_my_sphere } from "../babylon/main";
import { updateHour } from "../babylon/others/time";
import { getTimeToString, isVector3Equal, makeid } from "../babylon/others/tools";
import { SceneClient } from "../babylon/scene/sceneClient";
import { chatRef, initChat } from "../reactComponents/chat";
import { askUsername } from "../reactComponents/login";
import { ErrorNoServer } from "../reactComponents/noServer";
import { ConnectionSoft, position, receiveContent, serverMessages } from "./connectionSoft";

export var username: string;
export var meshes: Mesh[] = [];

export let wsClient: ConnectionClient;

export class ConnectionClient extends ConnectionSoft<Player, Monster, SceneClient> {
    constructor() {
        //RUNNING SERVER ON LOCAL FOR DEV
        super("ws://127.0.0.1:8080");
        // RUNNING SERVER ON HEROKU FOR DEPLOYMENT
        // super("wss://mmoactiongameserver.herokuapp.com/");
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
        this.username = messageReceived.content;
    }

    login(messageReceived: any): void {
        var sphere = new Player(scene, messageReceived.content, username);
        var sender_name = messageReceived.content;
        this.player_list.set(sender_name, sphere);
        if (sender_name === username) {
            set_my_sphere();
            setPositionUpdateSender()
        }
        console.log("LOGIN IN: " + messageReceived.content);
        chatRef.current!.displayStatusInChat(getTimeToString(), messageReceived.content, true);
    }

    message(messageReceived: any): void {
        let messageContent = JSON.parse(messageReceived.content);
        if (messageContent.username !== this.username)
            chatRef.current!.writeMessageInChat(messageContent.time, messageContent.username, messageContent.message, false);
    }

    monster_data(messageReceived: any): void {
        let messageContent: receiveContent = JSON.parse(messageReceived.content);
        avatar_update_from_serveur(messageContent, this.night_monster_list, 500, true);
        let d = new Date();
        if (messageContent.username == "zombie0") console.log("received z0 update: " + d.getMilliseconds());
    }

    move_monster(messageReceived: any): void {
        throw new Error("Method not implemented.");
    }

    damage_monster(messageReceived: any): void {
        throw new Error("Method not implemented.");
    }

    fire_bullet(messageReceived: any): void {
        if (messageReceived.content !== username) {
            let firing_player = this.player_list.get(messageReceived.content)
            if (firing_player) {
                firing_player.addBullet(true);
            }
        }
    }

    position(messageReceived: any): void {
        let messageContent: receiveContent = JSON.parse(messageReceived.content);
        avatar_update_from_serveur(messageContent, this.player_list, 50);
    }

    hour(messageReceived: any): void {
        updateHour(messageReceived.content)
    }

    spawn_monster(messageReceived: any): void {
        throw new Error("Method not implemented.");
    }

    monster_hit(messageReceived: any): void {
        let messageContent = JSON.parse(messageReceived.content);
        console.log("monster hits: " + messageContent.username + ", hitmode: " + messageContent.hitmode);
        let monster = this.night_monster_list.get(messageContent.username);
        if (monster) monster.hit(messageContent.hitmode);
        else console.log("monster " + messageContent.username + "tried to hit but doesn't exist");
    }

    static setGlobalWebSocket(): void {
        wsClient = new ConnectionClient();
    }
}



//login to the server with the given username
function setUsername() {
    wsClient.send(
        JSON.stringify(
            {
                route: serverMessages.LOGIN,
                content: username
            }));
}


//the client regularly send its player's position
function setPositionUpdateSender() {
    let player: Avatar | undefined;
    if (username && (player = wsClient.player_list.get(username))) sendPosition(player);
    setInterval(() => {
        let player: Avatar | undefined;
        if (username && (player = wsClient.player_list.get(username)) && (player.didSomething || !isVector3Equal(player.oldPosition, player.position))) {
            sendPosition(player);
            player.oldPosition = player.position.clone()
        }
    },
        50);
}

function sendPosition(player: Avatar) {
    player.computeWorldMatrix(true);
    player.didSomething = false;
    var position_player = JSON.stringify({
        pos_x: player.position.x,
        pos_y: player.position.y,
        pos_z: player.position.z,
        username: username,
        health: player.currentHealth,
        maxHealth: player.maxHealth,
        direction: player.getDirection(Axis.Z)
    })

    //console.log("sending " + position_player);

    wsClient.send(
        JSON.stringify({
            route: serverMessages.POSITION,
            content: position_player
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
        console.log("failed to find name " + data.username + " in list " + list + ", adding him.");
        list.set(
            data.username,
            isMonster ?
                new Monster(scene, data.username, username, {
                    health: {
                        maxHealth: data.maxHealth,
                        currentHealth: data.health
                    }
                })
                : new Player(scene, data.username, username, {
                    health: {
                        maxHealth: data.maxHealth,
                        currentHealth: data.health
                    }
                }));
        avatar_to_update = list.get(data.username);
        if (avatar_to_update) avatar_to_update.position = new Vector3(data.pos_x, data.pos_y, data.pos_z);
    }

    if (avatar_to_update?.name == "zombie0") {
        console.log("current position: " + avatar_to_update.position);
        console.log("received pos: " + data.pos_x + ", " + data.pos_y + ", ", + data.pos_z);
    }

    //avatar_to_move should now be affected and we can give it the new position
    if (avatar_to_update) {
        if (avatar_to_update.position.x !== data.pos_x || avatar_to_update.position.y !== data.pos_y || avatar_to_update.position.z !== data.pos_z) {
            if (avatar_to_update.name == "zombie0") console.log("starting move anim for z0");
            Animation.CreateAndStartAnimation("animMove", avatar_to_update, "position", 60, Math.floor(0.7 * time_ms), avatar_to_update.position, new Vector3(data.pos_x, data.pos_y, data.pos_z), Animation.ANIMATIONLOOPMODE_CONSTANT);
        }


        let target = avatar_to_update.position.add(data.direction);
        avatar_to_update.lookAt(target);

        avatar_to_update.computeWorldMatrix(true)


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
        setUsername();
        wsClient.setEventListener()
        initChat()
    });
}