import { Scene } from "babylonjs";
import { Health } from "../../meshWithHealth";
import { Player } from "../player";

export class Warrior extends Player {
    constructor(scene: Scene, avatar_username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, {})
    }

    attack_0(onlyDisplay = false) {
        console.log("TODO attack_0 not implemented on warrior");
    }

    attack_1(onlyDisplay = false) {

    }
}