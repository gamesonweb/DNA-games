import { AbstractMesh, Mesh, MeshBuilder, Vector3 } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { scene } from "../../../main";
import { getAvatarByShape } from "../../../others/tools";
import { AvatarSoft } from "../../avatarSoft";
import { Projectile } from "../projectile";

export class Arrow extends Projectile {
    constructor(myShooter: AvatarSoft, displayOnly: Boolean, opt: { damage?: number, range?: number, speed?: number, direction?: Vector3, position?: Vector3 }) {
        super(
            myShooter,
            displayOnly,
            opt.damage || 40,
            opt.range || 40,
            opt.speed || 0.30,
            undefined,
            { direction: opt.direction, position: opt.position })
    }

    collide(mesh: AbstractMesh | undefined) {
        if (!this.displayOnly && mesh) {
            var monster = getAvatarByShape(mesh, [wsClient.monster_list])
            if (monster) {
                monster.take_damage(this.shape.position, this.damage)
                monster.triggerStatus("poisoned")
            }
        }
        this.dispose()
    }

    createShape(): Mesh {
        let box = MeshBuilder.CreateBox(this.name, { width: 0.2, height: 0.2, depth: 0.5 }, scene)
        return box
    }
}