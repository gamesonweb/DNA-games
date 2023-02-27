import { Vector3 } from "babylonjs";
import { scene } from "../../../main";
import { Avatar } from "../../avatarHeavy";

export abstract class Player extends Avatar {

    take_damage(source: Vector3, amount: number, knockback_power = 1) {
        if (!this.takeHits) return
        this.healthMinus(amount);
        let direction = this.shape.position.subtract(source)
        this.knockback(direction.normalize(), knockback_power / this.weightCategory)

        scene.triggerPostProcessAnimation("hit", scene.hitVignetteAnimation)

        if (this.currentHealth <= 0) {
            this.update_status("Dying", false)
            this.takeHits = false
            setTimeout(() => { if (scene) scene.triggerPostProcessAnimation("fadin", scene.fadinVignetteAnimation) }, 3000)
            setTimeout(() => { if (this) this.respawn() }, 8000)
        }
    }

    respawn() {
        this.healthSet(this.maxHealth)
        this.takeHits = true
        let spawnPosHeight = scene.getHeightAtPoint(0, 0)
        this.shape.setAbsolutePosition(new Vector3(0, spawnPosHeight ? spawnPosHeight + 2 : 2, 0))
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
