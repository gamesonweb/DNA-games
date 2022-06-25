import { Avatar } from "./avatar";
import { Health } from "../meshWithHealth";
import { MyScene } from "../scene";
import { Axis, MeshBuilder, Scene, Vector3 } from "babylonjs";
import { sphere1 } from "../main";

export class Monster extends Avatar {

    constructor(scene: Scene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, username, p)
    }

    hit(hitmode: number) {
        switch (hitmode) {

            case 0:
                console.log("entering monster hitmode 0");
                var hitbox = MeshBuilder.CreateBox("hit", { size: 1 });
                var direction_monster = this.getDirection(Axis.Z);
                hitbox.lookAt(hitbox.position.add(direction_monster));
                var position_monster = this.position;
                hitbox.position = new Vector3(
                    position_monster.x + (direction_monster.x * 1.5),
                    position_monster.y + (direction_monster.y * 1.5),
                    position_monster.z + (direction_monster.z * 1.5))
                if (sphere1) {
                    console.log("sphere1 position: " + sphere1.position);
                    console.log("hitbox position: " + hitbox.position);
                    if (hitbox.intersectsMesh(sphere1)) {
                        console.log("player should take damage!");
                        sphere1.take_damage(this, 10);
                    }
                }
                //Here we set a timeout in testing to see the hitbox mesh, but
                //in real utilisation the mesh would be instantly disposed.
                setTimeout(() => hitbox.dispose(), 500);
                break;

            default:
                console.log("tried hitting with mode " + hitmode + ", but " + this + " does not have such mode");
                break;

        }
    }
}