import { Health } from "../meshWithHealth";
import { MyScene } from "../scene";
import { Avatar } from "./avatar";

export class Player extends Avatar {
    constructor(scene: MyScene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, username, p)
    }
}