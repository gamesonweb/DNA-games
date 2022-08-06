import { Mesh, Scene } from "babylonjs";
import { createBasicShape } from "../../others/tools";
import { Avatar } from "../avatarHeavy";

export abstract class Player extends Avatar {

    constructor(scene: Scene, avatar_username: string, model: Mesh, health: number, speed: number) {

        let shape = createShape(avatar_username, scene);
        super(scene, avatar_username, shape, model, health, speed)
    }

    take_damage(source: Mesh, amount: number, knockback_power = 1) {
        this.healthMinus(amount);
        let direction = this.shape.position.subtract(source.position)
        this.knockback(direction, knockback_power / this.weightCategory)
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

function createShape(avatar_username: String, scene: Scene) {
    return createBasicShape(avatar_username, scene);
}