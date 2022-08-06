import { Axis, Mesh, Scene } from "babylonjs";
import { wsClient } from "../../../connection/connectionClient";
import { serverMessages } from "../../../connection/connectionSoft";
import { sphere1 } from "../../main";
import { ModelEnum } from "../../others/models";
import { createBasicShape, isInCone } from "../../others/tools";
import { Avatar } from "../avatarHeavy";

export class Monster extends Avatar {

    constructor(scene: Scene, avatar_username: string, health = 100, speed = 0.2) {
        let shape = createBasicShape(avatar_username, scene)
        super(scene, avatar_username, shape, ModelEnum.PumpkinMonster.rootMesh!.clone(), health, speed)
        this.shape.name = this.name
    }

    take_damage(source: Mesh, amount: number, knockback_power = 1) {
        wsClient.send(
            JSON.stringify({
                route: serverMessages.DAMAGE_MONSTER,
                content: JSON.stringify({ username: this.name, damage: amount })
            }))
        let direction = this.shape.position.subtract(source.position)
        if (knockback_power == 0) return;
        let power = knockback_power / this.weightCategory
        wsClient.send(
            JSON.stringify({
                route: serverMessages.KNOCKBACK_MONSTER,
                content: JSON.stringify({ username: this.name, direction: direction, power: power })
            }))
    }

    //The monster hit in front of him. The hit is represented by a hitbox (an invisible mesh), which damage the player if they interesect
    attack_0(onlyDisplay = false) {
        // if (sphere1 && distance(sphere1.shape.position, this.shape.position) < 2) {
        //     /* TODO : Monster hit by spawning a hitbox ahead */

        //     var hitbox = MeshBuilder.CreateBox("hit", { size: 2 });
        //     var direction_monster = this.shape.getDirection(Axis.Z);
        //     hitbox.lookAt(hitbox.position.add(direction_monster));
        //     var position_monster = this.shape.position;
        //     hitbox.position = new Vector3(
        //         position_monster.x + (direction_monster.x * 0.5),
        //         position_monster.y + (direction_monster.y * 0.5),
        //         position_monster.z + (direction_monster.z * 0.5))

        //     hitbox.visibility = 0.00001;
        //     hitbox.checkCollisions = false;
        //     hitbox.showBoundingBox = true;

        //     setTimeout(() => {
        //         if (sphere1) {
        //             // console.log("position hitbox: ", hitbox.position);
        //             // console.log("sphere1 position: ", sphere1.shape.position);

        //             if (hitbox.intersectsMesh(sphere1.shape)) {
        //                 // console.log("player should take damage!");
        //                 sphere1.take_damage(this.shape, 10);
        //             }
        //         }
        //     }, 50)
        //     setTimeout(() => hitbox.dispose(), 500);
        // }

        // console.log("zombie uses attack_0");


        if (isInCone(sphere1?.shape.position!, this.shape.position, 2, this.shape.getDirection(Axis.Z), 1, Math.PI / 4)) {
            // console.log("Successful hit");
            sphere1?.take_damage(this.shape, 10);
        }
    }
}