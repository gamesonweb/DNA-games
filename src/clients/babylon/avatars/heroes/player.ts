import { Animation, Axis, Color3, Mesh, MeshBuilder, Quaternion, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { wsClient } from "../../../connection/connectionClient";
import { serverMessages } from "../../../connection/connectionSoft";
import { createBasicShape } from "../../others/tools";
import { Avatar } from "../avatarHeavy";
import { inputStates } from "../inputListeners";
import { Health } from "../meshWithHealth";
import { Bullet } from "../weapons/bullet";

export class Player extends Avatar {
    bulletList: Bullet[];
    bulletDelay: number;

    constructor(scene: Scene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {

        let shape = createShape(avatar_username, username, scene);
        super(scene, avatar_username, username, shape, p)
        this.bulletList = [];
        this.bulletDelay = p?.bulletDelay || 500;
    }

    take_damage(source: Mesh, amount: number) {
        this.healthMinus(amount);
        let direction = new Vector3(this.shape.position.x - source.position.x, this.shape.position.y, this.shape.position.z - source.position.z)
        this.knockback(direction, 2)
    }

    move() {

        if (inputStates.goRight || inputStates.goLeft || inputStates.goBackward || inputStates.goForeward || inputStates.rotateRight || inputStates.rotateLeft || inputStates.attack)
            this.didSomething = true;

        let direction = this.shape.getDirection(Axis.Z)

        let coeff_diagonal = 1
        if ((inputStates.goForeward || inputStates.goBackward) && (inputStates.goLeft || inputStates.goRight)) coeff_diagonal = Math.PI / 4;

        //forward/backward movement
        if (inputStates.goForeward) {
            this.shape.moveWithCollisions(direction.scale(this.speed_coeff * coeff_diagonal));
        } else if (inputStates.goBackward) {
            this.shape.moveWithCollisions(direction.scale(-this.speed_coeff * coeff_diagonal / 2));
        }

        //left/right movement
        if (inputStates.goLeft) {
            direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
            this.shape.moveWithCollisions(direction.scale(-this.speed_coeff * coeff_diagonal / 1.5));
        } else if (inputStates.goRight) {
            direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
            this.shape.moveWithCollisions(direction.scale(this.speed_coeff * coeff_diagonal / 1.5));
        }

        //player rotation
        if (inputStates.rotateRight) {
            this.shape.rotate(Axis.Y, +0.05)
        } else if (inputStates.rotateLeft) {
            this.shape.rotate(Axis.Y, -0.05)
        }

        //player's main attack
        if (inputStates.attack) {
            this.addBullet()
            this.shape.position.y += 10
            wsClient.send(
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

    knockback(direction: Vector3, power: number) {
        let targetPosition = this.shape.position.add(direction.scale(power))
        Animation.CreateAndStartAnimation("animKnockback", this.shape, "position", 60, 12, this.shape.position, targetPosition, Animation.ANIMATIONLOOPMODE_CONSTANT, undefined,
            () => {
                this.ray.origin = this.shape.position
                this.jumpRay.origin = this.shape.position
            })
    }


    updateBulletPosition() {
        this.bulletList.forEach(e => e.update())
    }
}

function createShape(avatar_username: String, username: String, scene: Scene) {
    return createBasicShape(avatar_username, username, scene);
}