import { Axis, Scene, Vector3 } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { scene, sphere1 } from "../../../main";
import { ModelEnum } from "../../../others/models";
import { isInCone } from "../../../others/tools";
import { Potion } from "../../weapons/projectiles/potion";
import { Player } from "../player";

export class Healer extends Player {
    constructor(scene: Scene, avatar_username: string) {
        super(scene, avatar_username, ModelEnum.Healer.rootMesh!.clone(), ModelEnum.Healer.intrinsicParameterMesh)

        this.class = "Healer"

        this.tableAttackcd[0] = 1200
        this.tableAttackcd[1] = 6000
    }

    attack_0(onlyDisplay = false) {
        //lance un projectile infligeant des degats si touche un ennemi et soignant si touche un allié
        console.log("healer ", this.name, " casts normal attack");
        scene.projectileList.push(new Potion(this, onlyDisplay, {}))
    }

    attack_1(onlyDisplay = false) {
        //créer un cercle devant lui qui heal sur la durée et boost l'attaque, puis inflige des dégats aux monstres à la fin
        console.log("healer ", this.name, " casts special attack");

        //cercle's center
        var centerVector = new Vector3(this.shape.getDirection(Axis.Z).x, 0, this.shape.getDirection(Axis.Z).z).normalize().scale(5)
        var center = this.shape.position.add(centerVector)

        //healing interval
        var healingInterval = setInterval(() => {
            if (sphere1 && isInCone(sphere1.shape.position, center, 8, center, 2, Math.PI)) {
                sphere1.healthAdd(5)
            }
        }, 500)

        //timeout effect
        setTimeout(() => {
            console.log("healer special attack detonates");
            clearInterval(healingInterval)
            if (!onlyDisplay) {
                wsClient.monster_list.forEach(monster => {
                    if (isInCone(monster.shape.position, center, 8, center, 2, Math.PI)) {
                        monster.take_damage(center, 60, 1.5)
                    }
                })
            }
        }, 3000)
    }
}