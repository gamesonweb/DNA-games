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


        this.attack_0_cd = 1000
    }

    attack_0(onlyDisplay = false) {
        if (!this.attack_0_date || this.attack_0_date + this.attack_0_cd < Date.now()) {
            this.attack_0_date = Date.now()
            scene.bulletList.push(new Bullet(this, onlyDisplay))
        }
    }

    attack_1(onlyDisplay = false) {

    }
}