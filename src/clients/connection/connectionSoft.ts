import { Vector3 } from "babylonjs"
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

export abstract class ConnectionSoft extends WebSocket {
    player_list: Map<string, AvatarSoft>
    night_monster_list: Map<string, AvatarSoft>

    constructor(url: string) {
        super(url)
        this.onopen = this.onOpen(undefined)
        this.onerror = this.onError();
        this.player_list = new Map<string, AvatarSoft>;
        this.night_monster_list = new Map<string, AvatarSoft>
    }

    abstract onOpen(evt?: Event): any;
    abstract onError(): any;

    logout(messageReceived: any) {
        let avatar_to_disconnect = this.player_list.get(messageReceived.content);
        if (avatar_to_disconnect !== undefined) avatar_to_disconnect.dispose();
        this.player_list.delete(messageReceived.content);
        console.log("LOGIN OUT: " + messageReceived.content);
    }

    kill_monster(messageReceived: any) {
        let monster_to_kill = this.night_monster_list.get(messageReceived.content);
        if (monster_to_kill !== undefined) monster_to_kill.dispose();
        this.night_monster_list.delete(messageReceived.content);
    }

    abstract set_username(messageReceived: any): void;
    abstract login(messageReceived: any): void;
    abstract message(messageReceived: any): void;
    abstract monster_data(messageReceived: any): void;
    abstract move_monster(messageReceived: any): void;
    abstract damage_monster(messageReceived: any): void;
    abstract fire_bullet(messageReceived: any): void;
    abstract position(messageReceived: any): void;
    abstract hour(messageReceived: any): void;
    abstract spawn_monster(messageReceived: any): void;
    abstract monster_hit(messageReceived: any): void;
}