import { Axis, Scene } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { ModelEnum } from "../../../others/models";
import { distance, isInCone } from "../../../others/tools";
import { Monster } from "../../monsters/monster";
import { Player } from "../player";

export class Assassin extends Player {
    constructor(scene: Scene, avatar_username: string) {
        super(scene, avatar_username, ModelEnum.Mage.rootMesh!.clone(), 90, 0.25)

        this.class = "Assassin"

        this.tableAttackcd[0] = 1200
        this.tableAttackcd[1] = 10000
    }

    attack_0(onlyDisplay = false) {
        //coup monocible, inflige des dégats et l'état bleeding

        if (!onlyDisplay) {
            //select the nearest monster in the attack's cone
            var targetMonster: Monster | undefined
            var distanceNearest = 5
            wsClient.monster_list.forEach(monster => {
                if (isInCone(monster.shape.position!, this.shape.position, 2, this.shape.getDirection(Axis.Z), 1, Math.PI / 3)) {
                    if (distance(this.shape.position, monster.shape.position) < distanceNearest) {
                        targetMonster = monster
                    }
                }
            })

            //si un monstre a été selectionné, lui inflige les dégâts de l'attaque
            if (targetMonster) {
                targetMonster.take_damage(this.shape.position, 20, 1.5)
                targetMonster.triggerStatus("bleed")
            }
        }
    }

    attack_1(onlyDisplay = false) {
        //charge en avant en donnant des de lame de zone, infligeant des degats
        //rebondi sur les ennemis les plus proche, lors donnant un coup de lame (gravité désactivée)
    }
}