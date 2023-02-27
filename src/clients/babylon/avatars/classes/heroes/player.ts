import { Vector3 } from "babylonjs";
import { scene } from "../../../main";
import { Avatar } from "../../avatarHeavy";

export abstract class Player extends Avatar {

    take_damage(source: Vector3, amount: number, knockback_power = 1) {
        if (!this.takeHits) return
        this.healthMinus(amount);
        let direction = this.shape.position.subtract(source)
        this.knockback(direction.normalize(), knockback_power / this.weightCategory)

        scene.triggerVignetteHit()
    }

    // addBullet(displayOnly = false) {
    //     if (this.lastShoot === undefined || this.lastShoot + this.bulletDelay < Date.now()) {
    //         this.lastShoot = Date.now()
    //         this.bulletList.push(new Bullet(this, displayOnly))
    //     }
    // }


    // updateBulletPosition() {
    //     this.bulletList.forEach(e => e.update())
    // }
}
