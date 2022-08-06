import { Mesh, Scene, Vector3 } from "babylonjs";
import { AvatarSoft } from "./avatarSoft";

export class AvatarFictive extends AvatarSoft {
    constructor(scene: Scene, avatar_username: string, shape: Mesh, health: number, speed = 0.2) {
        super(scene, avatar_username, shape, health, speed);
        this.name = avatar_username
        this.speed_coeff = 0.20;
    }
    dispose(): void {
        super.dispose()
    }

    knockback(direction: Vector3, power: number, cumulate = false) {
        if (this.canMove || cumulate) {
            console.log("call to knockback on ", this.name);
            direction.normalize()
            direction.y += 0.2
            direction.normalize()
            let scaledDirection = direction.scale(power / 2)
            // console.log("knockback direction: ", scaledDirection);
            this.canMove = false;

            let intervalKnockBack = setInterval(() => {
                if (this && this.shape) this.shape.moveWithCollisions(scaledDirection)
            }, 100 / 6)
            setTimeout(() => { clearInterval(intervalKnockBack) }, 150)
            setTimeout(() => { if (this) this.canMove = true }, 250)
        }
    }
}