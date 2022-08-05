import { Scene } from "babylonjs";
import { ModelEnum } from "../../../others/models";
import { Health } from "../../meshWithHealth";
import { Player } from "../player";

export class Healer extends Player {
    constructor(scene: Scene, avatar_username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, ModelEnum.Mage.rootMesh!.clone(), {})
    }

    attack_0(onlyDisplay = false) {
        //lance un projectile infligeant des degats si touche un ennemi et soignant si touche un allié
    }

    attack_1(onlyDisplay = false) {
        //créer un cercle devant lui qui heal sur la durée et boost l'attaque, puis inflige des dégats aux monstres à la fin
    }
}