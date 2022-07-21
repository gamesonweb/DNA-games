import { Axis, MeshBuilder, Scene, Vector3 } from "babylonjs";
import { windowExists } from "../../../reactComponents/tools";
import { sphere1 } from "../../main";
import { ModelEnum } from "../../others/models";
import { createBasicShape, distance } from "../../others/tools";
import { Avatar } from "../avatarHeavy";
import { Health } from "../meshWithHealth";

export class Monster extends Avatar {

    constructor(scene: Scene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {
        let shape = createShape(avatar_username, username, scene)
        super(scene, avatar_username, username, shape, p)
    }

    hit(hitmode: number) {
        switch (hitmode) {

            case 0:
                console.log("entering monster hitmode 0");

                if (sphere1 && distance(sphere1.shape.position, this.shape.position) < 2) {
                    /* TODO : Monster hit by spawning a hitbox ahead */

                    var hitbox = MeshBuilder.CreateBox("hit", { size: 2 });
                    var direction_monster = this.shape.getDirection(Axis.Z);
                    hitbox.lookAt(hitbox.position.add(direction_monster));
                    var position_monster = this.shape.position;
                    hitbox.position = new Vector3(
                        position_monster.x + (direction_monster.x * 0.5),
                        position_monster.y + (direction_monster.y * 0.5),
                        position_monster.z + (direction_monster.z * 0.5))

                    hitbox.showBoundingBox = true

                    // if (sphere1) {
                    //     console.log("position hitbox: ", hitbox.position);
                    //     console.log("sphere1 position: ", sphere1.shape.position);

                    //     if (hitbox.intersectsMesh(sphere1.shape.getChildMeshes()[0])) {
                    //         console.log("player should take damage!");
                    //         sphere1.take_damage(this.shape, 10);
                    //     }
                    // }
                    setTimeout(() => {
                        if (sphere1) {
                            console.log("position hitbox: ", hitbox.position);
                            console.log("sphere1 position: ", sphere1.shape.position);

                            if (hitbox.intersectsMesh(sphere1.shape.getChildMeshes()[0])) {
                                console.log("player should take damage!");
                                sphere1.take_damage(this.shape, 10);
                            }
                        }
                    }, 50)
                    setTimeout(() => hitbox.dispose(), 500);
                }

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