import { Mesh, MeshBuilder, Ray, Scene, Vector3 } from "babylonjs";
import { AvatarSoft } from "./avatarSoft";
import { Health } from "./meshWithHealth";

export class AvatarFictive extends AvatarSoft {
    constructor(scene: Scene, avatar_username: string, shape: Mesh, health?: Health) {
        super(scene, avatar_username, shape, { health });
        this.name = avatar_username

        // sphere.checkCollisions = true;
        this.gravity_acceleration = -0.05;
        this.speed_coeff = 0.20;
    }
    dispose(): void {
        super.dispose()
    }
}