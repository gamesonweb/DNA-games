import { Axis, Scene } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { ModelEnum } from "../../../others/models";
import { isInCone } from "../../../others/tools";
import { Player } from "../player";

export class Warrior extends Player {
    constructor(scene: Scene, avatar_username: string) {
        super(scene, avatar_username, ModelEnum.Warrior.rootMesh!.clone(), 120, 0.2)

        this.tableAttackcd[0] = 1500
        this.tableAttackcd[1] = 12000
    }

    attack_0(onlyDisplay = false) {
        if (!onlyDisplay) {
            wsClient.monster_list.forEach(monster => {
                if (isInCone(monster.shape.position!, this.shape.position, 3, this.shape.getDirection(Axis.Z), 1, Math.PI / 2)) {
                    // console.log("Successful hit");
                    monster.take_damage(this.shape, 40);
                }
            })
        }
    }

    attack_1(onlyDisplay = false) {
        //attack tournoyante sur la durée + invicibilité
    }
}