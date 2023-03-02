import { Vector3 } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { serverMessages } from "../../../../connection/connectionSoft";
import { scene, sphere1 } from "../../../main";
import { SceneSoft } from "../../../scene/sceneSoft";
import { Avatar } from "../../avatarHeavy";

export abstract class Player extends Avatar {
    oxygen = 1000;

    take_damage(source: Vector3, amount: number, knockback_power = 1) {
        if (!this.takeHits) return
        this.healthMinus(amount);
        if (knockback_power) {
            let direction = this.shape.position.subtract(source)
            this.knockback(direction.normalize(), knockback_power / this.weightCategory)
        }

        scene.triggerPostProcessAnimation("hit", scene.hitVignetteAnimation)
    }

    send_this_take_damage(amount: number) {
        wsClient.send(
            JSON.stringify({
                route: serverMessages.DAMAGE_PLAYER,
                content: JSON.stringify({ username: this.name, damage: amount })
            }))
    }

    healthSet(newHealth: number | undefined): number {
        let hs = super.healthSet(newHealth)
        if (this.currentHealth <= 0) {
            this.takeHits = false
            if (this === sphere1) {
                this.update_status("Dying", false, true)
                setTimeout(() => { if (scene) scene.triggerPostProcessAnimation("fadin", scene.fadinVignetteAnimation) }, 3000)
                setTimeout(() => { if (this) this.respawn() }, 8000)
            }
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

    switchGlide() {
        if (this.getStatus() !== "Falling" && this.getStatus() !== "Gliding") return
        if (this.getStatus() !== "Gliding") {
            //USE RAYCAST TO CHECK IF GROUND IS FAR ENOUGH
            this.update_status("Gliding")
            this.updateLastGround()
            //SPAWN GLIDER AND ANIMATE PLAYER
            this.gravity_acceleration = SceneSoft.gravityIntensity
        } else {
            this.updateLastGround()
            this.update_status("Falling")
        }
    }
}
