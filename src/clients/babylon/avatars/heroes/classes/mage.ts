import { Scene } from "babylonjs";
import { scene } from "../../../main";
import { ModelEnum } from "../../../others/models";
import { Health } from "../../meshWithHealth";
import { Bullet } from "../../weapons/bullet";
import { Player } from "../player";

export class Mage extends Player {
    constructor(scene: Scene, avatar_username: string) {
        super(scene, avatar_username, ModelEnum.Mage.rootMesh!.clone(), 90, 0.2)

        this.tableAttackcd[0] = 1500
        this.tableAttackcd[1] = 8000
    }

    attack_0(onlyDisplay = false) {
        scene.bulletList.push(new Bullet(this, onlyDisplay))
    }

    attack_1(onlyDisplay = false) {
        //long cone infligeant un burst de degats et l'etat brulure, poussant les ennemis
    }
}