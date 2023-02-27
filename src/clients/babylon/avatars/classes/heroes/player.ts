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

        if (this.currentHealth <= 0) {
            this.update_status("Dying", false)
            this.takeHits = false
            setTimeout(() => { if (this) this.respawn() }, 5000)
        }
    }

    respawn() {
        this.healthSet(this.maxHealth)
        this.takeHits = true
        this.update_status("Idle", true, true)
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
