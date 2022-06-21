import { Avatar } from "./avatar";
import { Scene } from "babylonjs";
import { Health } from "../meshWithHealth";

export class Monster extends Avatar {
    constructor(scene: Scene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, username, p)
    }
}