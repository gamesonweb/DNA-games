import { Axis, Scene } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { scene } from "../../../main";
import { ModelEnum } from "../../../others/models";
import { distance, isInCone } from "../../../others/tools";
import { Fireball } from "../../weapons/projectiles/fireball";
import { Player } from "../player";

export class Mage extends Player {
    constructor(scene: Scene, avatar_username: string) {
        super(scene, avatar_username, ModelEnum.Mage.rootMesh!.clone(), 90, 0.2)

        this.class = "Mage"

        this.tableAttackcd[0] = 1500
        this.tableAttackcd[1] = 8000
    }

    attack_0(onlyDisplay = false) {
        console.log("mage ", this.name, " casts normal attack");
        scene.projectileList.push(new Fireball(this, onlyDisplay, {}))
    }

    attack_1(onlyDisplay = false) {
        //long cone infligeant un burst de degats et l'etat brulure, poussant les ennemis
        console.log("mage ", this.name, " casts special attack");

        //ANIMATION (TODO)

        //DAMAGE
        if (!onlyDisplay) {
            wsClient.monster_list.forEach(monster => {
                if (isInCone(monster.shape.position, this.shape.position, 10, this.shape.getDirection(Axis.Z), 1, Math.PI / 3)) {
                    console.log("distance Mage-Monstre: ", distance(this.shape.position, monster.shape.position));
                    monster.take_damage(this.shape.position, 10, (10 - distance(this.shape.position, monster.shape.position, true)) / 2);
                    monster.triggerStatus("burn");
                }
            })
        }
    }
}