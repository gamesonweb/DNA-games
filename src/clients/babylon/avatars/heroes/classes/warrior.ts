import { Scene } from "babylonjs";
import { ModelEnum } from "../../../others/models";
import { Health } from "../../meshWithHealth";
import { Player } from "../player";

export class Warrior extends Player {
    constructor(scene: Scene, avatar_username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, ModelEnum.Warrior.rootMesh!.clone(), {})
    }

    attack_0(onlyDisplay = false) {
        console.log("TODO attack_0 not implemented on warrior");
    }

    attack_1(onlyDisplay = false) {

    }
}