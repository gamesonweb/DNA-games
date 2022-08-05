import { Scene } from "babylonjs";
import { ModelEnum } from "../../../others/models";
import { Health } from "../../meshWithHealth";
import { Player } from "../player";

export class Healer extends Player {
    constructor(scene: Scene, avatar_username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, ModelEnum.Mage.rootMesh!.clone(), {})
    }

    attack_0(onlyDisplay = false) {

    }

    attack_1(onlyDisplay = false) {

    }
}