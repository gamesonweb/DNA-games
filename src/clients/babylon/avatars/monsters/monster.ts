import { Axis, Scene, Vector3 } from "babylonjs";
import { wsClient } from "../../../connection/connectionClient";
import { serverMessages } from "../../../connection/connectionSoft";
import { sphere1 } from "../../main";
import { ModelEnum } from "../../others/models";
import { createBasicShape, isInCone } from "../../others/tools";
import { Avatar } from "../avatarHeavy";

export class Monster extends Avatar {

    constructor(scene: Scene, avatar_username: string, health = 100, speed = 0.2) {
        let shape = createBasicShape(avatar_username, scene)
        super(scene, avatar_username, shape, ModelEnum.PumpkinMonster.rootMesh!.clone(), health, speed, ModelEnum.PumpkinMonster.intrinsicParameterMesh)
        this.shape.name = this.name
    }

    take_damage(source: Vector3, amount: number, knockback_power = 1) {
        if (!this.takeHits) return
        wsClient.send(
            JSON.stringify({
                route: serverMessages.DAMAGE_MONSTER,
                content: JSON.stringify({ username: this.name, damage: amount })
            }))
        let direction = this.shape.position.subtract(source)
        if (knockback_power === 0) return;
        this.knockback(direction, knockback_power, false)
    }

    knockback(direction: Vector3, knockback_power: number, cumulate = false): void {
        let power = knockback_power / this.weightCategory
        if (this.canMove || cumulate) {
            wsClient.send(
                JSON.stringify({
                    route: serverMessages.KNOCKBACK_MONSTER,
                    content: JSON.stringify({ username: this.name, direction: direction, power: power })
                }))
        }
    }

    //The monster hit in front of him. The hit is represented by a hitbox (an invisible mesh), which damage the player if they interesect
    attack_0(onlyDisplay = false) {
        //ANIMATION

        //DAMAGE (DELAYED: GIVE PLAYER TIME TO REACT + SYNC WITH AI POSITION - MUST BE >= 100)
        setTimeout(() => {
            if (this) {
                if (isInCone(sphere1?.shape.position!, this.shape.position, 2, this.shape.getDirection(Axis.Z), 1, Math.PI / 4)) {
                    // console.log("Successful hit");
                    sphere1?.take_damage(this.shape.position, 10);
                }
            }
        },
            120
        )
    }
}