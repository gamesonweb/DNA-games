import { Mesh, Scene, } from "babylonjs";
import { createLabel } from "../others/tools";
import { shadowGenerator } from "../scene/sceneClient";
import { AvatarSoft } from "./avatarSoft";
import { Health } from "./meshWithHealth";

export abstract class Avatar extends AvatarSoft {
  attack_0_date: number;
  attack_1_date: number;
  attack_2_date: number;
  attack_3_date: number;
  attack_0_cd: number;
  attack_1_cd: number;
  attack_2_cd: number;
  attack_3_cd: number;

  constructor(scene: Scene, avatar_username: string, shape: Mesh, p?: { bulletDelay?: number, health?: Health }) {

    super(scene, avatar_username, shape, p);

    let plane = createLabel(this.name, this, scene);
    plane.isPickable = false;
    this.shape.addChild(plane)

    shadowGenerator?.addShadowCaster(this.shape)

    //initialize date of last instance for each attack type
    this.attack_0_date = 0
    this.attack_1_date = 0
    this.attack_2_date = 0
    this.attack_3_date = 0

    //default attack cd, will be overrided for all usable attack
    this.attack_0_cd = 1000
    this.attack_1_cd = 1000
    this.attack_2_cd = 1000
    this.attack_3_cd = 1000
  }

  dispose(): void {
    super.dispose()
  }

  hit(hitmode_id: number, onlyDisplay = false) {
    switch (hitmode_id) {
      case 0:
        this.attack_0(onlyDisplay)
        break
      case 1:
        this.attack_1(onlyDisplay)
        break
      case 2:
        this.attack_2(onlyDisplay)
        break
      case 3:
        this.attack_3(onlyDisplay)
        break
      default:
        console.log("ERROR: tried to call hit(", hitmode_id, ") on avatar ", this);

    }
  }

  attack_0(onlyDisplay = false) {
    console.log("ERROR: tried to call non-implemented attack_0 on avatar ", this);
  }
  attack_1(onlyDisplay = false) {
    console.log("ERROR: tried to call non-implemented attack_1 on avatar ", this);
  }
  attack_2(onlyDisplay = false) {
    console.log("ERROR: tried to call non-implemented attack_2 on avatar ", this);
  }
  attack_3(onlyDisplay = false) {
    console.log("ERROR: tried to call non-implemented attack_3 on avatar ", this);
  }

}