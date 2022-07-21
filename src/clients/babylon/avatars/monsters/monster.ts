import { Scene } from "babylonjs";
import { windowExists } from "../../../reactComponents/tools";
import { sphere1 } from "../../main";
import { ModelEnum } from "../../others/models";
import { createBasicShape, distance } from "../../others/tools";
import { Avatar } from "../avatarHeavy";
import { Health } from "../meshWithHealth";

export class Monster extends Avatar {
    addBullet(displayOnly: boolean): void {
        throw new Error("Method not implemented.");
    }

    constructor(scene: Scene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {
        let shape = createShape(avatar_username, username, scene)
        super(scene, avatar_username, username, shape, p)
    }

    hit(hitmode: number) {
        switch (hitmode) {

            case 0:
                console.log("entering monster hitmode 0");

                /* TODO : Monster hit by spawning a hitbox ahead */

                // var hitbox = MeshBuilder.CreateBox("hit", { size: 2 });
                // var direction_monster = this.getDirection(Axis.Z);
                // hitbox.lookAt(hitbox.position.add(direction_monster));
                // var position_monster = this.position;
                // hitbox.position = new Vector3(
                //     position_monster.x + (direction_monster.x * 0.5),
                //     position_monster.y + (direction_monster.y * 0.5),
                //     position_monster.z + (direction_monster.z * 0.5))

                // if (sphere1) {
                //     if (hitbox.intersectsPoint(sphere1.position)) {
                //         console.log("player should take damage!");
                //         sphere1.take_damage(this, 10);
                //     }
                // }
                // setTimeout(() => hitbox.dispose(), 500);

                if (sphere1 && distance(sphere1.shape.position, this.shape.position) < 1.5) sphere1.take_damage(this.shape, 10);
                break;

            default:
                console.log("tried hitting with mode " + hitmode + ", but " + this + " does not have such mode");
                break;

        }
    }
}

function createShape(avatar_username: String, username: String, scene: Scene) {
    let shape = createBasicShape(avatar_username, username, scene)
    if (windowExists() && ModelEnum.PumpkinMonster.rootMesh != undefined) {
        shape.isVisible = false
        let model = ModelEnum.PumpkinMonster.rootMesh?.clone();
        model.isPickable = false;
        shape.addChild(model)
    }
    return shape
}