import { Mesh, Ray, Vector3 } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { serverMessages } from "../../../../connection/connectionSoft";
import { scene, sphere1 } from "../../../main";
import { SceneSoft } from "../../../scene/sceneSoft";
import { Avatar } from "../../avatarHeavy";
import { ModelEnum } from "../models";

export abstract class Player extends Avatar {
    oxygen = 1000;
    gliderRay = new Ray(this.shape.position, new Vector3(0, -1, 0), 6);

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
            //USE RAYCAST TO CHECK IF GROUND IS FAR ENOUGH.
            var hits = this.shape.getScene().multiPickWithRay(this.gliderRay, (m) => { return m.isPickable });
            var filtered = hits?.filter(e => (e.pickedMesh?.name !== this.shape?.name) && (e.pickedMesh?.name !== this.shape.getChildMeshes()[0].name))
            if (filtered !== undefined && filtered.length > 0) { return }

            //UPDATE STATUS AND UPDATE LASTGROUND POINT FOR FALL DAMAGE
            this.update_status("Gliding")
            this.shape.onCollide = function (mesh) {
                console.log("collide while gliding");
                if (sphere1) {
                    if (sphere1.getStatus() !== "Gliding") sphere1.shape.onCollide = function (mesh) { return }
                    else sphere1.switchGlide()
                }
            }
            this.updateLastGround()
            this.gravity_acceleration = SceneSoft.gravityIntensity * 3

            //SPAWN GLIDER AND ANIMATE PLAYER

            // let gliderModel = ModelEnum.Glider.rootMesh as Mesh;
            // console.log(gliderModel);
            // let childs = gliderModel.getChildMeshes() as Mesh[];
            // console.log(childs);
            // let mergedmodel = Mesh.MergeMeshes(childs) as Mesh;

            let modelContainer = ModelEnum.Glider.intrinsicParameterMesh.duplicateModel();
            let rootModel = modelContainer.rootNodes[0] as Mesh
            console.log(rootModel);

            let gliderInstance = rootModel.createInstance("glider_" + this.name)
            gliderInstance.position = this.shape.position.add(new Vector3(0, 2, 0))
            gliderInstance.computeWorldMatrix(true);
            gliderInstance.isPickable = false
            gliderInstance.checkCollisions = false
            //this.shape.addChild(gliderInstance)
            console.log("you: ", this.shape.position, ", glider: ", gliderInstance.position);

        } else {
            this.updateLastGround()
            this.shape.onCollide = function (mesh) { return }
            this.update_status("Falling")
        }
    }
}
