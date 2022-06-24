import { Avatar } from "./avatar";
import { Health } from "../meshWithHealth";
import { MyScene } from "../scene";
import { Scene } from "babylonjs";

export class Monster extends Avatar {
    constructor(scene: Scene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, username, p)
    }
}