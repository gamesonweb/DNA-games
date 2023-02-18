import { Axis, Scene } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { isInCone, distance } from "../../../others/tools";
import { ModelEnum } from "../models";
import { Monster } from "../monsters/monster";
import { Player } from "./player";

export class Assassin extends Player {
    constructor(scene: Scene, avatar_username: string) {
        super(scene, avatar_username, ModelEnum.Assassin.intrinsicParameterMesh)
    }

    attack_0(onlyDisplay = false) {
        //coup monocible, inflige des dégats et l'état bleeding

        if (!onlyDisplay) {
            console.log("assassin normal attack");

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

        console.log("assassin cast special attack");

        if (!onlyDisplay) {

            this.takeHits = false
            this.canHit = false

            var gotHit: Monster[] = []

            var movingInterval = setInterval(() => {
                this.shape.moveWithCollisions(this.shape.getDirection(Axis.Z).normalize())
            }, 100 / 6)

            var damageInterval = setInterval(() => {
                wsClient.monster_list.forEach(monster => {
                    if (isInCone(monster.shape.position, this.shape.position, 3, this.shape.getDirection(Axis.Z), 2, Math.PI)) {
                        if (gotHit.includes(monster)) {
                            let direction = monster.shape.position.subtract(this.shape.position)
                            monster.knockback(direction, 2)
                        } else {
                            monster.take_damage(this.shape.position, 60, 2)
                            gotHit.push(monster)
                        }
                    }
                })
            }, 100 / 2)

            setTimeout(() => {
                console.log("assassin ends special attack");
                clearInterval(movingInterval)
                clearInterval(damageInterval)
                this.takeHits = true
                this.canHit = true
            }, 300)
        }
    }
}