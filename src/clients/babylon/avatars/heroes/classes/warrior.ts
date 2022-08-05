import { Axis, Scene } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { ws } from "../../../../connection/connectionFictive";
import { ModelEnum } from "../../../others/models";
import { isInCone } from "../../../others/tools";
import { Health } from "../../meshWithHealth";
import { Player } from "../player";

export class Warrior extends Player {
    constructor(scene: Scene, avatar_username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, ModelEnum.Warrior.rootMesh!.clone(), {})

        this.attack_0_cd = 1000
    }

    attack_0(onlyDisplay = false) {
        if (!this.attack_0_date || this.attack_0_date + this.attack_0_cd < Date.now()) {
            console.log("warrior uses attack_0");
            this.attack_0_date = Date.now()
            if (!onlyDisplay) {
                wsClient.night_monster_list.forEach(monster => {
                    if (isInCone(monster.shape.position!, this.shape.position, 3, this.shape.getDirection(Axis.Z), 1, Math.PI / 2)) {
                        // console.log("Successful hit");
                        monster.take_damage(this.shape, 40);
                    }
                })
            }
        }
    }

    attack_1(onlyDisplay = false) {

    }
}