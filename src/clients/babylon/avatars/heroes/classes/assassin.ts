import { Scene } from "babylonjs";
import { ModelEnum } from "../../../others/models";
import { Health } from "../../meshWithHealth";
import { Player } from "../player";

export class Assassin extends Player {
    constructor(scene: Scene, avatar_username: string) {
        super(scene, avatar_username, ModelEnum.Mage.rootMesh!.clone(), 90, 0.25)

        this.tableAttackcd[0] = 1000
        this.tableAttackcd[1] = 10000
    }

    attack_0(onlyDisplay = false) {
        //coup monocible infligeant beaucoup de degats
    }

    attack_1(onlyDisplay = false) {
        //charge en avant en donnant des de lame de zone, infligeant des degats
        //rebondi sur les ennemis les plus proche, lors donnant un coup de lame (gravité désactivée)
    }
}