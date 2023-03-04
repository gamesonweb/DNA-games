import { Axis, InstancedMesh, Mesh, Ray, Vector3 } from "babylonjs";
import { sphere1 } from "../../main";
import { SceneSoft } from "../../scene/sceneSoft";
import { Player } from "../classes/heroes/player";
import { ModelEnum } from "../classes/models";

export class Glider {

    gliderRay: Ray
    gliderInstance: InstancedMesh | undefined
    mergedmodel = Mesh.MergeMeshes((ModelEnum.Glider.rootMesh?.clone() as Mesh).getChildMeshes() as Mesh[]) as Mesh;
    player: Player

    constructor(player: Player) {
        this.player = player
        this.gliderRay = new Ray(this.player.shape.position, new Vector3(0, -1, 0), 6);
    }

    switchGlide() {
        if (this.player.getStatus() !== "Falling" && this.player.getStatus() !== "Gliding") return
        if (this.player.getStatus() !== "Gliding") {
            //USE RAYCAST TO CHECK IF GROUND IS FAR ENOUGH.
            var hits = this.player.shape.getScene().multiPickWithRay(this.gliderRay, (m) => { return m.isPickable });
            var filtered = hits?.filter(e => (e.pickedMesh?.name !== this.player.shape?.name) && (e.pickedMesh?.name !== this.player.shape.getChildMeshes()[0].name))
            if (filtered !== undefined && filtered.length > 0) { return }

            //UPDATE STATUS AND UPDATE LASTGROUND POINT FOR FALL DAMAGE
            this.player.update_status("Gliding")
            this.player.shape.onCollide = function (mesh) {
                console.log("collide while gliding");
                if (sphere1) {
                    if (sphere1.getStatus() !== "Gliding") sphere1.shape.onCollide = function (mesh) { return }
                    else sphere1.switchGlide()
                }
            }
            this.player.updateLastGround()
            this.player.gravity_acceleration = SceneSoft.gravityIntensity * 3
        } else {
            this.player.updateLastGround()
            this.player.shape.onCollide = function (mesh) { return }
            this.player.update_status("Falling")
        }
    }

    deployGlider(on: boolean) {
        if (on) {
            this.gliderInstance = this.mergedmodel.createInstance("glider_" + this.player.name)
            this.gliderInstance.isPickable = false
            this.gliderInstance.checkCollisions = false
            this.gliderInstance.setDirection(this.player.shape.getDirection(Axis.Z))
            this.gliderInstance.position = this.player.shape.position.add(new Vector3(0, 1.45, 0)).subtract(this.player.shape.getDirection(Axis.Z).normalize().scale(0.4))
            this.gliderInstance.computeWorldMatrix(true);
            this.player.shape.addChild(this.gliderInstance)
        } else {
            if (this.gliderInstance) this.gliderInstance.dispose()
        }
    }
}