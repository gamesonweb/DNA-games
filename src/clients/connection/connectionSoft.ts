import { Scene, Vector3 } from "babylonjs"
import { AvatarSoft } from "../babylon/avatars/avatarSoft"

export const serverMessages = {
    SET_USERNAME: "usernameSetter",
    LOGIN: "login",
    LOGOUT: "logout",
    MESSAGE: "message",
    POSITION: "position",
    MONSTER_DATA: "monster_data",
    KILL_MONSTER: "kill_monster",
    MOVE_MONSTER: "move_monster",
    DAMAGE_MONSTER: "damage_monster",
    FIRE_BULLET: "fireBullet",
    HOUR: "hour",
    SPAWN_MONSTER: "spawn_monster",
    MONSTER_HIT: "monster_hit"
}

export type receiveContent = {
    pos_x: number, pos_y: number, pos_z: number,
    username: string, direction: Vector3, health?: number, maxHealth?: number
}

export type position = { pos_x: number, pos_y: number, pos_z: number, }


export abstract class ConnectionSoft<T extends AvatarSoft, S extends AvatarSoft, R extends Scene> extends WebSocket {
    player_list: Map<string, T>
    night_monster_list: Map<string, S>
    username: string;
    scene?: R;

    constructor(url: string, scene?: R) {
        super(url)
        this.onopen = this.onOpen
        this.onerror = this.onError;
        this.player_list = new Map<string, T>();
        this.night_monster_list = new Map<string, S>();
        this.username = "";
        this.scene = scene;
    }

    abstract onOpen(evt?: Event): any;
    abstract onError(): any;

    setEventListener() {
        console.log("Setting event listener");

        this.addEventListener('message', event => {
            let messageReceived = JSON.parse(event.data);
            switch (messageReceived.route) {
                case serverMessages.LOGIN: {
                    this.login(messageReceived)
                    break;
                }

                case serverMessages.SET_USERNAME: {
                    this.set_username(messageReceived)
                    break;
                }

                //logout route: dispose player's avatar, remove player's entry in the player_list map
                case serverMessages.LOGOUT: {
                    this.logout(messageReceived)
                    break;
                }

                //message route: write the message content in the chat if the sender isn't us
                case serverMessages.MESSAGE: {
                    this.message(messageReceived)
                    break;
                }

                //position: add the player if they aren't in our list yet, move the avatar to the input position
                case serverMessages.POSITION: {
                    this.position(messageReceived)
                    break;
                }

                //monster_data: update the monster's data
                case serverMessages.MONSTER_DATA: {
                    this.monster_data(messageReceived)
                    break;
                }

                //monster_hit: the monster try to hit players
                case serverMessages.MONSTER_HIT: {
                    this.monster_hit(messageReceived)
                    break;
                }

                //kill_monster: kill the monster with passed username
                case serverMessages.KILL_MONSTER: {
                    this.kill_monster(messageReceived)
                    break;
                }

                //route fireBullet: fireBullet with sender's avatar if the ender is not ourselves
                case serverMessages.FIRE_BULLET: {
                    this.fire_bullet(messageReceived)
                    break;
                }

                case serverMessages.HOUR: {
                    this.hour(messageReceived.content)
                    break;
                }

                //default: the route received does not exist. Should not happen, look for debugging!
                default: throw new Error("Error : this functionality is to be implemented")
            }
        })
    }

    /**
     * logout route: dispose player's avatar, remove player's entry in the player_list map
     * @param messageReceived 
     */
    logout(messageReceived: any) {
        let avatar_to_disconnect = this.player_list.get(messageReceived.content);
        if (avatar_to_disconnect !== undefined) avatar_to_disconnect.dispose();
        this.player_list.delete(messageReceived.content);
        console.log("LOGIN OUT: " + messageReceived.content);
    }

    /**
     * kill_monster: kill the monster with passed username
     * @param messageReceived 
     */
    kill_monster(messageReceived: any) {
        let monster_to_kill = this.night_monster_list.get(messageReceived.content);
        if (monster_to_kill !== undefined) monster_to_kill.dispose();
        this.night_monster_list.delete(messageReceived.content);
    }

    abstract set_username(messageReceived: any): void;

    /**
     * login route: create avatar, link the new avatar with its user in the player_list, set my sphere if I'm the one who logged in
     * @param messageReceived 
     */
    abstract login(messageReceived: any): void;

    /**
     * message route: write the message content in the chat if the sender isn't us
     * @param messageReceived 
     */
    abstract message(messageReceived: any): void;
    /**
     * monster_data: update the monster's data
     * @param messageReceived 
     */
    abstract monster_data(messageReceived: any): void;
    abstract move_monster(messageReceived: any): void;
    abstract damage_monster(messageReceived: any): void;

    /**
     * route fireBullet: fireBullet with sender's avatar if the ender is not ourselves
     * @param messageReceived 
     */
    abstract fire_bullet(messageReceived: any): void;

    /**
     * position: add the player if they aren't in our list yet, move the avatar to the input position
     * @param messageReceived 
     */
    abstract position(messageReceived: any): void;
    abstract hour(messageReceived: any): void;
    abstract spawn_monster(messageReceived: any): void;

    /**
     * monster_hit: the monster try to hit players
     * @param messageReceived 
     */
    abstract monster_hit(messageReceived: any): void;
}