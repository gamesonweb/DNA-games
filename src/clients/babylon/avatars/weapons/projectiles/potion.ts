import { AbstractMesh, Axis, Mesh, MeshBuilder, Vector3 } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { scene, sphere1 } from "../../../main";
import { distance } from "../../../others/tools";
import { AvatarSoft } from "../../avatarSoft";
import { Projectile } from "../projectile";

export class Potion extends Projectile {
    constructor(myShooter: AvatarSoft, displayOnly: Boolean, opt: { damage?: number, range?: number, speed?: number, direction?: Vector3, position?: Vector3 }) {
        var directionShooter = myShooter.shape.getDirection(Axis.Z)
        var defaultAngle = new Vector3(directionShooter.x, (myShooter.offset_dir_y + 0.2) * 4, directionShooter.z)
        super(
            myShooter,
            displayOnly,
            opt.damage || 20,
            opt.range || 50,
            opt.speed || 0.40,
            undefined,
            { direction: opt.direction || defaultAngle, position: opt.position })
    }

    collide(mesh: AbstractMesh | undefined) {
        if (sphere1 && distance(this.shape.position, sphere1?.shape.position) < 4) {
            sphere1.healthAdd(this.damage)
            sphere1.didSomething = true
        }
        if (!this.displayOnly) {
            wsClient.monster_list.forEach(monster => {
                var dist = distance(monster.shape.position, this.shape.position)
                if (dist < 4) monster.take_damage(this.shape, this.damage)
            })
        }
        this.dispose()
    }

    createShape(): Mesh {
        let sphere = MeshBuilder.CreateSphere(this.name, {
            diameter: 0.5,
            segments: 16
        }, scene);
        return sphere
    }

    update(): void {
        this.angle.y -= 0.04
        super.update()
    }
}