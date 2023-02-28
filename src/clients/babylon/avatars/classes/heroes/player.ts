import { Vector3 } from "babylonjs";
import { scene } from "../../../main";
import { Avatar } from "../../avatarHeavy";

export abstract class Player extends Avatar {
    oxygen = 1000;

    take_damage(source: Vector3, amount: number, knockback_power = 1) {
        if (!this.takeHits) return
        this.healthMinus(amount);
        let direction = this.shape.position.subtract(source)
        this.knockback(direction.normalize(), knockback_power / this.weightCategory)

        scene.triggerPostProcessAnimation("hit", scene.hitVignetteAnimation)
    }

    healthSet(newHealth: number | undefined): number {
        let hs = super.healthSet(newHealth)
        if (this.currentHealth <= 0) {
            this.update_status("Dying", false, true)
            this.takeHits = false
            setTimeout(() => { if (scene) scene.triggerPostProcessAnimation("fadin", scene.fadinVignetteAnimation) }, 3000)
            setTimeout(() => { if (this) this.respawn() }, 8000)
        }
        return hs
    }

    respawn() {
        this.healthSet(this.maxHealth)
        this.takeHits = true
        let spawnPosHeight = scene.getHeightAtPoint(0, 0)
        this.shape.setAbsolutePosition(new Vector3(0, spawnPosHeight ? spawnPosHeight + 2 : 2, 0))
        this.update_status("Idle", true, true)
    }

    underwater(isUnder: boolean) {
        if (isUnder == true) {
            if (this.getStatus() !== "Swimming") this.update_status("Swimming")
            this.oxygen--
            if (this.oxygen <= 0 && this.currentHealth > 0) this.healthSet(0)
        } else {
            this.oxygen = 1000
            if (this.getStatus() === "Swimming") this.update_status("Idle", true, true)
        }
    }
}
