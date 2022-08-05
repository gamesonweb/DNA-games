import { Scene } from "babylonjs";
import { ModelEnum } from "../../../others/models";
import { Health } from "../../meshWithHealth";
import { Player } from "../player";

export class Archer extends Player {
    constructor(scene: Scene, avatar_username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, ModelEnum.Mage.rootMesh!.clone(), {})

        this.tableAttackcd[0] = 800
        this.tableAttackcd[1] = 9000
    }

    attack_0(onlyDisplay = false) {
        //tire une fleche monocible avec une proba d'empoisoner l'ennemi
    }

    attack_1(onlyDisplay = false) {
        //fait un bond arrière puis tire une volée de flèche en l'air sur son ancienne position, tombant en cercle devant et infligeant des dégats
    }
}