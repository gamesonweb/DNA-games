import { Scene } from "babylonjs";
import { scene } from "../../../main";
import { ModelEnum } from "../../../others/models";
import { shadowGenerator } from "../../../scene/sceneClient";
import { Health } from "../../meshWithHealth";
import { Bullet } from "../../weapons/bullet";
import { Player } from "../player";

export class Mage extends Player {
    constructor(scene: Scene, avatar_username: string, p?: { bulletDelay?: number, health?: Health }) {
        super(scene, avatar_username, ModelEnum.Mage.rootMesh!.clone(), {})

        let model = ModelEnum.Mage.rootMesh!.clone();
        this.shape.addChild(model);
        shadowGenerator?.addShadowCaster(model);
        this.shape.isVisible = false;
        this.model = model;


        this.tableAttackcd[0] = 1500
        this.tableAttackcd[1] = 8000
    }

    attack_0(onlyDisplay = false) {
        scene.bulletList.push(new Bullet(this, onlyDisplay))
    }

    attack_1(onlyDisplay = false) {
        //long cone infligeant un burst de degats et l'etat brulure
    }
}