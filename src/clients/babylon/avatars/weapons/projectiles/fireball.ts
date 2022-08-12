import { AbstractMesh, Mesh, MeshBuilder, Vector3 } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { scene } from "../../../main";
import { distance } from "../../../others/tools";
import { AvatarSoft } from "../../avatarSoft";
import { Projectile } from "../projectile";

export class Fireball extends Projectile {
    constructor(myShooter: AvatarSoft, displayOnly: Boolean, opt: { damage?: number, range?: number, speed?: number, direction?: Vector3, position?: Vector3 }) {
        super(
            myShooter,
            displayOnly,
            opt.damage || 40,
            opt.range || 20,
            opt.speed || 0.20,
            undefined,
            { direction: opt.direction, position: opt.position })
    }

    collide(mesh: AbstractMesh | undefined) {
        if (!this.displayOnly) {
            wsClient.monster_list.forEach(monster => {
                var dist = distance(monster.shape.position, this.shape.position)
                if (dist < 4) monster.take_damage(this.shape.position, Math.round(this.damage / Math.max(dist, 1)))
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
}