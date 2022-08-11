import { Scene } from "babylonjs";
import { scene } from "../../../main";
import { ModelEnum } from "../../../others/models";
import { Potion } from "../../weapons/projectiles/potion";
import { Player } from "../player";

export class Healer extends Player {
    constructor(scene: Scene, avatar_username: string) {
        super(scene, avatar_username, ModelEnum.Mage.rootMesh!.clone(), 100, 0.2)

        this.class = "Healer"

        this.tableAttackcd[0] = 1200
        this.tableAttackcd[1] = 15000
    }

    attack_0(onlyDisplay = false) {
        //lance un projectile infligeant des degats si touche un ennemi et soignant si touche un allié
        console.log("mage ", this.name, " casts normal attack");
        scene.projectileList.push(new Potion(this, onlyDisplay, {}))
    }

    attack_1(onlyDisplay = false) {
        //créer un cercle devant lui qui heal sur la durée et boost l'attaque, puis inflige des dégats aux monstres à la fin
    }
}