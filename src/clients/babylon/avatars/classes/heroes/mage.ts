import { Axis, Scene } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { scene } from "../../../main";
import { isInCone, distance } from "../../../others/tools";
import { CharacterState } from "../../avatarSoft";
import { Fireball } from "../../weapons/projectiles/fireball";
import { ModelEnum } from "../models";
import { Player } from "./player";

export class Mage extends Player {

    constructor(scene: Scene, avatar_username: string) {
        super(scene, avatar_username, ModelEnum.Ranger.intrinsicParameterMesh)

        for (let aniCounter = 0; aniCounter < this.modelContainer.animationGroups.length; aniCounter++) {
            console.log("set up animation transition for groupe " + aniCounter + " (" + this.modelContainer.animationGroups[aniCounter].name);

            for (let index = 0; index < this.modelContainer.animationGroups[aniCounter].targetedAnimations.length; index++) {
                let animation = this.modelContainer.animationGroups[aniCounter].targetedAnimations[index].animation
                animation.enableBlending = true
                animation.blendingSpeed = 0.08
            }
        }
    }

    attack_0(onlyDisplay = false) {
        console.log("mage ", this.name, " casts normal attack");
        scene.projectileList.push(new Fireball(this, onlyDisplay, {}))
        this.canMove = false;
        this.update_status(CharacterState.Punching)
        setTimeout(() => {
            this.canMove = true
            this.update_status(CharacterState.Idle)
        }, 1000)
    }

    attack_1(onlyDisplay = false) {
        //long cone infligeant un burst de degats et l'etat brulure, poussant les ennemis
        console.log("mage ", this.name, " casts special attack");

        //ANIMATION (TODO)

        //DAMAGE
        if (!onlyDisplay) {
            wsClient.monster_list.forEach(monster => {
                if (isInCone(monster.shape.position, this.shape.position, 10, this.shape.getDirection(Axis.Z), 1, Math.PI / 3)) {
                    console.log("distance Mage-Monstre: ", distance(this.shape.position, monster.shape.position));
                    monster.take_damage(this.shape.position, 10, (10 - distance(this.shape.position, monster.shape.position, true)) / 2);
                    monster.triggerStatus("burn");
                }
            })
        }
    }

    update_status(new_status: CharacterState) {
        if (new_status !== this.status) {
            var animation_indice = this.get_status_indice(this.status)
            if (animation_indice !== -1) {
                this.modelContainer.animationGroups[animation_indice].stop()
            }
            this.status = new_status
            animation_indice = this.get_status_indice(new_status)
            if (animation_indice !== -1) {
                this.modelContainer.animationGroups[animation_indice].reset()
                this.modelContainer.animationGroups[animation_indice].play()
                this.modelContainer.animationGroups[animation_indice].loopAnimation = true
            }
        }
    }

    get_status_indice(status: CharacterState) {
        var animation_indice = -1
        switch (status) {
            case CharacterState.Walking_bw:
                animation_indice = 9
                break
            case CharacterState.Walking_fw:
                animation_indice = 8
                break
            case CharacterState.Running:
                animation_indice = 6
                break
            case CharacterState.Falling:
                animation_indice = 1
                break
            case CharacterState.Idle:
                animation_indice = 3
                break
            case CharacterState.Jumping:
                animation_indice = 1
                break
            case CharacterState.Punching:
                animation_indice = 5
                break
            case CharacterState.Swimming:
                animation_indice = 7
                break
            case CharacterState.Dying:
                animation_indice = 0
                break
            case CharacterState.TakingHit:
                animation_indice = 2
                break
            default:
                console.log("error animation: " + this.name + " in status " + this.status);
        }
        return animation_indice
    }
}