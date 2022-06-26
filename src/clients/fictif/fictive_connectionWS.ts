import { Vector3 } from "babylonjs"

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