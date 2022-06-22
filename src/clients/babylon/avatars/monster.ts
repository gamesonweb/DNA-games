import { Avatar } from "./avatar";
import { Health } from "../meshWithHealth";
import { MyScene } from "../scene";

export class Monster extends Avatar {
    constructor(scene: MyScene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, username, p)
    }
}