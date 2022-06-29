import { Animation, Axis, Mesh, Quaternion, Scene, Vector3 } from "babylonjs";
import { ws } from "../../../connection/connectionClient";
import { serverMessages } from "../../../connection/connectionSoft";
import { Avatar } from "../avatarHeavy";
import { inputStates } from "../inputListeners";
import { Health } from "../meshWithHealth";
import { Bullet } from "../weapons/bullet";

export class Player extends Avatar {

    bulletList: Bullet[];
    bulletDelay: number;

    constructor(scene: Scene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, username, p)
        this.bulletList = [];
        this.bulletDelay = p?.bulletDelay || 500;
    }

    take_damage(source: Mesh, amount: number) {
        this.healthMinus(amount);
        let direction = new Vector3(this.position.x - source.position.x, this.position.y, this.position.z - source.position.z)
        this.knockback(direction, 2)
    }

    move() {

        if (inputStates.goRight || inputStates.goLeft || inputStates.goBackward || inputStates.goForeward || inputStates.rotateRight || inputStates.rotateLeft || inputStates.attack)
            this.didSomething = true;

        let direction = this.getDirection(Axis.Z)

        let coeff_diagonal = 1
        if ((inputStates.goForeward || inputStates.goBackward) && (inputStates.goLeft || inputStates.goRight)) coeff_diagonal = Math.PI / 4;

        //forward/backward movement
        if (inputStates.goForeward) {
            this.moveWithCollisions(direction.scale(this.speed_coeff * coeff_diagonal));
        } else if (inputStates.goBackward) {
            this.moveWithCollisions(direction.scale(-this.speed_coeff * coeff_diagonal / 2));
        }

        //left/right movement
        if (inputStates.goLeft) {
            direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
            this.moveWithCollisions(direction.scale(-this.speed_coeff * coeff_diagonal / 1.5));
        } else if (inputStates.goRight) {
            direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
            this.moveWithCollisions(direction.scale(this.speed_coeff * coeff_diagonal / 1.5));
        }

        //player rotation
        if (inputStates.rotateRight) {
            this.rotate(Axis.Y, +0.05)
        } else if (inputStates.rotateLeft) {
            this.rotate(Axis.Y, -0.05)
        }

        //player's main attack
        if (inputStates.attack) {
            this.addBullet()
            ws.send(
                JSON.stringify({
                    route: serverMessages.FIRE_BULLET,
                    content: this.name
                }))

        }

        //jump
        if (inputStates.jump) {
            if (this.canJump) {
                this.isJumping = true;
                this.canJump = false
                setTimeout(() => {
                    this.isJumping = false
                }, this.timeJumping)
                // setTimeout(() => {
                //   this.canJump = true
                // }, this.timeJumping)
            }
        }
    }

    addBullet(displayOnly = false) {
        if (this.lastShoot === undefined || this.lastShoot + this.bulletDelay < Date.now()) {
            this.lastShoot = Date.now()
            this.bulletList.push(new Bullet(this, displayOnly))
        }
    }

    updateBulletPosition() {
        this.bulletList.forEach(e => e.update())
    }

    knockback(direction: Vector3, power: number) {
        let targetPosition = this.position.add(direction.scale(power))
        Animation.CreateAndStartAnimation("animKnockback", this, "position", 60, 12, this.position, targetPosition, Animation.ANIMATIONLOOPMODE_CONSTANT, undefined,
            () => {
                this.ray.origin = this.position
                this.jumpRay.origin = this.position
            })
    }
}