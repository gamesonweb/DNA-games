import { Mesh, Scene, Vector3 } from "babylonjs";
import { createBasicShape } from "../../others/tools";
import { Avatar } from "../avatarHeavy";
import { Health } from "../meshWithHealth";
import { Bullet } from "../weapons/bullet";

export class Player extends Avatar {
    bulletList: Bullet[];
    bulletDelay: number;

    constructor(scene: Scene, avatar_username: string, p?: { bulletDelay?: number, health?: Health }) {

        let shape = createShape(avatar_username, scene);
        super(scene, avatar_username, shape, p)
        this.bulletList = [];
        this.bulletDelay = p?.bulletDelay || 1000;
    }

    take_damage(source: Mesh, amount: number) {
        this.healthMinus(amount);
        let direction = new Vector3(this.shape.position.x - source.position.x, this.shape.position.y - source.position.y, this.shape.position.z - source.position.z)
        direction.normalize();
        direction.y += 0.5
        this.knockback(direction, 1)
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