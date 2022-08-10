import { Scene } from "babylonjs";
import { ModelEnum } from "../../../others/models";
import { Player } from "../player";

export class Archer extends Player {
    constructor(scene: Scene, avatar_username: string) {
        super(scene, avatar_username, ModelEnum.Mage.rootMesh!.clone(), 80, 0.25)

        this.class = "Archer"

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