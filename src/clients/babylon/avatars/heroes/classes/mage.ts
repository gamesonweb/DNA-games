import { Axis, InstantiatedEntries, Mesh, Scene } from "babylonjs";
import { wsClient } from "../../../../connection/connectionClient";
import { scene } from "../../../main";
import { ModelEnum } from "../../../others/models";
import { distance, isInCone } from "../../../others/tools";
import { Fireball } from "../../weapons/projectiles/fireball";
import { Player } from "../player";
import { CharacterState } from "../../avatarSoft";

export class Mage extends Player {
    modelContainer: InstantiatedEntries;
    constructor(scene: Scene, avatar_username: string) {
        var modelContainer = ModelEnum.Ranger.duplicate(ModelEnum.Ranger.container)
        super(scene, avatar_username, modelContainer.rootNodes[0] as Mesh, 90, 0.2)

        this.modelContainer = modelContainer

        for (let aniCounter = 0; aniCounter < modelContainer.animationGroups.length; aniCounter++) {
            for (let index = 0; index < modelContainer.animationGroups[aniCounter].targetedAnimations.length; index++) {
                let animation = modelContainer.animationGroups[aniCounter].targetedAnimations[index].animation
                animation.enableBlending = true
                animation.blendingSpeed = 0.1
            }
        }

        this.class = "Mage"

        this.tableAttackcd[0] = 1500
        this.tableAttackcd[1] = 8000
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
        if (new_status != this.status) {
            var animation_indice = this.get_status_indice(this.status)
            if (animation_indice != -1) {
                this.modelContainer.animationGroups[animation_indice].stop()
            }
            this.status = new_status
            animation_indice = this.get_status_indice(new_status)
            if (animation_indice != -1) {
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
                break
            case CharacterState.Walking_fw:
                animation_indice = 1
                break
            case CharacterState.Running:
                break
            case CharacterState.Falling:
                break
            case CharacterState.Idle:
                break
            case CharacterState.Jumping:
                break
            case CharacterState.Punching:
                this.modelContainer.animationGroups[0].play()
                animation_indice = 0
                break
            case CharacterState.Swimming:
                break
            default:
                console.log("error animation: " + this.name + " in status " + this.status);
        }
        return animation_indice
    }
}