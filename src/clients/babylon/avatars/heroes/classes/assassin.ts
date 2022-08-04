import { Scene } from "babylonjs";
import { Health } from "../../meshWithHealth";
import { Player } from "../player";

export class Assassin extends Player {
    constructor(scene: Scene, avatar_username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, {})
    }

    attack_0(onlyDisplay = false) {

    }

    attack_1(onlyDisplay = false) {

    }
}