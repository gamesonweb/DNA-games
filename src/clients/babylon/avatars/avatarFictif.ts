import { Mesh, Scene } from "babylonjs";
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
}